"""analyze.py — statistical analysis for the LLM Negotiation Study.

Usage:
    set ADMIN_TOKEN=...            (same value as in backend/.env)
    python analyze.py                       # pulls /api/export from BACKEND_URL
    python analyze.py --file export.json    # analyse a saved export
    python analyze.py --demo                # synthetic data, to test the pipeline

Pre-specified structure
    Primary  (H1): final position price, empathy vs economic (Welch t, Cohen's d + bootstrap CI).
                   "Final position" = agreed price if a deal, otherwise Max's last ask → defined for EVERY participant,
                   so no-deal sessions are not silently dropped.
    Secondary    : deal rate (chi2 / logistic), price among deals only, concession rate, buyer surplus.
    H2 (timing)  : per-turn ask trajectory (mixed model ask ~ turn * condition), turn/size of first concession.
    H3 (robust)  : OLS final position ~ condition + covariates (HC3 robust SE).
    Validity     : attention checks, manipulation check (self-report + blinded LLM coding), compliance,
                   attrition by condition, scale reliability, human-vs-LLM coder kappa, guard events.
    Control (if present) is a baseline: the omnibus test and Tukey/Holm pairwise tests cover it.
"""
import argparse
import json
import os
import sys
import warnings
from itertools import combinations

import numpy as np
import pandas as pd
import requests
from scipy import stats

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
import statsmodels.formula.api as smf
from statsmodels.stats.multicomp import pairwise_tukeyhsd
from statsmodels.stats.multitest import multipletests

warnings.filterwarnings("ignore")
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:3001")
START_PRICE, RESERVATION, BUYER_VALUE = 500, 380, 450
COND_ORDER = ["economic", "empathy"]   # economic = reference level in regressions
RNG = np.random.default_rng(12345)


def hdr(title):
    print("\n" + "=" * 70 + f"\n{title}\n" + "=" * 70)


# ─── 1. Load ──────────────────────────────────────────────────────────────────
def load_raw(args):
    if args.demo:
        return demo_export()
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            return json.load(f)
    token = os.environ.get("ADMIN_TOKEN")
    if not token:
        sys.exit("Set ADMIN_TOKEN (same value as backend/.env) or use --file / --demo")
    r = requests.get(f"{BACKEND_URL}/api/export", headers={"x-admin-token": token}, timeout=60)
    r.raise_for_status()
    return r.json()


def build_frames(raw):
    rows, turns = [], []
    for p in raw:
        msgs = p.get("messages", [])
        user = [m for m in msgs if m["role"] == "user"]
        asst = [m for m in msgs if m["role"] == "assistant" and m["turnNumber"] > 0]
        deal = bool(p.get("dealReached"))
        last_ask = p.get("lastSellerAsk")
        rows.append({
            "pid": p["participantId"], "condition": p["condition"], "completed": bool(p.get("completed")),
            "chat_ended": bool(p.get("chatEnded")), "pre_done": bool(p.get("preSurveyDone")),
            "age": p.get("age"), "gender": p.get("gender"), "education": p.get("education"),
            "english": p.get("englishFluency"), "neg_exp": p.get("negotiationExp"), "haggle": p.get("haggleComfort"),
            "used_elec": p.get("usedElectronicsFreq"), "llm_usage": p.get("llmUsage"), "ai_feelings": p.get("aiHasFeelings"),
            "fair_guess": p.get("fairPriceGuess"), "max_pay": p.get("maxWillingToPay"),
            "trait_empathy": p.get("traitEmpathy"), "ai_trust": p.get("aiTrust"),
            "pre_attn": p.get("preAttentionPass"), "post_attn": p.get("postAttentionPass"),
            "deal": int(deal), "final_price": p.get("finalPrice") if deal else np.nan,
            "last_ask": last_ask, "final_position": p.get("finalPrice") if deal else last_ask,
            "turns": p.get("turnsTaken"), "end_reason": p.get("endReason"),
            "concession_rate": p.get("concessionRate"), "first_concession": p.get("firstConcession"),
            "first_concession_turn": p.get("firstConcessionTurn"), "buyer_surplus": p.get("buyerSurplus"),
            "first_buyer_offer": p.get("firstBuyerOffer"), "last_buyer_offer": p.get("lastBuyerOffer"),
            "guard_events": p.get("guardEvents", 0), "device": p.get("device"),
            "manip_emp": p.get("manipEmpathy"), "manip_eco": p.get("manipEconomic"),
            "fairness": p.get("fairness"), "satisfaction": p.get("satisfaction"), "strategy_eff": p.get("strategyEffect"),
            "svi_total": p.get("sviTotal"), "svi_outcome": p.get("sviOutcome"), "svi_self": p.get("sviSelf"),
            "svi_process": p.get("sviProcess"), "svi_rel": p.get("sviRelationship"),
            "warmth": p.get("maxWarmth"), "understood": p.get("maxUnderstood"), "believed_limit": p.get("believedLimit"),
            "realism": p.get("realism"), "effort": p.get("effort"), "truthfulness": p.get("truthfulness"),
            "n_user_msgs": len(user), "mean_user_chars": np.mean([len(m["content"]) for m in user]) if user else np.nan,
            "empathy_items": p.get("empathyItems", []), "trust_items": p.get("trustItems", []), "svi_items": p.get("sviItems", []),
        })
        turns.append({"pid": p["participantId"], "condition": p["condition"], "turn": 0, "ask": START_PRICE})
        for m in asst:
            turns.append({"pid": p["participantId"], "condition": p["condition"], "turn": m["turnNumber"], "ask": m.get("priceOffered")})
    df, tdf = pd.DataFrame(rows), pd.DataFrame(turns).dropna(subset=["ask"])
    return df, tdf


