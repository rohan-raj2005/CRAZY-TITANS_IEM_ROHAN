import os
import sys
import pandas as pd
import numpy as np

# Ensure src modules can be imported directly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from src.data_loader import load_and_preprocess_dataset
from src.train_evaluate import evaluate_models_cv, create_model_comparison_table, train_and_export_best_model
from src.visualizations import (
    plot_class_distribution, plot_eda_reasons, plot_eda_academic_behaviors,
    plot_confusion_matrices, plot_roc_curves, plot_feature_importance,
    plot_single_student_explanation
)
from src.predict_cerebro import CerebroPredictor

def main():
    print("=" * 70)
    print("    CEREBRO ACADEMIC PROCRASTINATION DETECTION ML PIPELINE")
    print("=" * 70)
    
    # 1. Paths setup
    data_path = os.path.join(current_dir, 'data', 'student_procrastination_data.csv')
    plots_dir = os.path.join(current_dir, 'plots')
    artifacts_dir = os.path.join(current_dir, 'artifacts')
    
    os.makedirs(plots_dir, exist_ok=True)
    os.makedirs(artifacts_dir, exist_ok=True)
    
    # 2. Data Loading & Feature Engineering
    print("\n[STEP 1] Loading and preprocessing survey data...")
    X, y = load_and_preprocess_dataset(data_path)
    
    # 3. Exploratory Data Analysis Plots
    print("\n[STEP 2] Generating EDA Visualizations...")
    plot_class_distribution(y, os.path.join(plots_dir, '01_class_distribution.png'))
    plot_eda_reasons(X, y, os.path.join(plots_dir, '02_eda_procrastination_reasons.png'))
    plot_eda_academic_behaviors(X, y, os.path.join(plots_dir, '03_eda_academic_behaviors.png'))
    
    # 4. Stratified 5-Fold Cross Validation
    print("\n[STEP 3] Executing 5-Fold Stratified Cross-Validation (Leakage-Free)...")
    cv_results, oof_predictions, oof_probabilities, model_factories = evaluate_models_cv(X, y, n_splits=5, random_state=42)
    
    # 5. Model Comparison Summary
    print("\n[STEP 4] Model Cross-Validation Performance Comparison:")
    comparison_table = create_model_comparison_table(cv_results)
    print("\n" + "=" * 95)
    print(comparison_table[['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']].to_string(index=False))
    print("=" * 95)
    
    # Save comparison table to CSV and markdown
    comparison_table.to_csv(os.path.join(artifacts_dir, 'model_comparison_results.csv'), index=False)
    
    # Best model selection based on ROC-AUC / F1
    best_model_name = comparison_table.iloc[0]['Model']
    print(f"\n---> Winning Model Selected: {best_model_name}")
    
    # 6. Evaluation Visualizations
    print("\n[STEP 5] Generating Evaluation and Diagnostic Plots...")
    plot_confusion_matrices(y, oof_predictions, os.path.join(plots_dir, '04_confusion_matrices.png'))
    plot_roc_curves(y, oof_probabilities, os.path.join(plots_dir, '05_roc_curves.png'))
    
    # 7. Final Model Retraining on Full Dataset & Export
    print("\n[STEP 6] Retraining Winning Model on Full Dataset & Saving Artifacts...")
    best_model_path = os.path.join(artifacts_dir, 'cerebro_best_model.joblib')
    fitted_best_pipeline = train_and_export_best_model(X, y, model_factories, best_model_name, best_model_path)
    
    # Feature Importance Plot
    plot_feature_importance(fitted_best_pipeline, X, os.path.join(plots_dir, '06_feature_importance.png'))
    
    # 8. Single Student Explainability Example
    print("\n[STEP 7] Generating Single Student Diagnostic & Explainability...")
    sample_student = X.iloc[0]
    plot_single_student_explanation(fitted_best_pipeline, sample_student, os.path.join(plots_dir, '07_single_student_explanation.png'))
    
    # 9. Test CerebroPredictor Inference Engine
    print("\n[STEP 8] Testing Cerebro Web App Inference Engine...")
    predictor = CerebroPredictor(best_model_path)
    
    demo_student_high_risk = {
        'study_year': 'Fourth Year',
        'socio-economic_background': 'Middle',
        'procrastination_reasons': 'Lack of interest, Health issues, Stress and anxiety',
        'assignment_submission_timing': 'Never',
        'last_minute_exam_preparation': 'Yes',
        'stress_due_to_procrastination': 'Significantly',
        'study_hours_per_week': '0-5 hours',
        'cgpa': '2.50 - 2.99',
        'use_of_time_management': 'Never',
        'procrastination_management_training': 'No',
        'procrastination_recovery_strategies': 'No',
        'hours_spent_on_mobile_non_academic': 'More than 4 hours',
        'study_session_distractions': 'Often'
    }
    
    result = predictor.predict_student(demo_student_high_risk)
    print("\n--- Sample Student Prediction Output ---")
    for k, v in result.items():
        print(f"  {k}: {v}")
        
    print("\n======================================================================")
    print("  PIPELINE EXECUTION COMPLETE! ALL ARTIFACTS & PLOTS SUCCESSFULLY GENERATED.")
    print("======================================================================")

if __name__ == '__main__':
    main()
