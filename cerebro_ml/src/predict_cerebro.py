import os
import joblib
import pandas as pd
import numpy as np
from .data_loader import parse_procrastination_reasons

class CerebroPredictor:
    """
    Production-ready Cerebro Inference Engine for student procrastination detection.
    Ready for integration with Flask, FastAPI, Next.js or Streamlit backends.
    """
    def __init__(self, model_path: str = None):
        if model_path is None:
            # Default to artifacts directory
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, 'artifacts', 'cerebro_best_model.joblib')
            
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Trained model not found at '{model_path}'. Run 'run_pipeline.py' first.")
            
        self.pipeline = joblib.load(model_path)
        print(f"[CerebroPredictor] Loaded model from: {model_path}")

    def format_input(self, raw_input_dict: dict) -> pd.DataFrame:
        """
        Accepts a dictionary of student responses, handles multi-label reasons parsing,
        and constructs the exact feature DataFrame expected by the pipeline.
        """
        data = raw_input_dict.copy()
        
        # If procrastination_reasons is given as list, join with comma
        if isinstance(data.get('procrastination_reasons'), list):
            data['procrastination_reasons'] = ", ".join(data['procrastination_reasons'])
            
        df_single = pd.DataFrame([data])
        
        # If binary reasons are not already provided, extract from string
        if 'procrastination_reasons' in df_single.columns:
            reasons_df = parse_procrastination_reasons(df_single)
            df_single = df_single.drop(columns=['procrastination_reasons'])
            df_features = pd.concat([df_single, reasons_df], axis=1)
        else:
            df_features = df_single
            
        # Ensure any forbidden columns are dropped if accidentally passed
        forbidden = [
            'Timestamp', 'assignment_delay_frequency',
            'effect_of_procrastination_on_grades',
            'procrastination_and_grade_outcome'
        ]
        df_features = df_features.drop(columns=[col for col in forbidden if col in df_features.columns])
        
        return df_features

    def predict_student(self, student_dict: dict) -> dict:
        """
        Performs full explainable inference for an individual student.
        """
        X_df = self.format_input(student_dict)
        
        pred_class = int(self.pipeline.predict(X_df)[0])
        prob_procrastinate = float(self.pipeline.predict_proba(X_df)[0, 1])
        
        if prob_procrastinate >= 0.75:
            risk_tier = "Critical Risk"
        elif prob_procrastinate >= 0.50:
            risk_tier = "High Risk"
        elif prob_procrastinate >= 0.25:
            risk_tier = "Moderate Risk"
        else:
            risk_tier = "Low Risk"
            
        # Generate actionable recommendations based on input features
        recommendations = []
        if student_dict.get('last_minute_exam_preparation') == 'Yes':
            recommendations.append("Adopt spaced repetition and establish a 2-week structured revision timetable.")
        if student_dict.get('study_hours_per_week') in ['0-5 hours']:
            recommendations.append("Increment weekly dedicated study sessions by 30-45 minutes daily using the Pomodoro method.")
        if student_dict.get('hours_spent_on_mobile_non_academic') == 'More than 4 hours':
            recommendations.append("Set digital wellbeing app limits during study blocks to minimize social media interruption.")
        if student_dict.get('use_of_time_management') in ['Never', 'Occasionally']:
            recommendations.append("Introduce time-blocking calendars or digital task management tools (e.g. Cerebro Planner).")
        if not recommendations:
            recommendations.append("Maintain consistent academic schedule and weekly self-reflection routines.")
            
        return {
            "prediction": pred_class,
            "label": "Procrastinator" if pred_class == 1 else "Non-Procrastinator",
            "procrastination_probability": round(prob_procrastinate, 4),
            "procrastination_percentage": f"{prob_procrastinate * 100:.2f}%",
            "risk_tier": risk_tier,
            "recommendations": recommendations
        }