# ─── 2. Exclusions / attrition ────────────────────────────────────────────────
def attrition_and_exclusions(df):
    hdr("ATTRITION & EXCLUSIONS")
    tab = df.groupby("condition").agg(started=("pid", "size"), pre_done=("pre_done", "sum"),
                                      chat_ended=("chat_ended", "sum"), completed=("completed", "sum"))
    tab["completion_rate"] = (tab["completed"] / tab["started"]).round(3)
    print(tab)
    drop = tab["started"] - tab["completed"]
    if len(tab) > 1 and tab["completed"].sum() > 0 and drop.sum() > 0:
        chi = stats.chi2_contingency(np.c_[tab["completed"], drop])
        print(f"Differential attrition across conditions: chi2={chi[0]:.2f}, p={chi[1]:.3f}  "
              f"({'WARNING: attrition differs by condition' if chi[1] < .05 else 'no evidence of differential attrition'})")
    comp = df[df.completed].copy()
    n0 = len(comp)
    comp["attn_ok"] = (comp.post_attn == True)       # noqa: E712
    print(f"\nCompleted: {n0} | failed >=1 attention check: {(~comp.attn_ok).sum()} | "
          f"sessions with validation-guard events: {(comp.guard_events > 0).sum()}")
    return comp[comp.attn_ok].copy()


# ─── 3. Reliability ───────────────────────────────────────────────────────────
def cronbach(items):
    x = np.array(items, dtype=float)
    k = x.shape[1]
    return k / (k - 1) * (1 - x.var(axis=0, ddof=1).sum() / x.sum(axis=1).var(ddof=1))


def reliability(df):
    hdr("SCALE RELIABILITY (Cronbach's alpha; target >= .70)")
    for name, col, rev, n in [("Empathic concern (IRI-EC)", "empathy_items", [1, 3, 4], 7),
                              ("AI trust", "trust_items", [4], 5), ("SVI (8 items)", "svi_items", [1], 8)]:
        m = [[(8 - v if i in rev else v) for i, v in enumerate(r)] for r in df[col] if len(r) == n]
        if len(m) > 5:
            print(f"  {name:28s} alpha = {cronbach(m):.2f}  (n={len(m)})")


# ─── 4. Effect-size helpers ───────────────────────────────────────────────────
def cohens_d(a, b):
    na, nb = len(a), len(b)
    sp = np.sqrt(((na - 1) * a.var(ddof=1) + (nb - 1) * b.var(ddof=1)) / (na + nb - 2))
    return (a.mean() - b.mean()) / sp if sp > 0 else np.nan


def boot_ci(a, b, fn, n=5000):
    vals = [fn(RNG.choice(a, len(a)), RNG.choice(b, len(b))) for _ in range(n)]
    return np.percentile(vals, [2.5, 97.5])


def group_table(df, col):
    g = df.groupby("condition")[col]
    t = pd.DataFrame({"n": g.count(), "mean": g.mean(), "sd": g.std(), "median": g.median()})
    t["ci95_low"] = t["mean"] - 1.96 * t["sd"] / np.sqrt(t["n"])
    t["ci95_high"] = t["mean"] + 1.96 * t["sd"] / np.sqrt(t["n"])
    return t.round(3)


