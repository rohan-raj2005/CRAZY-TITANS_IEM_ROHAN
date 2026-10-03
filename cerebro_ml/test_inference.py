import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from src.predict_cerebro import CerebroPredictor

def test_inference():
    print("=" * 60)
    print(" CEREBRO ACADEMIC PROCRASTINATION - INFERENCE TEST SUITE")
    print("=" * 60)
    
    predictor = CerebroPredictor()
    
    test_cases = [
        {
            "name": "Case A: High-Risk Procrastinating Student",
            "data": {
                "study_year": "Fourth Year",
                "socio-economic_background": "Low",
                "procrastination_reasons": "Distractions (e.g., social media), Poor time management, Stress and anxiety",
                "assignment_submission_timing": "Never",
                "last_minute_exam_preparation": "Yes",
                "stress_due_to_procrastination": "Significantly",
                "study_hours_per_week": "0-5 hours",
                "cgpa": "Below 2.50",
                "use_of_time_management": "Never",
                "procrastination_management_training": "No",
                "procrastination_recovery_strategies": "No",
                "hours_spent_on_mobile_non_academic": "More than 4 hours",
                "study_session_distractions": "Always"
            }
        },
        {
            "name": "Case B: Low-Risk Diligent Student",
            "data": {
                "study_year": "Second Year",
                "socio-economic_background": "Middle",
                "procrastination_reasons": "None",
                "assignment_submission_timing": "Always",
                "last_minute_exam_preparation": "No",
                "stress_due_to_procrastination": "Not at all",
                "study_hours_per_week": "16+ hours",
                "cgpa": "3.75 - 4.00",
                "use_of_time_management": "Always",
                "procrastination_management_training": "Yes",
                "procrastination_recovery_strategies": "Yes",
                "hours_spent_on_mobile_non_academic": "1-2 hours",
                "study_session_distractions": "Never"
            }
        }
    ]
    
    for case in test_cases:
        print(f"\n--- {case['name']} ---")
        output = predictor.predict_student(case['data'])
        print(f"Predicted Class    : {output['label']} ({output['prediction']})")
        print(f"Risk Probability   : {output['procrastination_percentage']}")
        print(f"Risk Tier          : {output['risk_tier']}")
        print(f"Key Interventions  :")
        for rec in output['recommendations']:
            print(f"  • {rec}")
            
    print("\n[SUCCESS] Inference test suite completed successfully.")

if __name__ == '__main__':
    test_inference()
