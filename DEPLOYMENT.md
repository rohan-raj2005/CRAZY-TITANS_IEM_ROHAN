# 🚀 STUDY PULSE — Production Deployment Guide

This guide details all production deployment pathways for **STUDY PULSE: AI-Based Academic Procrastination Pattern Detection System**.

---

## 📋 Table of Contents
1. [Prerequisites & Architecture](#1-prerequisites--architecture)
2. [Option A: Docker & Docker Compose (Recommended)](#2-option-a-docker--docker-compose-recommended)
3. [Option B: Single-Instance PaaS (Render / Railway / Heroku)](#3-option-b-single-instance-paas-render--railway)
4. [Option C: Decoupled Cloud (Vercel Frontend + Render Backend)](#4-option-c-decoupled-cloud-vercel--render)
5. [Option D: Traditional Cloud VPS (Ubuntu, Nginx, PM2)](#5-option-d-traditional-cloud-vps-ubuntu-nginx-pm2)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Health Checks & Verification](#7-health-checks--verification)

---

## 1. Prerequisites & Architecture

STUDY PULSE consists of:
- **ML Engine & REST API** (Node.js 20+, Express, JavaScript ML inference pipeline with 5-Fold CV XGBoost, Random Forest, Logistic Regression).
- **Interactive UI Client** (React 18, Vite 6, Tailwind CSS, Recharts, Framer Motion).

### Port Allocation:
- **Frontend**: Port `80` (Nginx/Production) or `5173` (Vite dev) / `3000` (Docker)
- **Backend API**: Port `5000` (or `PORT` environment variable)

---

## 2. Option A: Docker & Docker Compose (Recommended)

Run both frontend and backend in isolated, production-tuned containers with automatic networking and health checks.

### Step 1: Clone and Enter Repository
```bash
git clone <repository_url>
cd cerebro
```

### Step 2: Build and Launch Containers
```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d
```

### Step 3: Verify Deployment
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f
```
- **Web Application**: `http://localhost:3000`
- **REST API & Health**: `http://localhost:5000/api/health`

---

## 3. Option B: Single-Instance PaaS (Render / Railway)

In this mode, the Express backend serves both the `/api/*` endpoints and the static compiled React app from `frontend/dist`.

### Deploying to Render via `render.yaml`:
1. Push your repository to GitHub or GitLab.
2. In [Render Dashboard](https://dashboard.render.com/), click **New +** $\rightarrow$ **Blueprint**.
3. Connect your repository. Render automatically reads `render.yaml`.
4. Click **Apply**.

### Deploying to Railway:
1. In Railway, click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Set root build command:
   ```bash
   npm run install:all && npm run train && npm run build
   ```
3. Set start command:
   ```bash
   npm start
   ```

---

## 4. Option C: Decoupled Cloud (Vercel + Render)

### Backend on Render / Railway:
1. Create a **Web Service** pointing to the `backend/` directory.
2. Build Command: `npm ci && npm run train`
3. Start Command: `npm start`
4. Copy your live backend URL (e.g. `https://studypulse-api.onrender.com`).

### Frontend on Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/) $\rightarrow$ **Add New Project**.
2. Select your repository and set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://studypulse-api.onrender.com/api`
4. Click **Deploy**. SPA rewrites are already handled by `frontend/vercel.json`.

---

## 5. Option D: Traditional Cloud VPS (Ubuntu, Nginx, PM2)

### Step 1: Install Node.js 20 & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

### Step 2: Build Application
```bash
cd /var/www/studypulse
npm run install:all
npm run train
npm run build
```

### Step 3: Start Backend with PM2
```bash
cd /var/www/studypulse/backend
pm2 start src/server.js --name "studypulse-api"
pm2 startup
pm2 save
```

### Step 4: Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/studypulse`)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend compiled assets
    root /var/www/studypulse/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/studypulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Environment Variables Reference

| Variable | Scope | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | `5000` | Port for Express API server |
| `NODE_ENV` | Backend | `production` | Environment mode (`production` / `development`) |
| `VITE_API_URL` | Frontend | `http://localhost:5000/api` | Base REST API URL |

---

## 7. Health Checks & Verification

After deployment, test the key endpoints:

```bash
# 1. API Health Check
curl -s https://<your-domain>/api/health

# 2. Model Performance Benchmarks
curl -s https://<your-domain>/api/models/performance

# 3. Analytics Overview
curl -s https://<your-domain>/api/analytics

# 4. Live Student Assessment Inference
curl -X POST https://<your-domain>/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "study_year": "3rd year",
    "cgpa": 7.8,
    "weekly_study_hours": 12,
    "assignment_submission_timing": "On the deadline day",
    "last_minute_exam_preparation": "Often",
    "time_management_usage": "Sometimes",
    "procrastination_management_training": "No",
    "recovery_strategies": "Yes",
    "mobile_non_academic_usage": "3-4 hours",
    "study_session_distractions": "Moderate",
    "stress_due_to_procrastination": "Often",
    "procrastination_reasons": ["reason_distractions", "reason_poor_time_management"],
    "selectedModel": "XGBoost"
  }'
```
