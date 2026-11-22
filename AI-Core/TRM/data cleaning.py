import pandas as pd
import numpy as np

# Opening da file :)
dataset = pd.read_csv("daft_housing_data.csv")

# Making it cleaned and residental only!
dataset_clean = dataset.drop_duplicates().copy()

residential_types = ["Detached", "Semi-D", "Apartment", "Terrace", "Bungalow", "End of Terrace", "Houses", "House", "Townhouse", "Duplex", "Studio", "New Homes"]

dataset_clean = dataset_clean[
    dataset_clean["Property Type"].isin(residential_types)
].copy()

print("Original rows:", len(dataset))
print("Residential rows:", len(dataset_clean))

print("\nRemaining property types:")
print(dataset_clean["Property Type"].value_counts().to_string())

#Make Price numerical
price_text = (dataset_clean["Price"].astype("string").str.strip().str.replace(",","", regex=False))
dataset_clean["Price_numeric"] = pd.to_numeric(price_text, errors = "coerce")

# Keep positive price rows
dataset_clean = dataset_clean[dataset_clean["Price_numeric"].notna() & (dataset_clean["Price_numeric"] > 0)].copy()

print("Rows available for regression:", len(dataset_clean))
print("Missing prices:", dataset_clean["Price_numeric"].isna().sum())

print("\nPrice distribution:")
print(dataset_clean["Price_numeric"].describe(percentiles=[0.01, 0.25, 0.50, 0.75, 0.95, 0.99]))

# Convert floor area to numeric same typa gig as price
dataset_clean["Floor Area (m2)"] = pd.to_numeric(dataset_clean["Floor Area (m2)"], errors="coerce")

# Count suspicious areas before cleaning
area = dataset_clean["Floor Area (m2)"]
print("Below 10 m²:", ((area > 0) & (area < 10)).sum())
print("Above 2,000 m²:", (area > 2000).sum())

# Replace suspicious floor areas with missing values
invalid_area = ((dataset_clean["Floor Area (m2)"] < 10) | (dataset_clean["Floor Area (m2)"] > 2000))

dataset_clean.loc[invalid_area, "Floor Area (m2)"] = np.nan

print("\n Missing areas after cleaning:",
      dataset_clean["Floor Area (m2)"].isna().sum())

print("\n Updated floor area summary:")
print(dataset_clean["Floor Area (m2)"].describe())

#Check Cleaned sheet!
print("Dataset dimensions:", dataset_clean.shape)

print("\nMissing values:")
print(dataset_clean.isna().sum().sort_values(ascending=False).head(10))

print("\nProperty types:")
print(dataset_clean["Property Type"].value_counts())

print("\nDuplicate rows:", dataset_clean.duplicated().sum())

# Inspect the original values before conversion
print("Bedroom values:")
print(dataset_clean["Number of Bedrooms"].value_counts(dropna=False).head(20))

print("\nBathroom values:")
print(dataset_clean["Number of Bathrooms"].value_counts(dropna=False).head(20))

print("\nCounty examples:")
print(dataset_clean["County"].value_counts(dropna=False).head(15))

print("\nBER examples:")
print(dataset_clean["BER Rating"].value_counts(dropna=False).head(15))


# Standardise text categories
for col in ["Property Type", "County", "BER Rating"]:
    dataset_clean[col] = dataset_clean[col].astype("string").str.strip()

# Merge obvious spelling/plural variations
dataset_clean["Property Type"] = dataset_clean["Property Type"].replace({
    "Houses": "House"
})

# Convert bedroom and bathroom counts to numeric
for col in ["Number of Bedrooms", "Number of Bathrooms"]:
    cleaned = (dataset_clean[col].astype("string").str.strip().str.replace(",", "", regex=False))
    dataset_clean[col] = pd.to_numeric(cleaned, errors="coerce")

print(dataset_clean[["Number of Bedrooms", "Number of Bathrooms", "Floor Area (m2)"]].describe())

print("\nMissing numerical values:")
print(dataset_clean[["Number of Bedrooms", "Number of Bathrooms", "Floor Area (m2)"]].isna().sum())

dataset_clean = dataset_clean[(dataset_clean["Number of Bedrooms"].isna() | dataset_clean["Number of Bedrooms"].between(0, 10)) & (dataset_clean["Number of Bathrooms"].isna() | dataset_clean["Number of Bathrooms"].between(0, 10))].copy()

dataset_clean.to_csv("daft_housing_cleaned.csv", index=False)
print("Cleaned dataset saved successfully.")


