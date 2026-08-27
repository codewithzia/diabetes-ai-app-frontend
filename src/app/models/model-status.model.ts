export interface ModelStatus {
  current_model: string;
  current_version: string;
  training_observations: number;
  selected_features: number;
  feedback_observations: number;
  feedback_batches: number;
  last_update: string;
}

export interface ModelVersion {
  version: string;
  label: string;
  description: string;
  date: string;
}

export interface ModelComparisonRow {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  selected?: boolean;
}
