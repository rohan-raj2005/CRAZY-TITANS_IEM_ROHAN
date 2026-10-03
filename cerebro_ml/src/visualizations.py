import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix, roc_curve, roc_auc_score

# Set sleek aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

def plot_class_distribution(y, output_path):
    """
    Plots the binary target distribution with percentages and counts.
    """
    fig, ax = plt.subplots(figsize=(8, 5), dpi=300)
    
    counts = y.value_counts().sort_index()
    labels = ['Non-Procrastinator (0)', 'Procrastinator (1)']
    colors = ['#10b981', '#ef4444']
    
    bars = ax.bar(labels, counts.values, color=colors, width=0.5, edgecolor='#334155', linewidth=1.2)
    
    total = len(y)
    for bar in bars:
        height = bar.get_height()
        pct = (height / total) * 100
        ax.text(bar.get_x() + bar.get_width() / 2., height + 6,
                f"{int(height)} ({pct:.1f}%)",
                ha='center', va='bottom', fontsize=12, fontweight='bold', color='#1e293b')
        
    ax.set_ylim(0, max(counts.values) * 1.15)
    ax.set_title("CEREBRO Target Class Distribution (Procrastination)", fontsize=14, fontweight='bold', pad=15)
    ax.set_ylabel("Student Count", fontsize=11, fontweight='semibold')
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_eda_reasons(X, y, output_path):
    """
    Plots the prevalence of different procrastination reasons split by class.
    """
    reason_cols = [c for c in X.columns if c.startswith('reason_')]
    
    clean_names = {
        'reason_distractions_social_media': 'Distractions / Social Media',
        'reason_poor_time_management': 'Poor Time Management',
        'reason_stress_and_anxiety': 'Stress & Anxiety',
        'reason_lack_of_interest': 'Lack of Interest',
        'reason_lack_of_resources': 'Lack of Resources',
        'reason_health_issues': 'Health Issues',
        'reason_unclear_professor_instructions': 'Unclear Prof Instructions',
        'reason_personal_family_problems': 'Personal / Family Problems',
        'reason_overconfidence': 'Overconfidence'
    }
    
    reasons_summary = []
    for col in reason_cols:
        rate_proc = X.loc[y == 1, col].mean() * 100
        rate_non_proc = X.loc[y == 0, col].mean() * 100
        overall_rate = X[col].mean() * 100
        reasons_summary.append({
            'Reason': clean_names.get(col, col),
            'Procrastinators (%)': rate_proc,
            'Non-Procrastinators (%)': rate_non_proc,
            'Overall (%)': overall_rate
        })
        
    df_reasons = pd.DataFrame(reasons_summary).sort_values(by='Procrastinators (%)', ascending=True)
    
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    y_pos = np.arange(len(df_reasons))
    bar_height = 0.38
    
    b1 = ax.barh(y_pos + bar_height/2, df_reasons['Procrastinators (%)'], height=bar_height,
                 color='#ef4444', label='Procrastinators', edgecolor='#991b1b', alpha=0.9)
    b2 = ax.barh(y_pos - bar_height/2, df_reasons['Non-Procrastinators (%)'], height=bar_height,
                 color='#10b981', label='Non-Procrastinators', edgecolor='#065f46', alpha=0.9)
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(df_reasons['Reason'], fontsize=11, fontweight='medium')
    ax.set_xlabel("Percentage of Students Reporting Reason (%)", fontsize=11, fontweight='semibold')
    ax.set_title("Prevalence of Procrastination Reasons by Student Group", fontsize=14, fontweight='bold', pad=15)
    ax.legend(frameon=True, facecolor='white', loc='lower right', fontsize=11)
    ax.set_xlim(0, max(df_reasons['Procrastinators (%)'].max(), df_reasons['Non-Procrastinators (%)'].max()) * 1.18)
    
    # Add values on top of bars
    for bar in b1:
        w = bar.get_width()
        if w > 0:
            ax.text(w + 1, bar.get_y() + bar.get_height()/2, f"{w:.1f}%", va='center', fontsize=9, color='#991b1b', fontweight='bold')
    for bar in b2:
        w = bar.get_width()
        if w > 0:
            ax.text(w + 1, bar.get_y() + bar.get_height()/2, f"{w:.1f}%", va='center', fontsize=9, color='#065f46', fontweight='bold')

    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_eda_academic_behaviors(X, y, output_path):
    """
    Plots cross-tabulations of critical behavioral variables with procrastination status.
    """
    fig, axes = plt.subplots(2, 2, figsize=(14, 10), dpi=300)
    
    temp_df = X.copy()
    temp_df['procrastination'] = y.map({0: 'Non-Procrastinator', 1: 'Procrastinator'})
    
    features = [
        ('study_hours_per_week', 'Study Hours Per Week', ['0-5 hours', '6-10 hours', '11-15 hours', '16+ hours']),
        ('cgpa', 'CGPA Range', ['Below 2.50', '2.50 - 2.99', '3.00 - 3.49', '3.50 - 3.74', '3.75 - 4.00']),
        ('hours_spent_on_mobile_non_academic', 'Non-Academic Mobile Screen Time', ['1-2 hours', '3-4 hours', 'More than 4 hours']),
        ('last_minute_exam_preparation', 'Last Minute Exam Preparation', ['Yes', 'No'])
    ]
    
    for ax, (col, title, order) in zip(axes.flatten(), features):
        valid_order = [o for o in order if o in temp_df[col].dropna().unique()]
        ct = pd.crosstab(temp_df[col], temp_df['procrastination'], normalize='index') * 100
        ct = ct.reindex(valid_order)
        
        ct[['Non-Procrastinator', 'Procrastinator']].plot(
            kind='bar', stacked=True, ax=ax, color=['#10b981', '#ef4444'], edgecolor='#334155', width=0.6
        )
        ax.set_title(title, fontsize=12, fontweight='bold')
        ax.set_ylabel("Proportion (%)", fontsize=10, fontweight='semibold')
        ax.set_xlabel("")
        ax.set_xticklabels(ax.get_xticklabels(), rotation=15, ha='right', fontsize=9)
        ax.legend(title="", fontsize=9, loc='upper right', framealpha=0.9)
        ax.set_ylim(0, 105)
        
    plt.suptitle("CEREBRO Academic & Behavioral Indicators vs Procrastination", fontsize=15, fontweight='bold', y=1.00)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_confusion_matrices(y_true, oof_predictions, output_path):
    """
    Plots side-by-side heatmaps of Out-of-Fold Confusion Matrices for all 3 models.
    """
    models = list(oof_predictions.keys())
    fig, axes = plt.subplots(1, 3, figsize=(16, 4.8), dpi=300)
    
    for ax, model_name in zip(axes, models):
        cm = confusion_matrix(y_true, oof_predictions[model_name])
        cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        
        annot_matrix = np.empty_like(cm).astype(str)
        for i in range(cm.shape[0]):
            for j in range(cm.shape[1]):
                annot_matrix[i, j] = f"{cm[i, j]}\n({cm_norm[i, j]*100:.1f}%)"
                
        sns.heatmap(cm, annot=annot_matrix, fmt='', cmap='Blues', cbar=False, ax=ax,
                    xticklabels=['Non-Proc (0)', 'Proc (1)'],
                    yticklabels=['Non-Proc (0)', 'Proc (1)'],
                    annot_kws={"fontsize": 11, "fontweight": "bold"})
        
        ax.set_title(f"{model_name}", fontsize=13, fontweight='bold', pad=10)
        ax.set_xlabel("Predicted Label", fontsize=10, fontweight='semibold')
        ax.set_ylabel("True Label", fontsize=10, fontweight='semibold')
        
    plt.suptitle("Out-of-Fold Confusion Matrices (5-Fold Stratified CV)", fontsize=15, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_roc_curves(y_true, oof_probabilities, output_path):
    """
    Plots comparative ROC curves with calculated AUC scores.
    """
    fig, ax = plt.subplots(figsize=(8, 6), dpi=300)
    
    colors = {
        'Logistic Regression': '#3b82f6',
        'Random Forest': '#10b981',
        'XGBoost': '#f59e0b'
    }
    
    for model_name, probs in oof_probabilities.items():
        fpr, tpr, _ = roc_curve(y_true, probs)
        auc = roc_auc_score(y_true, probs)
        ax.plot(fpr, tpr, label=f"{model_name} (AUC = {auc:.4f})",
                color=colors.get(model_name, '#6366f1'), linewidth=2.4)
        
    # Baseline chance
    ax.plot([0, 1], [0, 1], 'k--', label='Random Chance (AUC = 0.5000)', linewidth=1.2, alpha=0.7)
    
    ax.set_xlim([-0.02, 1.02])
    ax.set_ylim([-0.02, 1.05])
    ax.set_xlabel("False Positive Rate (1 - Specificity)", fontsize=11, fontweight='semibold')
    ax.set_ylabel("True Positive Rate (Recall / Sensitivity)", fontsize=11, fontweight='semibold')
    ax.set_title("CEREBRO ROC Curves Comparison (5-Fold Stratified CV)", fontsize=14, fontweight='bold', pad=15)
    ax.legend(frameon=True, facecolor='white', loc='lower right', fontsize=10.5)
    ax.grid(True, linestyle='--', alpha=0.6)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_feature_importance(pipeline, X, output_path, top_n=15):
    """
    Extracts and visualizes the top feature importances from the fitted model pipeline.
    """
    # Extract feature names from preprocessor
    preprocessor = pipeline.named_steps['preprocessor']
    classifier = pipeline.named_steps['classifier']
    
    cat_feature_names = preprocessor.named_transformers_['cat'].named_steps['ohe'].get_feature_names_out()
    bin_feature_names = preprocessor.transformers[1][2]
    
    all_feature_names = list(cat_feature_names) + list(bin_feature_names)
    
    if hasattr(classifier, 'feature_importances_'):
        importances = classifier.feature_importances_
        title = "Top Feature Importances (Tree-Based)"
        xlabel = "Gini / Split Importance Score"
    elif hasattr(classifier, 'coef_'):
        importances = classifier.coef_[0]
        title = "Top Feature Coefficients (Logistic Regression)"
        xlabel = "Log-Odds Coefficient (Positive = Procrastination Risk)"
    else:
        print("Model does not expose feature importances.")
        return
        
    feat_df = pd.DataFrame({
        'Feature': all_feature_names,
        'Importance': importances
    })
    
    if hasattr(classifier, 'coef_'):
        feat_df['AbsImp'] = feat_df['Importance'].abs()
        feat_df = feat_df.sort_values(by='AbsImp', ascending=True).tail(top_n)
        colors = ['#ef4444' if val > 0 else '#10b981' for val in feat_df['Importance']]
    else:
        feat_df = feat_df.sort_values(by='Importance', ascending=True).tail(top_n)
        colors = '#6366f1'
        
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    
    bars = ax.barh(feat_df['Feature'], feat_df['Importance'], color=colors, edgecolor='#1e293b', height=0.65)
    ax.set_title(title, fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel(xlabel, fontsize=11, fontweight='semibold')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")


def plot_single_student_explanation(pipeline, student_sample, output_path):
    """
    Generates a visual waterfall-style explanation of risk drivers for an individual student.
    """
    preprocessor = pipeline.named_steps['preprocessor']
    classifier = pipeline.named_steps['classifier']
    
    # Transform student sample
    X_sample = student_sample.to_frame().T if isinstance(student_sample, pd.Series) else student_sample
    pred_class = pipeline.predict(X_sample)[0]
    pred_prob = pipeline.predict_proba(X_sample)[0, 1]
    
    cat_names = preprocessor.named_transformers_['cat'].named_steps['ohe'].get_feature_names_out()
    bin_names = preprocessor.transformers[1][2]
    all_names = list(cat_names) + list(bin_names)
    
    X_transformed = preprocessor.transform(X_sample)[0]
    
    # Calculate feature contributions
    if hasattr(classifier, 'coef_'):
        coefs = classifier.coef_[0]
        contributions = X_transformed * coefs
    elif hasattr(classifier, 'feature_importances_'):
        # For tree models, approximate directional impact with active features weighted by importance
        contributions = X_transformed * classifier.feature_importances_
    else:
        contributions = X_transformed
        
    contrib_df = pd.DataFrame({
        'Feature': all_names,
        'Active': X_transformed,
        'Impact': contributions
    })
    
    # Filter only active features for this student
    active_df = contrib_df[contrib_df['Active'] > 0].copy()
    active_df['AbsImpact'] = active_df['Impact'].abs()
    active_df = active_df.sort_values(by='AbsImpact', ascending=True).tail(8)
    
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    
    bar_colors = ['#ef4444' if x > 0 else '#10b981' for x in active_df['Impact']]
    ax.barh(active_df['Feature'], active_df['Impact'], color=bar_colors, edgecolor='#1e293b', height=0.6)
    
    status_text = "HIGH RISK (Procrastinator)" if pred_class == 1 else "LOW RISK (Non-Procrastinator)"
    color_text = "#ef4444" if pred_class == 1 else "#10b981"
    
    ax.set_title(f"Individual Student Diagnostic Breakdown\nPredicted Status: {status_text} | Probability: {pred_prob*100:.1f}%",
                 fontsize=13, fontweight='bold', color='#1e293b', pad=15)
    ax.set_xlabel("Relative Risk Contribution (Red = Increases Risk, Green = Reduces Risk)", fontsize=10, fontweight='semibold')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"Saved: {output_path}")
