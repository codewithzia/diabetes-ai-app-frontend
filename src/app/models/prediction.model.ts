export interface AssessmentFeatures {
  age_group: string;
  sex: string;
  race: string;
  education: string;
  income: string;
  bmi_category: string;
  smoking: string;
  physical_activity: string;
  hypertension: string;
  high_cholesterol: string;
  cardiovascular_disease: string;
  stroke: string;
  kidney_disease: string;
  general_health: string;
  health_insurance: string;
  personal_provider: string;
  medical_cost: string;
  checkup: string;
}

export interface PredictionRequest {
  features: AssessmentFeatures;
}

export interface ExplanationFactor {
  feature: string;
  display_name: string;
  direction: 'increase' | 'decrease';
  contribution: number;
  explanation: string;
}

export interface PredictionResponse {
  prediction: 0 | 1;
  probability: number;
  risk_category: string;
  model_version: string;
  threshold: number;
  explanations: ExplanationFactor[];
  prediction_id?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
  help?: string;
}

export interface FormSection {
  id: string;
  title: string;
  subtitle: string;
  fields: FormField[];
}

export interface FormField {
  key: keyof AssessmentFeatures;
  label: string;
  helpText: string;
  options: DropdownOption[];
}
