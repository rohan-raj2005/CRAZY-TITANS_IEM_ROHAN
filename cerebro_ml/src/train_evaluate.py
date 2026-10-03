import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report, roc_curve
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.pipeline import Pipeline
import joblib

from .preprocessor import build_preprocessor, get_feature_column_types

def evaluate_models_cv(X, y, n_splits=5, random_state=42):
    """
    Performs 5-Fold Stratified Cross-Validation on:
    1. Logistic Regression
    2. Random Forest
    3. XGBoost
    
    Prevents data leakage by fitting preprocessing solely on the training fold of each split.
    Calculates Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrices.
    """
    cat_cols, bin_cols = get_feature_column_types(X)
    
    # Model definitions
    model_factories = {
        'Logistic Regression': lambda: Pipeline([
            ('preprocessor', build_preprocessor(cat_cols, bin_cols, scale_numeric=True)),
            ('classifier', LogisticRegression(C=1.0, max_iter=1000, random_state=random_state))
        ]),
        'Random Forest': lambda: Pipeline([
            ('preprocessor', build_preprocessor(cat_cols, bin_cols, scale_numeric=False)),
            ('classifier', RandomForestClassifier(n_estimators=150, max_depth=8, random_state=random_state))
        ]),
        'XGBoost': lambda: Pipeline([
            ('preprocessor', build_preprocessor(cat_cols, bin_cols, scale_numeric=False)),
            ('classifier', XGBClassifier(n_estimators=120, max_depth=4, learning_rate=0.05,
                                         eval_metric='logloss', random_state=random_state))
        ])
    }
    
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    
    cv_results = {}
    oof_predictions = {}
    oof_probabilities = {}
    
    for model_name, pipeline_builder in model_factories.items():
        print(f"\n==========================================")
        print(f"Running {n_splits}-Fold Stratified CV for: {model_name}")
        print(f"==========================================")
        
        fold_metrics = {
            'accuracy': [],
            'precision': [],
            'recall': [],
            'f1': [],
            'roc_auc': []
        }
        
        oof_preds = np.zeros(len(y))
        oof_probs = np.zeros(len(y))
        
        for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
            
            pipeline = pipeline_builder()
            pipeline.fit(X_train, y_train)
            
            y_val_pred = pipeline.predict(X_val)
            y_val_prob = pipeline.predict_proba(X_val)[:, 1]
            
            oof_preds[val_idx] = y_val_pred
            oof_probs[val_idx] = y_val_prob
            
            acc = accuracy_score(y_val, y_val_pred)
            prec = precision_score(y_val, y_val_pred, zero_division=0)
            rec = recall_score(y_val, y_val_pred, zero_division=0)
            f1 = f1_score(y_val, y_val_pred, zero_division=0)
            auc = roc_auc_score(y_val, y_val_prob)
            
            fold_metrics['accuracy'].append(acc)
            fold_metrics['precision'].append(prec)
            fold_metrics['recall'].append(rec)
            fold_metrics['f1'].append(f1)
            fold_metrics['roc_auc'].append(auc)
            
            print(f" Fold {fold} -> Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {auc:.4f}")
            
        cv_results[model_name] = fold_metrics
        oof_predictions[model_name] = oof_preds
        oof_probabilities[model_name] = oof_probs
        
        # Overall OOF metrics
        oof_cm = confusion_matrix(y, oof_preds)
        print(f"\n---> {model_name} Overall Out-of-Fold Confusion Matrix:\n{oof_cm}")
        print(f"---> {model_name} Classification Report:\n{classification_report(y, oof_preds, target_names=['Non-Procrastinator', 'Procrastinator'])}")
        
    return cv_results, oof_predictions, oof_probabilities, model_factories


def create_model_comparison_table(cv_results):
    """
    Creates a summary dataframe of mean ± std cross-validation metrics.
    """
    summary_rows = []
    
    for model_name, metrics in cv_results.items():
        summary_rows.append({
            'Model': model_name,
            'Accuracy': f"{np.mean(metrics['accuracy']):.4f} ± {np.std(metrics['accuracy']):.4f}",
            'Precision': f"{np.mean(metrics['precision']):.4f} ± {np.std(metrics['precision']):.4f}",
            'Recall': f"{np.mean(metrics['recall']):.4f} ± {np.std(metrics['recall']):.4f}",
            'F1-Score': f"{np.mean(metrics['f1']):.4f} ± {np.std(metrics['f1']):.4f}",
            'ROC-AUC': f"{np.mean(metrics['roc_auc']):.4f} ± {np.std(metrics['roc_auc']):.4f}",
            'Mean_ROC_AUC': np.mean(metrics['roc_auc']),
            'Mean_F1': np.mean(metrics['f1'])
        })
        
    summary_df = pd.DataFrame(summary_rows)
    # Sort by ROC-AUC descending
    summary_df = summary_df.sort_values(by='Mean_ROC_AUC', ascending=False).reset_index(drop=True)
    return summary_df


def train_and_export_best_model(X, y, model_factories, best_model_name, output_model_path):
    """
    Fits the winning model pipeline on the entire dataset and saves the artifact.
    Also extracts and saves feature names for interpretability.
    """
    print(f"\nFitting best overall pipeline ({best_model_name}) on the complete dataset ({len(y)} samples)...")
    best_pipeline = model_factories[best_model_name]()
    best_pipeline.fit(X, y)
    
    # Save model artifact
    joblib.dump(best_pipeline, output_model_path)
    print(f"Successfully exported best model to: {output_model_path}")
    
    return best_pipeline
