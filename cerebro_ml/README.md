# CEREBRO: Academic Procrastination Detection Pipeline

An end-to-end Machine Learning system developed for **CEREBRO** to detect and diagnose academic procrastination risk among students based on behavioral survey patterns.

---

## 📁 Project Architecture

```
cerebro_ml/
├── data/
│   └── student_procrastination_data.csv    # Raw student survey responses (451 records)
├── artifacts/
│   ├── cerebro_best_model.joblib           # Serialized production pipeline (Preprocessing + Model)
│   └── model_comparison_results.csv        # 5-fold cross-validation metrics comparison
├── plots/
│   ├── 01_class_distribution.png           # Target binary class balance
│   ├── 02_eda_procrastination_reasons.png  # Multi-label reasons prevalence
│   ├── 03_eda_academic_behaviors.png       # Study hours, CGPA, mobile screen time vs procrastination
│   ├── 04_confusion_matrices.png           # 5-fold CV Confusion Matrices for all 3 models
│   ├── 05_roc_curves.png                   # Comparative ROC-AUC curves
│   ├── 06_feature_importance.png           # Key risk drivers identified by winning model
│   └── 07_single_student_explanation.png   # Individual student diagnostic waterfall
├── src/
│   ├── data_loader.py                      # Target creation & multi-response reason parsing
│   ├── preprocessor.py                     # Leakage-free ColumnTransformer & Imputers
│   ├── train_evaluate.py                   # 5-Fold Stratified CV engine & metrics computation
│   ├── visualizations.py                   # Visual diagnostics and analytics
│   └── predict_cerebro.py                  # Standalone prediction engine for web application
├── run_pipeline.py                         # Master execution script
├── test_inference.py                       # Single & batch inference test suite
└── README.md
```

---

## 🎯 Target Definition & Constraints Adherence

1. **Target Formulation**:
   - `procrastination = 1` for `Always` and `Often` in `assignment_delay_frequency`.
   - `procrastination = 0` for `Sometimes`, `Occasionally`, and `Never`.
2. **Strict Data Leakage Prevention**:
   - `assignment_delay_frequency` is permanently dropped and **never** used as a feature.
   - `Timestamp` is dropped.
   - `effect_of_procrastination_on_grades` and `procrastination_and_grade_outcome` are strictly excluded.
   - Preprocessing (Imputation, One-Hot Encoding, and Scaling) is fitted **strictly inside training folds** during 5-fold cross-validation.
3. **Multi-Response Reason Parsing**:
   - `procrastination_reasons` is dynamically parsed into 9 clean binary indicators:
     - `reason_lack_of_interest`
     - `reason_distractions_social_media`
     - `reason_poor_time_management`
     - `reason_stress_and_anxiety`
     - `reason_lack_of_resources`
     - `reason_health_issues`
     - `reason_unclear_professor_instructions`
     - `reason_personal_family_problems`
     - `reason_overconfidence`

---

## 🤖 Models Compared (Stratified 5-Fold Cross-Validation)

1. **Logistic Regression** (L2 Regularized with StandardScaler)
2. **Random Forest Classifier** (Ensemble of 150 Decision Trees)
3. **XGBoost Classifier** (Gradient Boosted Decision Trees)

---

## 🚀 How to Run

### 1. Run Complete Pipeline:
```bash
python cerebro_ml/run_pipeline.py
```

### 2. Run Inference Test Suite:
```bash
python cerebro_ml/test_inference.py
```

### 3. Integrate with CEREBRO Web Application:
```python
from cerebro_ml.src.predict_cerebro import CerebroPredictor

predictor = CerebroPredictor()
result = predictor.predict_student({
    "study_year": "Third Year",
    "socio-economic_background": "Middle",
    "procrastination_reasons": "Distractions (e.g., social media), Poor time management",
    "assignment_submission_timing": "Sometimes",
    "last_minute_exam_preparation": "Yes",
    "stress_due_to_procrastination": "Moderately",
    "study_hours_per_week": "0-5 hours",
    "cgpa": "3.00 - 3.49",
    "use_of_time_management": "Occasionally",
    "procrastination_management_training": "No",
    "procrastination_recovery_strategies": "No",
    "hours_spent_on_mobile_non_academic": "3-4 hours",
    "study_session_distractions": "Often"
})

print(result)
# Output:
# {
#   'prediction': 1,
#   'label': 'Procrastinator',
#   'procrastination_probability': 0.8841,
#   'procrastination_percentage': '88.41%',
#   'risk_tier': 'Critical Risk',
#   'recommendations': [...]
# }
```
