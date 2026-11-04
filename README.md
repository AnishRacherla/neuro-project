# Neuro Project — LLM Negotiation Study

> **Research Question**: Does the type of persuasive appeal (**Emotional / Empathy** vs. **Rational / Economic**) change how an LLM negotiates and prices a deal?

---

## 💡 Study Design
- **2-Arm Randomized Controlled Trial**:
  - **Emotional Appeal (`empathy`)**: Focus on personal circumstances, student situation, goodwill, and warmth.
  - **Rational Appeal (`economic`)**: Focus on market facts, comparable listings, laptop condition, and alternatives.
- **AI Seller ("Max")**: Fixed starting price $500, hidden walk-away reservation price $380.
- **Model**: Groq (`openai/gpt-oss-120b` or `llama-3.3-70b-versatile` via `groq-sdk`).
- **Database**: MongoDB Atlas.
- **Balanced Random Assignment**: 50/50 allocation across the two arms.

---

## 🚀 Setup Guide

### 1. Get a Free Groq API Key
1. Go to [console.groq.com/keys](https://console.groq.com/keys).
2. Sign in with Google or GitHub (no credit card needed).
3. Click **Create API Key**, copy your key (starts with `gsk_...`).
4. Paste it into `backend/.env` under `GROQ_API_KEY`.

### 2. Configure `backend/.env`
```env
PORT=3001
MONGODB_URI=mongodb+srv://racherlaanish_db_user:ogSZIBLdHR5c8PUO@cluster0.j6ipxkc.mongodb.net/negotiation_study?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=openai/gpt-oss-120b
ADMIN_TOKEN=9a085e5c8985cde4a6eedfef3ba0a126062c29454dbde970
```

### 3. Run Locally

**Start Backend**:
```bash
cd backend
npm start
# -> Runs on http://localhost:3001
```

**Start Frontend** (in another terminal):
```bash
cd frontend
npm run dev
# -> Open http://localhost:5173
```

---

## ☁️ Deployment

### Backend (e.g. Render / Railway)
1. Push project to GitHub.
2. In [Render](https://render.com), create a **Web Service** with root directory `backend`.
3. Add Environment Variables:
   - `MONGODB_URI`: your MongoDB Atlas URI
   - `GROQ_API_KEY`: your Groq API key
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `ADMIN_TOKEN`: your secret token

### Frontend (e.g. Vercel / Netlify)
1. In [Vercel](https://vercel.com), import repo with root directory `frontend`.
2. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`

---

## 📊 Data & Statistical Analysis
- **Export Data**: `GET /api/export` (with `x-admin-token` header)
- **Run Statistical Analysis & Plots**:
  ```bash
  cd analysis
  pip install -r requirements.txt
  python analyze.py
  ```
