# Adaptive AI System for Diabetes Prediction Using Human Feedback

**Master's Thesis Research Prototype**

A Human-in-the-Loop, RLHF-inspired adaptive diabetes prediction system demonstrating continuous model improvement through user feedback.

## Research Contribution

The main research contribution is the **continuous feedback loop**:

```
USER INPUT → DIABETES PREDICTION → EXPLAINABLE AI → USER FEEDBACK → REWARD SIGNAL → ADAPTIVE MODEL LEARNING
```

## Technology Stack

### Frontend
- **Angular 21** with TypeScript
- **Tailwind CSS v4** for styling
- Responsive design (desktop and mobile)
- Standalone components with signals

### Backend
- **Python Flask** REST API
- **scikit-learn** for Logistic Regression model
- **BRFSS 2021** diabetes dataset
- 49 selected processed features

## Project Structure

```
Final Thesis Projects/
├── diabetes-ai-app/          # Angular frontend
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── navbar/           # Navigation bar
│   │   │   │   └── feedback-loop/    # Visual feedback loop indicator
│   │   │   └── pages/
│   │   │       ├── welcome/          # Page 1: Login/Welcome
│   │   │       ├── assessment/       # Page 2: Patient assessment form
│   │   │       ├── prediction/       # Pages 3-5: Result, XAI, Feedback
│   │   │       │   ├── prediction-result/
│   │   │       │   ├── explainable-ai/
│   │   │       │   └── human-feedback/
│   │   │       ├── feedback-confirmation/  # Page 6: Confirmation
│   │   │       ├── adaptive-dashboard/     # Page 7: Adaptive learning monitor
│   │   │       ├── model-comparison/       # Page 8: Model comparison table
│   │   │       └── admin/                  # Page 9: Model management
│   │   ├── config/
│   │   │   └── form-config.ts        # Form field definitions
│   │   ├── models/                   # TypeScript interfaces
│   │   ├── services/
│   │   │   ├── api.service.ts        # REST API client
│   │   │   └── app-state.ts          # Shared application state
│   │   ├── app.routes.ts             # Routing configuration
│   │   └── app.config.ts             # App providers (HttpClient, Router)
│   └── ...
├── backend/                  # Flask backend
│   ├── app.py                # Flask API server
│   └── requirements.txt      # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 22+
- npm 10+
- Python 3.10+
- Angular CLI 21+

### Frontend Setup

```bash
cd diabetes-ai-app
npm install
npm start
```

The frontend will be available at `http://localhost:4200`.

### Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

The backend API will be available at `http://localhost:5000`.

### Production Build

```bash
cd diabetes-ai-app
npm run build
```

Build artifacts will be in `dist/`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Generate diabetes risk prediction |
| POST | `/api/feedback` | Submit user feedback with reward signal |
| GET | `/api/model/status` | Get current model metadata |
| GET | `/api/model/versions` | Get all model versions |
| GET | `/api/model/comparison` | Get model comparison table |
| GET | `/api/adaptive/metrics` | Get adaptive learning metrics |
| POST | `/api/adaptive/update` | Trigger adaptive model update |
| GET | `/api/health` | Health check |

## Pages

1. **Welcome** — Landing page with research overview
2. **Assessment** — Structured prediction form (4 sections, 18 fields)
3. **Prediction Result** — Risk score gauge with model metadata
4. **Explainable AI** — Top contributing factors with bar charts
5. **Human Feedback** — Agree/disagree, helpfulness rating, comments
6. **Feedback Confirmation** — Reward signal and feedback ID
7. **Adaptive Learning Monitor** — Performance charts across model versions
8. **Model Comparison** — Comparison table of 7 candidate models
9. **Admin/Model Management** — Model lifecycle management interface

## Research Requirements Demonstrated

1. Human-in-the-loop prediction
2. Explainable AI with human-readable feature names
3. Human feedback collection (agree/disagree, helpfulness, comments)
4. Reward signal generation (+1/-1)
5. Feedback storage with unique IDs
6. Adaptive model updating via API endpoints
7. Model versioning (V0 through V4)
8. Performance monitoring (accuracy, precision, recall, F1, ROC-AUC, PR-AUC)
9. Static vs adaptive model comparison
10. Continuous feedback loop visualization

## Academic Disclaimer

This system is a research prototype. It provides a statistical risk estimate and does **not** constitute a medical diagnosis. User feedback is distinct from verified clinical outcomes. For research purposes only — this system is not a substitute for professional medical advice or clinical diagnosis.
