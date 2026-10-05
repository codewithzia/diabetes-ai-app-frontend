export type FeedbackType = 'agree' | 'disagree';
export type HelpfulnessLevel = 'very_helpful' | 'helpful' | 'neutral' | 'not_helpful' | 'incorrect';

export interface FeedbackRequest {
  prediction_id: string;
  feedback: FeedbackType;
  helpfulness: HelpfulnessLevel;
  comment: string;
}

export interface FeedbackResponse {
  feedback_id: string;
  reward: number;
  status: string;
}

/** Doctor/reviewer-only verified clinical outcome (NOT agree/disagree). */
export type VerifiedOutcome = 'diabetes' | 'no_diabetes' | 'unable_to_verify';

export interface VerifyOutcomeRequest {
  outcome: VerifiedOutcome;
}

export interface VerifyOutcomeResponse {
  feedback_id: string;
  outcome: VerifiedOutcome;
  verified_label: number | null;
  status: string;
  eligible_for_adaptive: boolean;
  message?: string;
}

export interface FeedbackConfirmation {
  prediction: string;
  userFeedback: FeedbackType;
  reward: number;
  feedbackId: string;
  timestamp: string;
}
