export interface MetricPoint {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
}
export interface FeedbackMetricPoint {
  version: string;
  positive_feedback: number;
  negative_feedback: number;
  mean_reward: number;
}

/**
 * Current /api/adaptive/metrics response.
 * Baseline values are the frozen thesis results; the database section
 * reports the actual persisted counts of this deployment.
 */
export interface AdaptiveMetrics {
  baseline_performance: MetricPoint[];
  baseline_feedback: FeedbackMetricPoint[];
  database: {
    mode: string;
    total_predictions: number;
    total_feedback: number;
  };
  model: {
    active_version: string;
    last_update: string;
  };
}

/** GET /api/adaptive/status (sanitised, no filesystem paths). */
export interface AdaptiveStatus {
  active_version: string;
  latest_candidate: string | null;
  candidate_status: string | null;
  adaptive_enabled: boolean;
  pending_verified_feedback: number;
  candidate_versions?: Record<string, string>;
  mode: string;
}

/** POST /api/adaptive/update — guarded adaptive cycle responses. */
export interface AdaptiveUpdateResponse {
  status: 'blocked' | 'skipped' | 'candidate_created' | 'error' | string;
  mode?: string;
  message?: string;
  reason?: string;
  version?: string;
  new_version?: string; // legacy field, kept for compatibility
  active_version?: string;
  candidate_status?: string;
  activation?: string;
}
