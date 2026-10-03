# 🧠 CEREBRO
### AI-Based Academic Procrastination Pattern Detection System

> **Neural Intelligence for Academic Behavior**  
> *Understand Academic Behavior. Detect Procrastination Before It Becomes a Pattern.*

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [The CEREBRO Solution](#3-the-cerebro-solution)
4. [Key Features](#4-key-features)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Dataset Source & Schema](#7-dataset-source--schema)
8. [Dataset Preprocessing & Zero-Leakage Protocol](#8-dataset-preprocessing--zero-leakage-protocol)
9. [Target Creation & Mapping](#9-target-creation--mapping)
10. [Machine Learning Models](#10-machine-learning-models)
11. [5-Fold Cross-Validation & Benchmark Metrics](#11-5-fold-cross-validation--benchmark-metrics)
12. [Explainable AI (XAI) & Factor Attribution](#12-explainable-ai-xai--factor-attribution)
13. [Complete REST API Specification](#13-complete-rest-api-specification)
14. [Repository Folder Structure](#14-repository-folder-structure)
15. [Installation Guide](#15-installation-guide)
16. [Training Machine Learning Models](#16-training-machine-learning-models)
17. [Running Backend Server](#17-running-backend-server)
18. [Running Frontend Application](#18-running-frontend-application)
19. [Environment Variables Configuration](#19-environment-variables-configuration)
20. [Deployment Architecture](#20-deployment-architecture)
21. [Ethical Advisory Protocol & Limitations](#21-ethical-advisory-protocol--limitations)
22. [Future Improvements & Roadmap](#22-future-improvements--roadmap)

---

## 1. Project Overview
**CEREBRO** is a full-stack, production-grade machine learning platform engineered to analyze student behavioral patterns and assess the risk of chronic academic procrastination. Operating as an advisory decision-support system, CEREBRO combines 5-fold stratified cross-validated classification ensembles with transparent Explainable AI (XAI) feature attributions.

The platform provides a futuristic, glassmorphic AI web interface, a multi-step interactive analysis wizard, comprehensive population-level analytics, and an auditable evaluation history.

---

## 2. Problem Statement
Academic procrastination is an pervasive challenge across higher education:
- Over **70% of university students** report engaging in recurring procrastination.
- Chronic task postponement is strongly correlated with elevated stress, acute deadline panic, sleep deprivation, and compromised academic performance.
- Traditional institutional interventions are almost always **reactive** (initiated only after exam failures or missed course drops occur) rather than **preventive** (identifying behavioral risk indicators early in the academic cycle).

---

## 3. The CEREBRO Solution
CEREBRO transforms academic self-regulation through machine learning:
1. **Multidimensional Assessment:** Evaluates academic year, socio-economic factors, study volume, distraction frequency, and time-management habits.
2. **Leakage-Free Tri-Model Ensemble:** Implements Logistic Regression, Random Forest, and XGBoost Decision Trees evaluated with 5-Fold Stratified Cross-Validation.
3. **Transparent Factor Attribution:** Explains *why* a particular risk level was estimated, separating actionable risk drivers from protective habits without making unwarranted causal claims.
4. **Targeted Interventions:** Suggests structured time-management practices (e.g., Pomodoro pacing, spaced repetition, deadline buffer scheduling).

---

## 4. Key Features
- **Futuristic AI UI/UX:** Dark-mode cybernetic design featuring animated neural particle canvases, glassmorphism cards, and interactive micro-animations via Framer Motion.
- **5-Step Prediction Wizard:** Progress bar, real-time sliders, radio buttons, and 9-reason multi-selection cards.
- **Dynamic Circular Risk Gauge:** Radial SVG indicator visualizing probabilistic risk (0-100%), risk tiers (*Low*, *Moderate*, *High*), and model confidence.
- **Explainable AI (XAI) Diagnostics:** Feature impact bar breakdowns and qualitative driver categorization.
- **Anatomy of Delay Timeline:** Interactive comparative timeline contrasting procrastinator trajectories with self-regulated study flows.
- **Comprehensive Analytics Dashboard:** 7 responsive Recharts charts (Target Distribution, Study Hours, CGPA correlation, Mobile Screen Time, Procrastination Stress, Submission Timing, and Reason Rankings).
- **Model Benchmark Dashboard:** Cross-model comparison tables, Radar overlays, ROC-AUC curves, 2x2 Out-of-Fold Confusion Matrices, and Global Feature Importance rankings.
- **Auditable Student History:** In-memory / MongoDB persistence with search, risk-tier filtering, inspection modal, and JSON export.

---

## 5. System Architecture

```
                                  ┌────────────────────────┐
                                  │      Client Browser    │
                                  │ (React 18 + Vite SPA)  │
                                  └───────────┬────────────┘
                                              │ HTTP / JSON
                                              ▼
                                  ┌────────────────────────┐
                                  │   Express REST Server  │
                                  │   (Node.js Port 5000)  │
                                  └─────┬──────────────┬───┘
                                        │              │
                   ┌────────────────────┴──┐        ┌──┴─────────────────────┐
                   │  Controllers & Routes │        │ In-Memory / Mongo Repo │
                   │  - predictionRoutes   │        │ - Student Assessments  │
                   │  - analyticsRoutes    │        │ - Query & Filter Logs  │
                   │  - modelRoutes        │        └────────────────────────┘
                   └───────────┬───────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │       Services & ML Engine          │
            │  - PreprocessingService             │
            │  - ModelService (RF / XGB / LR)     │
            │  - ExplanationService (XAI)         │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │       Trained Artifacts Store       │
            │  - logistic_regression.json         │
            │  - random_forest.json               │
            │  - xgboost.json                     │
            │  - metadata.json (Encoder & Modes)  │
            └─────────────────────────────────────┘
```

---

## 6. Technology Stack

### Frontend
- **Framework:** React 18 (SPA) with Vite
- **Language:** JavaScript (`.jsx` / `.js`)
- **Styling:** Tailwind CSS + Vanilla CSS Tokens
- **Motion & Animations:** Framer Motion
- **Data Visualizations:** Recharts
- **Icons:** Lucide React
- **API Client:** Axios
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Architecture:** Layered MVC (Controllers → Services → Routes → Middleware → Models)
- **Environment & Security:** Dotenv, CORS, JSON Payload Parsing
- **Persistence:** In-Memory Session Store with optional MongoDB Mongoose ODM integration

### Machine Learning
- **Core Models:** 
  1. `LogisticRegressionModel` (Generalized Linear Model with Sigmoid Activation)
  2. `RandomForestModel` (Bagging Ensemble of Decision Trees with Subspace Sampling)
  3. `XGBoostModel` (Gradient Boosted Regression Trees with Second-Order Taylor Loss)
- **Validation Engine:** 5-Fold Stratified Cross-Validation with Zero Leakage
- **Language:** Pure JavaScript (portable JSON model artifacts)

---

## 7. Dataset Source & Schema
The dataset consists of **451 student survey responses** capturing academic habits, socio-economic background, self-regulation metrics, and delay triggers:

| Column | Type | Description |
|---|---|---|
| `study_year` | Categorical | First Year, Second Year, Third Year, Fourth Year |
| `socio-economic_background` | Categorical | Low, Lower-middle, Middle, Upper-middle, High |
| `assignment_delay_frequency` | Target Source | Always, Often, Sometimes, Occasionally, Never |
| `assignment_submission_timing` | Categorical | Always, Often, Sometimes, Occasionally, Never |
| `last_minute_exam_preparation` | Binary/Cat | Yes, No |
| `stress_due_to_procrastination` | Categorical | Not at all, Slightly, Moderately, Significantly |
| `study_hours_per_week` | Categorical/Num | 0-5 hours, 6-10 hours, 11-15 hours, 16+ hours |
| `cgpa` | Categorical/Num | Below 2.50, 2.50 - 2.99, 3.00 - 3.49, 3.50 - 3.74, 3.75 - 4.00 |
| `use_of_time_management` | Categorical | Always, Often, Sometimes, Occasionally, Never |
| `procrastination_management_training`| Binary | Yes, No |
| `procrastination_recovery_strategies`| Binary | Yes, No |
| `hours_spent_on_mobile_non_academic` | Categorical | 1-2 hours, 3-4 hours, More than 4 hours |
| `study_session_distractions` | Categorical | Never, Occasionally, Sometimes, Often, Always |
| `procrastination_reasons` | Multi-select Text| Multi-reason free-text string |

---

## 8. Dataset Preprocessing & Zero-Leakage Protocol

### Excluded Features (Target Leakage Prevention)
To strictly prevent circular predictive leakage, the following attributes are **permanently dropped**:
- `Timestamp`
- `assignment_delay_frequency` *(used exclusively to form the target, never as a feature)*
- `effect_of_procrastination_on_grades` *(downstream consequence)*
- `procrastination_and_grade_outcome` *(downstream consequence)*

### Multi-Select Reason Feature Engineering
The free-text multi-choice column `procrastination_reasons` is parsed into 9 distinct binary feature flags ($0$ = Not Selected, $1$ = Selected):
1. `reason_lack_of_interest`
2. `reason_distractions`
3. `reason_poor_time_management`
4. `reason_stress_anxiety`
5. `reason_lack_of_resources`
6. `reason_health_issues`
7. `reason_unclear_instructions`
8. `reason_personal_family_problems`
9. `reason_overconfidence`

### Missing-Value Imputation & One-Hot Encoding
- Categorical missing values are imputed using the **training fold mode**.
- One-hot encoding transforms categorical dimensions into binary indicator vectors.
- All encoders are fitted **strictly on training fold data** inside cross-validation loops to ensure zero contamination of validation folds.

---

## 9. Target Creation & Mapping
The binary classification target `procrastination` is mapped from `assignment_delay_frequency`:

$$\text{procrastination} = \begin{cases} 1 & \text{if } \text{assignment\_delay\_frequency} \in \{\text{'Always'}, \text{'Often'}\} \\ 0 & \text{if } \text{assignment\_delay\_frequency} \in \{\text{'Sometimes'}, \text{'Occasionally'}, \text{'Never'}\} \end{cases}$$

- **Class 1 (Procrastinator Pattern):** 247 students (54.8%)
- **Class 0 (Self-Regulated Pattern):** 204 students (45.2%)

---

## 10. Machine Learning Models

### 1. XGBoost (Gradient Boosted Trees)
- **Algorithm:** Iterative gradient boosting optimizing binary log-loss with second-order Taylor approximations.
- **Hyperparameters:** $N_{\text{estimators}} = 40$, $\text{max\_depth} = 4$, $\text{learning\_rate} = 0.1$, $\lambda_{\text{reg}} = 1.0$.
- **Performance:** **Top performing classifier** with optimal balance of precision and recall.

### 2. Random Forest Classifier
- **Algorithm:** Bagging ensemble of $50$ decorrelated decision trees with random feature subspace sampling ($\sqrt{D}$).
- **Hyperparameters:** $N_{\text{trees}} = 50$, $\text{max\_depth} = 8$, $\text{min\_samples\_split} = 2$.
- **Performance:** High stability and sensitivity ($98.8\%$ Recall).

### 3. Logistic Regression
- **Algorithm:** Generalized Linear Model with $L_2$ weight regularization trained via Mini-Batch Gradient Descent.
- **Hyperparameters:** $\alpha = 0.05$, $\text{epochs} = 150$, $L_2 = 0.001$.
- **Performance:** High precision baseline ($94.1\%$ Precision).

---

## 11. 5-Fold Cross-Validation & Benchmark Metrics

Evaluated across 5 stratified folds on 451 student records:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Top Strength |
|---|---|---|---|---|---|---|
| **XGBoost** | **91.56%** $\pm 2.9\%$ | **88.00%** $\pm 4.5\%$ | **98.38%** $\pm 1.5\%$ | **92.81%** $\pm 2.2\%$ | **0.9631** $\pm 0.026$ | **Best Overall F1 & Generalization** |
| **Random Forest** | **90.44%** $\pm 4.6\%$ | **86.07%** $\pm 4.9\%$ | **98.78%** $\pm 2.5\%$ | **91.95%** $\pm 3.7\%$ | **0.9634** $\pm 0.027$ | **Highest Sensitivity / Recall** |
| **Logistic Regression** | **85.78%** $\pm 5.3\%$ | **94.14%** $\pm 6.6\%$ | **79.35%** $\pm 7.1\%$ | **85.86%** $\pm 5.3\%$ | **0.9622** $\pm 0.029$ | **Highest Precision (Lowest False Positives)** |

---

## 12. Explainable AI (XAI) & Factor Attribution
For every student inference, CEREBRO computes localized feature contributions:
- **Directional Categorization:** Differentiates between *Risk Drivers* (e.g., last-minute cramming, digital distraction) and *Protective Factors* (e.g., proactive submission, structured study hours).
- **Non-Causal Language:** Attributions are framed objectively ("contributed to the model prediction") to avoid false causal inferences.

---

## 13. Complete REST API Specification

### Base URL
`http://localhost:5000/api`

### Endpoints

#### 1. System Health Check
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "online",
    "service": "CEREBRO Academic Procrastination Detection API",
    "version": "1.0.0",
    "timestamp": "2026-10-03T05:22:18.956Z"
  }
  ```

#### 2. Student Inference (Predict)
- **Endpoint:** `POST /api/prediction?model=XGBoost`
- **Headers:** `Content-Type: application/json`
- **Sample Request Body:**
  ```json
  {
    "study_year": "3rd year",
    "socio_economic_background": "Middle",
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
    "procrastination_reasons": ["reason_distractions", "reason_poor_time_management"]
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "prediction": {
      "modelUsed": "XGBoost",
      "probability": 0.2624,
      "percentage": "26.2%",
      "predictedClass": 0,
      "label": "No Significant Pattern Detected",
      "riskTier": "Low Risk",
      "explanation": {
        "riskTier": "Low Risk",
        "riskDrivers": ["Predominance of last-minute exam preparation"],
        "protectiveFactors": ["Consistent assignment submission record"],
        "featureImpacts": [
          { "feature": "Assignment Submission Timing", "impact": "Strong Protective Factor", "weight": -0.75 }
        ],
        "recommendations": ["Implement spaced repetition calendars 14 days in advance."]
      },
      "recordId": "stu_1791005100625_1",
      "timestamp": "2026-10-03T05:25:00.625Z"
    }
  }
  ```

#### 3. Population Analytics
- **Endpoint:** `GET /api/analytics`
- **Response:** Cohort distributions, cross-tabulations for study hours, CGPA, mobile usage, stress, and reason rankings.

#### 4. Model Catalog
- **Endpoint:** `GET /api/models`
- **Response:** List of registered models with parameter specifications.

#### 5. Model Benchmarks
- **Endpoint:** `GET /api/models/performance`
- **Response:** 5-Fold cross validation summary, confusion matrices, standard deviations, and best model recommendation.

#### 6. Feature Importance
- **Endpoint:** `GET /api/features/importance`
- **Response:** Global Gini importance for tree models and absolute coefficients for Logistic Regression.

#### 7. Assessment History
- **Endpoint:** `GET /api/students?limit=50`
- **Response:** Paginated student evaluation records.

#### 8. Assessment By ID
- **Endpoint:** `GET /api/students/:id`
- **Response:** Single assessment session details.

---

## 14. Repository Folder Structure

```
CEREBRO/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ActivityTimeline.jsx
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── ConfusionMatrix.jsx
│   │   │   ├── FeatureImportance.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   ├── ModelComparison.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StudentInputForm.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── ModelPerformance.jsx
│   │   │   ├── Prediction.jsx
│   │   │   └── StudentHistory.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── ml/
│   │   ├── dataset/
│   │   │   └── procrastination_dataset.csv
│   │   ├── evaluation/
│   │   │   └── model_performance.json
│   │   ├── preprocessing/
│   │   │   └── preprocessor.js
│   │   ├── trained_models/
│   │   │   ├── logistic_regression.json
│   │   │   ├── metadata.json
│   │   │   ├── random_forest.json
│   │   │   └── xgboost.json
│   │   └── trainModels.js
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── controllers/
│   │   │   ├── analyticsController.js
│   │   │   ├── modelController.js
│   │   │   └── predictionController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   └── Student.js
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── modelRoutes.js
│   │   │   └── predictionRoutes.js
│   │   ├── services/
│   │   │   ├── explanationService.js
│   │   │   ├── modelService.js
│   │   │   ├── predictionService.js
│   │   │   └── preprocessingService.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── data/
│   └── procrastination_dataset.csv
│
├── models/
│   ├── logistic/
│   │   └── logistic_regression.json
│   ├── random_forest/
│   │   └── random_forest.json
│   └── xgboost/
│       └── xgboost.json
│
├── .gitignore
└── README.md
```

---

## 15. Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone or Navigate to Project
```bash
cd c:/Users/HP/Desktop/cerebro
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 16. Training Machine Learning Models
To execute the 5-fold cross-validation pipeline and re-train all models:
```bash
cd backend
npm run train
```
*Output: Generates evaluation metrics in `backend/ml/evaluation/model_performance.json` and portable model artifacts in `backend/ml/trained_models/` and `models/`.*

---

## 17. Running Backend Server
```bash
cd backend
npm run dev
# Or for production:
npm start
```
*Backend server runs by default on `http://localhost:5000`.*

---

## 18. Running Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend dev server starts by default on `http://localhost:5173`.*

To build production bundle:
```bash
cd frontend
npm run build
```

---

## 19. Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATASET_PATH=./ml/dataset/procrastination_dataset.csv
TRAINED_MODELS_DIR=./ml/trained_models
MONGO_URI=
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 20. Deployment Architecture
- **Backend:** Node.js Express service can be deployed on AWS ECS/App Runner, Google Cloud Run, Render, or Railway.
- **Frontend:** Static Vite build (`dist/`) can be deployed on Vercel, Netlify, or Firebase Hosting.
- **Containerization:** Compatible with standard multi-stage Docker builds.

---

## 21. Ethical Advisory Protocol & Limitations

### Crucial Ethical Disclosure
> **Disclaimer:** CEREBRO is an academic behavioral decision support tool. It is **NOT** a clinical, psychological, or medical diagnostic instrument.

1. **Survey-Based Empirical Data:** The underlying dataset is derived from 451 student self-report survey responses. Self-reported metrics may carry subjective recall biases.
2. **Probabilistic Nature:** Predictions indicate empirical correlation with observed delay patterns rather than fixed student traits.
3. **No Causal Guarantees:** Features identified by Explainable AI represent mathematical weights in the decision boundary, not proved psychological causality.

---

## 22. Future Improvements & Roadmap
- [ ] **LMS Integration:** Ingest live Canvas/Moodle timestamp metadata (assignment clicks, draft saves) for passive behavioral monitoring.
- [ ] **Longitudinal Tracking:** Monitor habit evolution over multiple academic semesters.
- [ ] **Context-Aware Study Assistant:** Conversational AI tutor providing real-time habit coaching and Pomodoro pacing.
- [ ] **Cross-Institutional Benchmarking:** Expand training corpus across diverse geographic institutions and degree disciplines.

---

<div align="center">
  <sub>Built for National-Level AI & Machine Learning Hackathons • CEREBRO System v1.0</sub>
</div>
