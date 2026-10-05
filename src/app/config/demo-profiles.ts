import { AssessmentFeatures } from '../models/prediction.model';

export interface DemoProfile {
  id: string;
  label: string;
  description: string;
  features: AssessmentFeatures;
}

/**
 * Research Demonstration Mode — synthetic profiles only.
 * These are FICTIONAL examples composed for thesis demonstration;
 * they are not medically diagnosed patients. The prediction result
 * is always computed by the Flask backend, never hard-coded here.
 */
export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'lower-risk',
    label: 'Profile 1 — Lower-Risk Demo',
    description: 'Young, active, no known conditions (synthetic example)',
    features: {
      age_group: '25-29',
      sex: 'female',
      race: 'white',
      education: 'college_graduate',
      income: '75k+',
      bmi_category: 'normal',
      smoking: 'no',
      physical_activity: 'yes',
      hypertension: 'no',
      high_cholesterol: 'no',
      cardiovascular_disease: 'no',
      stroke: 'no',
      kidney_disease: 'no',
      general_health: 'excellent',
      health_insurance: 'yes',
      personal_provider: 'yes',
      medical_cost: 'no',
      checkup: 'past_year',
    },
  },
  {
    id: 'higher-risk',
    label: 'Profile 2 — Higher-Risk Demo',
    description: 'Older, obese, multiple comorbidities (synthetic example)',
    features: {
      age_group: '60-64',
      sex: 'male',
      race: 'white',
      education: 'high_school',
      income: '20k-25k',
      bmi_category: 'obese',
      smoking: 'yes',
      physical_activity: 'no',
      hypertension: 'yes',
      high_cholesterol: 'yes',
      cardiovascular_disease: 'yes',
      stroke: 'no',
      kidney_disease: 'yes',
      general_health: 'fair',
      health_insurance: 'yes',
      personal_provider: 'yes',
      medical_cost: 'yes',
      checkup: 'past_year',
    },
  },
  {
    id: 'mixed-risk',
    label: 'Profile 3 — Mixed-Risk Demo',
    description: 'Middle-aged, overweight, borderline markers (synthetic example)',
    features: {
      age_group: '45-49',
      sex: 'female',
      race: 'asian',
      education: 'some_college',
      income: '35k-50k',
      bmi_category: 'overweight',
      smoking: 'no',
      physical_activity: 'no',
      hypertension: 'borderline',
      high_cholesterol: 'no',
      cardiovascular_disease: 'no',
      stroke: 'no',
      kidney_disease: 'no',
      general_health: 'good',
      health_insurance: 'yes',
      personal_provider: 'no',
      medical_cost: 'no',
      checkup: 'past_2_years',
    },
  },
];
