from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

def get_feature_column_types(X):
    """
    Identifies categorical and binary feature names dynamically from X.
    """
    binary_cols = [col for col in X.columns if col.startswith('reason_')]
    categorical_cols = [col for col in X.columns if col not in binary_cols]
    
    return categorical_cols, binary_cols


def build_preprocessor(categorical_cols, binary_cols, scale_numeric=False):
    """
    Constructs a robust Scikit-Learn ColumnTransformer pipeline:
    - Categorical pipeline: Imputes missing with 'most_frequent' and encodes via OneHotEncoder(handle_unknown='ignore')
    - Binary pipeline: Imputes missing with 0 (constant) and passes through
    - Optional scaling for linear models (Logistic Regression) to ensure optimal convergence.
    """
    cat_pipeline_steps = [
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ]
    
    if scale_numeric:
        cat_pipeline_steps.append(('scaler', StandardScaler(with_mean=False)))
        
    cat_pipeline = Pipeline(cat_pipeline_steps)
    
    bin_pipeline_steps = [
        ('imputer', SimpleImputer(strategy='constant', fill_value=0))
    ]
    if scale_numeric:
        bin_pipeline_steps.append(('scaler', StandardScaler(with_mean=False)))
        
    bin_pipeline = Pipeline(bin_pipeline_steps)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', cat_pipeline, categorical_cols),
            ('bin', bin_pipeline, binary_cols)
        ],
        remainder='drop'
    )
    
    return preprocessor
