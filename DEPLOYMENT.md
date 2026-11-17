# 🚀 Deployment Guide: Human–AI Negotiation Study Platform

This guide outlines how to deploy the full-stack study platform (React Frontend + Express Backend + Groq LLM + MongoDB Atlas) to the cloud for free so real human participants can access it.

---

## ⚡ Method 1: Render.com (Recommended — Easiest 1-Click Full-Stack)

With our updated configuration, **the entire app runs as a single service on Render**: Express automatically serves both the API and the React frontend on the same URL (e.g. `https://neuro-study.onrender.com`), eliminating all CORS issues.

### Step 1: Push your code to GitHub
Make sure your latest code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Add tournament prizes to instructions and configure production deployment"
git push origin main
```

### Step 2: Create a Web Service on Render
1. Go to [Render.com](https://render.com) and sign in (using GitHub).
2. Click **New +** &rarr; **Web Service**.
3. Select your GitHub repository (`neuro_project`).
4. Fill in the basic settings:
   - **Name**: `neuro-negotiation-study` (or any name you choose)
   - **Region**: Closest to your participants (e.g., *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (uses repo root)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Add Environment Variables
Under the **Environment Variables** section on Render, add:
| Key | Value | Where to find it |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Copy from your local `backend/.env` |
| `GROQ_API_KEY` | `gsk_...` | Copy from your local `backend/.env` |
| `ADMIN_TOKEN` | *your-secret-password* | Any secret string to protect stats/export |
| `NODE_VERSION` | `20` | Ensures standard Node runtime |
| `CORS_ORIGIN` | `*` | Allows browser communication |

### Step 4: Deploy!
Click **Create Web Service**.
* Render will install dependencies, build the frontend (`vite build`), and start Express.
* Once done, you will receive a public HTTPS URL (e.g., `https://neuro-negotiation-study.onrender.com`).
* Share this URL with your participants!

---

## 🌐 Method 2: Vercel (Frontend) + Render / Railway (Backend)

If you prefer having the frontend on Vercel's global CDN:

### Part A: Deploy Backend on Render / Railway
1. Set Root Directory to `backend`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables: `MONGODB_URI`, `GROQ_API_KEY`, `ADMIN_TOKEN`, and `CORS_ORIGIN=*`.
5. Note your backend URL: e.g. `https://neuro-api.onrender.com`.

### Part B: Deploy Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) &rarr; **Add New Project**.
2. Select your repository.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://neuro-api.onrender.com/api`
5. Click **Deploy**.

---

## 🔒 Post-Launch Data Access & Monitoring
Once participants begin completing negotiations:
- **Real-Time Aggregate Stats**:
  Visit `https://<YOUR-URL>/api/stats` with header `x-admin-token: <ADMIN_TOKEN>`
- **Export Transcripts & Data**:
  Visit `https://<YOUR-URL>/api/export` with header `x-admin-token: <ADMIN_TOKEN>`
  This downloads the full raw JSON dataset for analysis.