def compare_outcome(df, col, label):
    hdr(f"{label}  [{col}]")
    d = df.dropna(subset=[col])
    print(group_table(d, col))
    groups = {c: g[col].values.astype(float) for c, g in d.groupby("condition") if len(g) > 1}
    if "empathy" in groups and "economic" in groups:
        a, b = groups["empathy"], groups["economic"]
        t, p = stats.ttest_ind(a, b, equal_var=False)
        u, pu = stats.mannwhitneyu(a, b, alternative="two-sided")
        diff = a.mean() - b.mean()
        dlo, dhi = boot_ci(a, b, lambda x, y: x.mean() - y.mean())
        glo, ghi = boot_ci(a, b, cohens_d, 2000)
        print(f"\nH1  empathy vs economic: diff = {diff:.2f} (95% bootstrap CI {dlo:.2f} to {dhi:.2f})")
        print(f"    Welch t = {t:.3f}, p = {p:.4f} | Mann-Whitney p = {pu:.4f} | "
              f"Cohen's d = {cohens_d(a, b):.2f} (95% CI {glo:.2f} to {ghi:.2f})")
        sign = "NEGATIVE" if col in ("final_position", "final_price") else "POSITIVE" if col == "concession_rate" else "no directional"
        print(f"    (H1 predicts a {sign} difference for this outcome)")
    if len(groups) >= 3:
        f, p = stats.f_oneway(*groups.values())
        h, ph = stats.kruskal(*groups.values())
        ss_b = sum(len(v) * (v.mean() - d[col].mean()) ** 2 for v in groups.values())
        ss_t = ((d[col] - d[col].mean()) ** 2).sum()
        print(f"\nOmnibus: ANOVA F = {f:.3f}, p = {f_p(p)} , eta^2 = {ss_b / ss_t:.3f} | Kruskal-Wallis p = {ph:.4f}")
        print(pairwise_tukeyhsd(d[col].astype(float), d["condition"]).summary())
        pairs = list(combinations(groups, 2))
        raw = [stats.mannwhitneyu(groups[x], groups[y]).pvalue for x, y in pairs]
        adj = multipletests(raw, method="holm")[1]
        print("Holm-corrected Mann-Whitney:", {f"{x} vs {y}": round(float(q), 4) for (x, y), q in zip(pairs, adj)})


def f_p(p):
    return f"{p:.4f}"


# ─── 5. Deal rate ─────────────────────────────────────────────────────────────
def deal_analysis(df):
    hdr("DEAL RATE BY CONDITION")
    print(df.groupby("condition")["deal"].agg(["mean", "sum", "count"]).round(3))
    tab = pd.crosstab(df["condition"], df["deal"])
    if tab.shape == (2, 2):
        print("Fisher exact p =", round(stats.fisher_exact(tab)[1], 4))
    elif tab.shape[0] > 1 and tab.shape[1] > 1:
        print("Chi-square p =", round(stats.chi2_contingency(tab)[1], 4))
    print("\nChat end reasons:\n", pd.crosstab(df["condition"], df["end_reason"]))


# ─── 6. H2 timing ─────────────────────────────────────────────────────────────
def timing_analysis(df, tdf):
    hdr("H2: WHEN DOES MAX CONCEDE?")
    d = df.copy()
    d["first_concession_turn"] = d["first_concession_turn"].fillna(d["turns"] + 1)   # censored: never conceded
    print(group_table(d, "first_concession_turn"))
    print(group_table(d, "first_concession"))
    groups = [g["first_concession_turn"].values for _, g in d.groupby("condition") if len(g) > 1]
    if len(groups) >= 2:
        print("Kruskal-Wallis on turn of first concession: p =", round(stats.kruskal(*groups)[1], 4))
    t = tdf[tdf.pid.isin(d.pid)].copy()
    t["condition"] = pd.Categorical(t["condition"], [c for c in COND_ORDER if c in t.condition.unique()])
    if t.pid.nunique() >= 10 and t.condition.nunique() >= 2:
        try:
            m = smf.mixedlm("ask ~ turn * C(condition)", t, groups=t["pid"]).fit()
            print("\nMixed model: ask ~ turn * condition + (1 | participant)\n", m.summary().tables[1])
            print("(turn:condition rows test whether the ask trajectory SLOPE differs by condition)")
        except Exception as e:                                                  # noqa: BLE001
            print("Mixed model failed:", e)


