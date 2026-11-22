import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

data = pd.read_csv("daft_housing_cleaned.csv")
print("Dataset loaded:", data.shape)

# 1. Choose the features (X) and target (y)
numeric_features = ["Number of Bedrooms", "Number of Bathrooms", "Floor Area (m2)"]

categorical_features = ["Property Type", "County", "BER Rating"]

feature_columns = numeric_features + categorical_features

X = data[feature_columns].copy()
y = data["Price_numeric"].astype(float)

# 2. Split into training and testing sets
# 80% training, 20% testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Prepare numerical features
numeric_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median"))
])

# 4. Prepare categorical features
categorical_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

# 5. Combine the preprocessing steps
preprocessor = ColumnTransformer(transformers=[
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])

# 6. Create the complete model pipeline
model = Pipeline(steps=[("preprocessor", preprocessor), ("regressor", LinearRegression())])

# 7. Train the model
model.fit(X_train, y_train)

# 8. Make predictions on unseen test data
y_pred = model.predict(X_test)

# 9. Evaluate the model
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\n--- Linear Regression Results ---")
print(f"Training rows: {len(X_train)}")
print(f"Testing rows: {len(X_test)}")
print(f"MAE:  €{mae:,.2f}")
print(f"RMSE: €{rmse:,.2f}")
print(f"R²:   {r2:.4f}")

comparison = X_test.copy()

comparison["Actual Price"] = y_test.to_numpy()
comparison["Predicted Price"] = y_pred

comparison["Absolute Error"] = (comparison["Actual Price"] - comparison["Predicted Price"]).abs()

print("\n--- 10 Largest Prediction Errors ---")
print(comparison.nlargest(10, "Absolute Error").round(2).to_string(index=False))