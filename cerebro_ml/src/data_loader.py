import pandas as pd
import numpy as np

def parse_procrastination_reasons(df: pd.DataFrame) -> pd.DataFrame:
    """
    Parses the multi-response 'procrastination_reasons' column into 9 distinct binary indicator features.
    Handles variations in survey response phrasing and missing values cleanly.
    """
    reasons_series = df['procrastination_reasons'].fillna('').astype(str).str.lower()
    
    # Define mapping of feature name to search substrings
    reason_patterns = {
        'reason_lack_of_interest': ['lack of interest', 'interest'],
        'reason_distractions_social_media': ['distraction', 'social media', 'e.g., social media'],
        'reason_poor_time_management': ['poor time management', 'time management'],
        'reason_stress_and_anxiety': ['stress', 'anxiety'],
        'reason_lack_of_resources': ['lack of resources', 'resources'],
        'reason_health_issues': ['health', 'health issues'],
        'reason_unclear_professor_instructions': ['unclear', 'professor', 'instructions'],
        'reason_personal_family_problems': ['personal', 'family', 'personal family'],
        'reason_overconfidence': ['overconfidence', 'overconfident']
    }
    
    reasons_df = pd.DataFrame(index=df.index)
    
    for feat_name, patterns in reason_patterns.items():
        # Match if any of the associated keywords appear in the response
        pattern_regex = '|'.join([p.lower() for p in patterns])
        reasons_df[feat_name] = reasons_series.str.contains(pattern_regex, regex=True).astype(int)
        
    return reasons_df


def load_and_preprocess_dataset(csv_path: str):
    """
    Loads raw survey data and performs initial parsing:
    1. Generates binary target 'procrastination' from 'assignment_delay_frequency'
       - Always / Often = 1
       - Sometimes / Occasionally / Never = 0
    2. Drops non-feature / forbidden columns:
       - Timestamp
       - assignment_delay_frequency (source of target)
       - effect_of_procrastination_on_grades
       - procrastination_and_grade_outcome
    3. Splits multi-choice 'procrastination_reasons' into binary indicators.
    4. Returns feature matrix X and target vector y.
    """
    df = pd.read_csv(csv_path)
    print(f"Loaded raw dataset with {df.shape[0]} rows and {df.shape[1]} columns.")
    
    # 1. Target creation
    delay_mapping = {
        'Always': 1,
        'Often': 1,
        'Sometimes': 0,
        'Occasionally': 0,
        'Never': 0
    }
    
    # Clean whitespace and map
    cleaned_delay = df['assignment_delay_frequency'].astype(str).str.strip()
    y = cleaned_delay.map(delay_mapping)
    
    # Verify no unmapped target values
    if y.isnull().any():
        unmapped = df['assignment_delay_frequency'][y.isnull()].unique()
        print(f"Warning: Found unmapped target values: {unmapped}. Filling with mode.")
        y = y.fillna(0).astype(int)
    else:
        y = y.astype(int)
        
    y.name = 'procrastination'
    
    # 2. Extract multi-label reasons
    reasons_df = parse_procrastination_reasons(df)
    
    # 3. Drop disallowed and target-derived columns
    cols_to_drop = [
        'Timestamp',
        'assignment_delay_frequency',
        'effect_of_procrastination_on_grades',
        'procrastination_and_grade_outcome',
        'procrastination_reasons'
    ]
    
    existing_cols_to_drop = [col for col in cols_to_drop if col in df.columns]
    X_base = df.drop(columns=existing_cols_to_drop)
    
    # 4. Combine base features with engineered reason features
    X = pd.concat([X_base, reasons_df], axis=1)
    
    print(f"Preprocessed Feature Matrix X shape: {X.shape}")
    print(f"Target y distribution:\n{y.value_counts(normalize=True).round(4) * 100}% (Count: {dict(y.value_counts())})")
    
    return X, y