# ─── 7. H3 regression ─────────────────────────────────────────────────────────
def regression(df):
    hdr("H3: DOES THE CONDITION EFFECT SURVIVE COVARIATES?  (OLS, HC3 robust SE)")
    covs = ["trait_empathy", "ai_trust", "neg_exp", "llm_usage", "age", "first_buyer_offer"]
    d = df.dropna(subset=["final_position", "condition"] + covs).copy()
    if len(d) < 25:
        print("  Not enough complete cases yet (need ~25+).")
        return
    for c in covs:
        d[c] = (d[c] - d[c].mean()) / d[c].std()                 # standardise → coefficients per 1 SD
    d["gender_f"] = (d["gender"] == "female").astype(int)
    d["condition"] = pd.Categorical(d["condition"], [c for c in COND_ORDER if c in d.condition.unique()])
    base = smf.ols("final_position ~ C(condition)", d).fit(cov_type="HC3")
    full = smf.ols("final_position ~ C(condition) + " + " + ".join(covs) + " + gender_f", d).fit(cov_type="HC3")
    print("Unadjusted condition effects:\n", base.summary().tables[1])
    print("\nAdjusted model:\n", full.summary().tables[1])
    print(f"\nN = {int(full.nobs)}, R2 = {full.rsquared:.3f}, adj R2 = {full.rsquared_adj:.3f}")
    if d["deal"].nunique() > 1:
        lg = smf.logit("deal ~ C(condition) + " + " + ".join(covs), d).fit(disp=0)
        print("\nLogistic regression for deal (log-odds):\n", lg.summary().tables[1])


# ─── 8. Manipulation check + compliance ───────────────────────────────────────
def manipulation_check(df, coded):
    hdr("MANIPULATION CHECK")
    for col, lab in [("manip_emp", "self-reported empathy-style use"), ("manip_eco", "self-reported economic-style use")]:
        print(f"\n{lab} (1-7)\n", group_table(df, col)[["n", "mean", "sd"]])
        groups = [g[col].dropna().values for _, g in df.groupby("condition") if g[col].notna().sum() > 1]
        if len(groups) >= 2:
            print("  one-way ANOVA p =", round(stats.f_oneway(*groups)[1], 4))
    emp, eco = df[df.condition == "empathy"], df[df.condition == "economic"]
    if len(emp) and len(eco):
        d = (emp.manip_emp - emp.manip_eco).mean() , (eco.manip_eco - eco.manip_emp).mean()
        print(f"\nMean (own-style minus other-style) rating: empathy group {d[0]:.2f}, economic group {d[1]:.2f}  (should be > 0)")
    df["comp_self"] = np.where(df.condition == "empathy", df.manip_emp > df.manip_eco,
                               np.where(df.condition == "economic", df.manip_eco > df.manip_emp, True))
    if coded is not None:
        df = df.merge(coded, on="pid", how="left")
        print("\nBlinded LLM coding — share of BUYER messages with each feature (by assigned condition):")
        print(df.groupby("condition")[["c_empathy", "c_economic", "c_outside", "c_story", "c_hostile"]].mean().round(3))
        df["comp_coded"] = np.where(df.condition == "empathy", df.c_empathy > df.c_economic,
                                    np.where(df.condition == "economic", df.c_economic > df.c_empathy, True))
        df["compliant"] = df.comp_coded.fillna(df.comp_self).astype(bool)
    else:
        print("\n(no coded_messages.json — run `node backend/code_transcripts.js` for blinded transcript coding)")
        df["compliant"] = df["comp_self"]
    print("\nCompliance rate by condition:\n", df.groupby("condition")["compliant"].mean().round(3))
    return df


def coder_agreement(raw_coded_path, human_path):
    if not (os.path.exists(raw_coded_path) and os.path.exists(human_path)):
        return
    from sklearn.metrics import cohen_kappa_score
    hdr("CODER AGREEMENT (human vs blinded LLM coder)")
    llm = json.load(open(raw_coded_path, encoding="utf-8"))
    rows = [{"participant_id": pid, "turn": c["turn"], "l_emp": int(c["empathy_appeal"]), "l_eco": int(c["economic_appeal"]),
             "l_out": int(c["outside_option_claim"])} for pid, cs in llm.items() for c in cs if c.get("role") == "user"]
    m = pd.read_csv(human_path).merge(pd.DataFrame(rows), on=["participant_id", "turn"])
    for h, l, lab in [("empathy_appeal", "l_emp", "empathy"), ("economic_appeal", "l_eco", "economic"), ("outside_option_claim", "l_out", "outside option")]:
        mm = m.dropna(subset=[h])
        if len(mm) > 5:
            print(f"  {lab:15s} kappa = {cohen_kappa_score(mm[h].astype(int), mm[l]):.2f}  (n={len(mm)}; >=.60 acceptable)")


