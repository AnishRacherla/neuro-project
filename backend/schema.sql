-- SQLite schema for LLM Negotiation Study

CREATE TABLE IF NOT EXISTS participants (
  id          TEXT PRIMARY KEY,          -- UUID e.g. P0042
  condition   TEXT NOT NULL,             -- 'empathy' | 'economic' | 'control'
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Pre-survey
  age              INTEGER,
  gender           TEXT,
  education        TEXT,
  negotiation_exp  INTEGER,  -- 1-7 scale
  llm_usage        INTEGER,  -- 1-7 scale
  trait_empathy    REAL,     -- empathy scale score
  ai_trust         REAL,     -- AI trust scale score

  -- Outcome (filled at end of chat)
  final_price      REAL,
  turns_taken      INTEGER,
  deal_reached     INTEGER,  -- 0 or 1
  first_concession REAL,
  concession_rate  REAL,

  -- Post-survey
  manipulation_check TEXT,   -- what style did they report using?
  fairness         INTEGER,  -- 1-7
  satisfaction     INTEGER,  -- 1-7
  strategy_effect  INTEGER,  -- 1-7
  completed        INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL REFERENCES participants(id),
  turn_number   INTEGER NOT NULL,
  role          TEXT NOT NULL,   -- 'user' | 'assistant'
  content       TEXT NOT NULL,
  price_offered REAL,            -- extracted price in this message (NULL if none)
  timestamp     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_participant ON messages(participant_id);

