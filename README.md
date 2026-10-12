# CarbonWise: Carbon Emission Prediction Using Elastic Net Regression with Feature Scaling

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-green.svg)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4%2B-orange.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end Machine Learning web application and research pipeline for predicting monthly area-level carbon emissions from demographic and activity indicators (**Population**, **Electricity Consumption**, **Fuel Consumption**, and **Transport Vehicle Distance**).

---

## 🌟 Key Highlights

- **Core Academic Algorithm**: Elastic Net Regression combining L1 (Lasso) and L2 (Ridge) penalties with `StandardScaler` feature scaling and 5-fold cross-validation.
- **Multi-Model Benchmark**: Evaluates and compares 5 regression models:
  - Linear Regression
  - Ridge Regression
  - Lasso Regression
  - **Elastic Net Regression (Selected Model)**
  - Random Forest Regressor
- **Interactive Web Interface**: High-performance Flask web application with animated environmental UI, live interactive sliders, carbon tier categorization, and instant prediction visualization.
- **RESTful API**: Fast JSON endpoints (`/health` and `/predict`) for external integrations.
- **Project Presentation Included**: Contains the full review presentation slides (`Carbon_Emission_Prediction_OSSP_Review_PPT.pptx`).

---

## 📊 Dataset & Features

The model predicts **Carbon Emissions (Tonnes CO2e/month)** based on four core input features:

| Feature Name | Description | Range | Unit |
| :--- | :--- | :---: | :--- |
| **Population** | Area population count | 1 – 1,000 | people |
| **Electricity** | Monthly electricity consumption | 10 – 100,000 | MWh/month |
| **Fuel** | Monthly liquid fuel consumption | 100 – 50,000 | litres/month |
| **Transport** | Monthly vehicular distance travelled | 1,000 – 5,000,000 | vehicle-km/month |

### Target Variable
- **Estimated Carbon Emissions**: Tonnes $\text{CO}_2\text{e}$ / month
- Categorized into risk tiers:
  - 🟢 **Low**: $< 50$ tonnes $\text{CO}_2\text{e}$
  - 🟡 **Moderate**: $50 - 150$ tonnes $\text{CO}_2\text{e}$
  - 🟠 **High**: $150 - 300$ tonnes $\text{CO}_2\text{e}$
  - 🔴 **Very High**: $> 300$ tonnes $\text{CO}_2\text{e}$

---

## 📈 Visual Results & Model Evaluation

### 1. Actual vs. Predicted & Model Comparison
| Actual vs Predicted | Model Comparison Benchmark |
| :---: | :---: |
| ![Actual vs Predicted](outputs/actual_vs_predicted.png) | ![Model Comparison](outputs/model_comparison.png) |

### 2. Feature Importance & Residual Analysis
| Feature Coefficients | Residual Plot |
| :---: | :---: |
| ![Feature Coefficients](outputs/feature_coefficients.png) | ![Residual Plot](outputs/residual_plot.png) |

### 3. Correlation Heatmap
![Correlation Heatmap](outputs/correlation_heatmap.png)

---

## 📁 Repository Structure

```text
├── app.py                                         # Flask web application & REST API
├── train_model.py                                 # Training, tuning & model comparison pipeline
├── evaluate.py                                    # Model evaluation and visual metric generation
├── eda.py                                         # Exploratory Data Analysis & distribution plots
├── predict.py                                     # Command-line interactive prediction CLI
├── requirements.txt                               # Python dependencies
├── pyproject.toml                                 # Project metadata and configuration
├── run.bat                                        # One-click Windows launcher
├── README.md                                      # Project documentation
├── .gitignore                                     # Ignored files (caches, virtualenvs)
├── Carbon_Emission_Prediction_OSSP_Review_PPT.pptx# Project review presentation slides
├── data/
│   └── carbon_emission_dataset.csv                # Training and testing dataset
├── models/
│   ├── carbonwise_model.joblib                    # Serialized trained ElasticNet pipeline
│   └── model_metadata.json                        # Model parameters, features & metadata
├── outputs/                                       # Generated evaluation charts & CSV reports
│   ├── actual_vs_predicted.png
│   ├── correlation_heatmap.png
│   ├── emissions_distribution.png
│   ├── feature_coefficients.csv
│   ├── feature_coefficients.png
│   ├── metrics.csv
│   ├── model_comparison.csv
│   ├── model_comparison.png
│   └── residual_plot.png
├── static/                                        # Frontend assets
│   ├── README.txt
│   ├── script.js                                  # Interactive UI & dynamic chart logic
│   └── style.css                                  # Environmental glassmorphism styling
└── templates/
    └── index.html                                 # Web application UI template
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10 or higher installed
- `pip` package manager

### 2. Clone the Repository
```bash
git clone https://github.com/sainathreddy1097-dot/Carbon-Emission-Prediction-Using-Elastic-Net-Regression-with-Feature-Scaling.git
cd Carbon-Emission-Prediction-Using-Elastic-Net-Regression-with-Feature-Scaling
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Train the Model & Run Evaluation (Optional)
To retrain the models and generate new performance graphs:
```bash
# Generate data & train candidate models
python train_model.py

# Evaluate test metrics and generate plots
python evaluate.py

# Generate exploratory analysis visualizations
python eda.py
```

### 5. Launch the Web Application
```bash
python app.py
```
*(On Windows, you can also double-click `run.bat`)*

Then open your browser at:
```
http://127.0.0.1:5000
```

---

## 🖥️ Command-Line Prediction

You can also run quick interactive predictions directly from your terminal:
```bash
python predict.py
```

---

## 🔌 API Reference

### Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "ok",
  "model_loaded": true,
  "model": "ElasticNet Regression",
  "population_range": [1, 1000],
  "unit": "tonnes CO2e/month"
}
```

### Predict Emission
- **Endpoint**: `POST /predict`
- **Request Body**:
```json
{
  "population": 250,
  "electricity": 4500.5,
  "fuel": 1200.0,
  "transport": 25000.0
}
```
- **Response**:
```json
{
  "prediction": 128.45,
  "category": "Moderate",
  "unit": "tonnes CO2e/month",
  "inputs": {
    "population": 250,
    "electricity": 4500.5,
    "fuel": 1200.0,
    "transport": 25000.0
  }
}
```

---

## 🔬 Methodology & Model Tuning

1. **Feature Preprocessing**:
   - `SimpleImputer(strategy="median")` handles any missing values safely.
   - `StandardScaler()` normalizes feature distributions so gradient-based regularization treats features equitably.
2. **Elastic Net Objective**:
   $$\min_{w} \frac{1}{2n_{\text{samples}}} \|Xw - y\|_2^2 + \alpha \rho \|w\|_1 + \frac{\alpha(1-\rho)}{2} \|w\|_2^2$$
   - Combines $L_1$ sparsity selection with $L_2$ stability under collinear inputs.
   - Hyperparameters $\alpha$ and $l_1\text{--ratio}$ are tuned using 5-fold cross-validation with `GridSearchCV`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