def load_coded(path):
    if not os.path.exists(path):
        return None
    coded = json.load(open(path, encoding="utf-8"))
    rows = []
    for pid, cs in coded.items():
        b = [c for c in cs if c.get("role") == "user"]
        if b:
            rows.append({"pid": pid, "c_empathy": np.mean([c["empathy_appeal"] for c in b]),
                         "c_economic": np.mean([c["economic_appeal"] for c in b]),
                         "c_outside": np.mean([c["outside_option_claim"] for c in b]),
                         "c_story": np.mean([c["personal_story"] for c in b]),
                         "c_hostile": np.mean([c["hostility_or_threat"] for c in b])})
    return pd.DataFrame(rows) if rows else None


# ─── 9. Secondary outcomes ────────────────────────────────────────────────────
def secondary(df):
    hdr("SECONDARY: BUYER EXPERIENCE (Kruskal-Wallis across conditions)")
    for col in ["svi_total", "svi_outcome", "svi_self", "svi_process", "svi_rel", "fairness", "satisfaction",
                "strategy_eff", "warmth", "understood", "believed_limit", "realism", "effort"]:
        g = [x[col].dropna().values for _, x in df.groupby("condition") if x[col].notna().sum() > 1]
        if len(g) >= 2:
            means = df.groupby("condition")[col].mean().round(2).to_dict()
            print(f"  {col:14s} {means}  p = {stats.kruskal(*g)[1]:.3f}")
    print("\nAnchoring / confounds (does the appeal change HOW buyers bargain?)")
    print(df.groupby("condition")[["first_buyer_offer", "n_user_msgs", "mean_user_chars"]].mean().round(1))
    print("\nDemand-characteristics screen: read `study_guess` free text in the export for hypothesis awareness.")


# ─── 10. Plots ────────────────────────────────────────────────────────────────
def make_plots(df, tdf):
    os.makedirs(OUT, exist_ok=True)
    sns.set_theme(style="whitegrid")
    order = [c for c in ["empathy", "economic"] if c in df.condition.unique()]
    fig, ax = plt.subplots(2, 2, figsize=(12, 9))
    sns.boxplot(data=df, x="condition", y="final_position", order=order, hue="condition", legend=False, ax=ax[0, 0])
    sns.stripplot(data=df, x="condition", y="final_position", order=order, color="k", alpha=.4, ax=ax[0, 0])
    ax[0, 0].axhline(START_PRICE, ls="--", c="red", alpha=.5); ax[0, 0].axhline(RESERVATION, ls="--", c="orange", alpha=.5)
    ax[0, 0].set_title("Final position price (deal price, else last ask)")
    sns.barplot(data=df, x="condition", y="deal", order=order, hue="condition", legend=False, errorbar=("ci", 95), ax=ax[0, 1])
    ax[0, 1].set_title("Deal rate (95% CI)")
    t = tdf[tdf.condition.isin(order)]
    sns.lineplot(data=t, x="turn", y="ask", hue="condition", hue_order=order, errorbar=("ci", 95), ax=ax[1, 0])
    ax[1, 0].set_title("Max's ask by turn (H2)")
    sns.violinplot(data=df, x="condition", y="turns", order=order, hue="condition", legend=False, ax=ax[1, 1])
    ax[1, 1].set_title("Turns used")
    plt.tight_layout()
    plt.savefig(os.path.join(OUT, "results.png"), dpi=150)
    print(f"\nPlot saved to {os.path.join(OUT, 'results.png')}")


# ─── Demo data (pipeline test only) ───────────────────────────────────────────
def demo_export(n=120):
    out = []
    for i in range(n):
        cond = ["empathy", "economic"][i % 2]
        eff = {"empathy": -12, "economic": -6}[cond]
        ask, msgs, deal = START_PRICE, [{"role": "assistant", "turnNumber": 0, "content": "hi", "priceOffered": START_PRICE}], False
        first_c, first_t, fp = None, None, None
        for t in range(1, 11):
            ask = max(RESERVATION, ask - max(0, RNG.normal(25 + eff / 3, 12)))
            ask = round(ask / 5) * 5
            msgs += [{"role": "user", "turnNumber": t, "content": "offer", "priceOffered": None},
                     {"role": "assistant", "turnNumber": t, "content": "ok", "priceOffered": ask}]
            if first_c is None and ask < START_PRICE:
                first_c, first_t = START_PRICE - ask, t
            if RNG.random() < 0.08 + 0.03 * t:
                deal, fp = True, ask
                break
        emp_items, trust_items = list(RNG.integers(1, 8, 7)), list(RNG.integers(1, 8, 5))
        out.append({
            "participantId": f"D{i:04d}", "condition": cond, "completed": True, "chatEnded": True, "preSurveyDone": True,
            "age": int(RNG.integers(18, 60)), "gender": ["female", "male"][i % 2], "education": "bachelors",
            "englishFluency": int(RNG.integers(4, 8)), "negotiationExp": int(RNG.integers(1, 8)), "haggleComfort": int(RNG.integers(1, 8)),
            "usedElectronicsFreq": 3, "llmUsage": int(RNG.integers(1, 8)), "aiHasFeelings": 3,
            "fairPriceGuess": 400, "maxWillingToPay": 450, "traitEmpathy": float(np.mean(emp_items)), "aiTrust": float(np.mean(trust_items)),
            "empathyItems": [int(x) for x in emp_items], "trustItems": [int(x) for x in trust_items],
            "preAttentionPass": True, "postAttentionPass": bool(RNG.random() > .05),
            "dealReached": deal, "finalPrice": fp, "lastSellerAsk": ask, "turnsTaken": t, "endReason": "deal" if deal else "max_turns",
            "concessionRate": (START_PRICE - (fp or ask)) / START_PRICE, "firstConcession": first_c or 0, "firstConcessionTurn": first_t,
            "buyerSurplus": BUYER_VALUE - fp if fp else None, "firstBuyerOffer": int(RNG.integers(250, 420)), "guardEvents": 0,
            "manipEmpathy": int(np.clip(RNG.normal(5.5 if cond == "empathy" else 2.5, 1), 1, 7)),
            "manipEconomic": int(np.clip(RNG.normal(5.5 if cond == "economic" else 3, 1), 1, 7)),
            "fairness": int(RNG.integers(1, 8)), "satisfaction": int(RNG.integers(1, 8)), "strategyEffect": int(RNG.integers(1, 8)),
            "sviTotal": float(RNG.uniform(2, 6)), "sviItems": [int(x) for x in RNG.integers(1, 8, 8)], "messages": msgs,
        })
    return out


# ─── Main ─────────────────────────────────────────────────────────────────────
class Tee:
    def __init__(self, *s): self.s = s
    def write(self, x): [f.write(x) for f in self.s]
    def flush(self): [f.flush() for f in self.s]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file"); ap.add_argument("--demo", action="store_true")
    args = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    sys.stdout.reconfigure(encoding="utf-8")
    report = open(os.path.join(OUT, "report.txt"), "w", encoding="utf-8")
    sys.stdout = Tee(sys.__stdout__, report)

    raw = load_raw(args)
    df_all, tdf = build_frames(raw)
    print(f"Loaded {len(df_all)} participants ({df_all.completed.sum()} completed). Conditions started: {df_all.condition.value_counts().to_dict()}")
    if args.demo:
        print("*** DEMO MODE: synthetic data — results are meaningless, this only tests the pipeline ***")
    df = attrition_and_exclusions(df_all)
    if len(df) < 6:
        print("Too few analysable participants yet.")
        return
    print(f"\nAnalysis sample after attention-check exclusions: N = {len(df)}  {df.condition.value_counts().to_dict()}")
    reliability(df)
    coded = load_coded(os.path.join(HERE, "coded_messages.json"))
    df = manipulation_check(df, coded)
    coder_agreement(os.path.join(HERE, "coded_messages.json"), os.path.join(HERE, "human_codes.csv"))

    compare_outcome(df, "final_position", "PRIMARY (ITT): final position price — all participants")
    compare_outcome(df, "final_price", "Price among deals only (conditional on deal; interpret with care)")
    compare_outcome(df, "concession_rate", "Concession rate")
    deal_analysis(df)
    timing_analysis(df, tdf)
    regression(df)
    secondary(df)

    pp = df[df.compliant]
    print(f"\nPER-PROTOCOL sensitivity: N = {len(pp)} compliant of {len(df)}")
    compare_outcome(pp, "final_position", "PER-PROTOCOL: final position price (compliant participants only)")
    make_plots(df, tdf)
    print(f"\n✅ Analysis complete. Full text report: {os.path.join(OUT, 'report.txt')}")


if __name__ == "__main__":
    main()
