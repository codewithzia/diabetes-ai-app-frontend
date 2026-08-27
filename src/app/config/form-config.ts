import { FormSection } from '../models/prediction.model';

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'demographics',
    title: 'Section A — Demographics',
    subtitle: 'Basic demographic information',
    fields: [
      {
        key: 'age_group',
        label: 'Age Group',
        helpText: 'Select the age range that applies',
        options: [
          { label: '18–24 years', value: '18-24' },
          { label: '25–29 years', value: '25-29' },
          { label: '30–34 years', value: '30-34' },
          { label: '35–39 years', value: '35-39' },
          { label: '40–44 years', value: '40-44' },
          { label: '45–49 years', value: '45-49' },
          { label: '50–54 years', value: '50-54' },
          { label: '55–59 years', value: '55-59' },
          { label: '60–64 years', value: '60-64' },
          { label: '65–69 years', value: '65-69' },
          { label: '70–74 years', value: '70-74' },
          { label: '75–79 years', value: '75-79' },
          { label: '80 or older', value: '80+' },
        ],
      },
      {
        key: 'sex',
        label: 'Sex',
        helpText: 'Biological sex as recorded',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
      },
      {
        key: 'race',
        label: 'Race / Ethnicity',
        helpText: 'Self-reported race or ethnicity',
        options: [
          { label: 'White', value: 'white' },
          { label: 'Black or African American', value: 'black' },
          { label: 'Asian', value: 'asian' },
          { label: 'American Indian or Alaskan Native', value: 'native_american' },
          { label: 'Hispanic', value: 'hispanic' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        key: 'education',
        label: 'Education Level',
        helpText: 'Highest level of education completed',
        options: [
          { label: 'Never attended school', value: 'no_school' },
          { label: 'Elementary school', value: 'elementary' },
          { label: 'Some high school', value: 'some_high_school' },
          { label: 'High school graduate', value: 'high_school' },
          { label: 'Some college or technical school', value: 'some_college' },
          { label: 'College graduate', value: 'college_graduate' },
        ],
      },
      {
        key: 'income',
        label: 'Annual Household Income',
        helpText: 'Total household income before taxes',
        options: [
          { label: 'Less than $10,000', value: '<10k' },
          { label: '$10,000 – $15,000', value: '10k-15k' },
          { label: '$15,000 – $20,000', value: '15k-20k' },
          { label: '$20,000 – $25,000', value: '20k-25k' },
          { label: '$25,000 – $35,000', value: '25k-35k' },
          { label: '$35,000 – $50,000', value: '35k-50k' },
          { label: '$50,000 – $75,000', value: '50k-75k' },
          { label: '$75,000 or more', value: '75k+' },
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Section B — Lifestyle',
    subtitle: 'Health-related lifestyle factors',
    fields: [
      {
        key: 'bmi_category',
        label: 'BMI Category',
        helpText: 'Body Mass Index classification',
        options: [
          { label: 'Underweight (BMI < 18.5)', value: 'underweight' },
          { label: 'Normal weight (BMI 18.5–24.9)', value: 'normal' },
          { label: 'Overweight (BMI 25–29.9)', value: 'overweight' },
          { label: 'Obese (BMI ≥ 30)', value: 'obese' },
        ],
      },
      {
        key: 'smoking',
        label: 'Smoking Status',
        helpText: 'Have you smoked at least 100 cigarettes in your life?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'physical_activity',
        label: 'Physical Activity',
        helpText: 'Physical activity or exercise in the past 30 days (outside of regular job)',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
    ],
  },
  {
    id: 'health',
    title: 'Section C — Health Conditions',
    subtitle: 'Existing medical conditions and general health',
    fields: [
      {
        key: 'hypertension',
        label: 'Hypertension (High Blood Pressure)',
        helpText: 'Have you ever been told you have high blood pressure?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
          { label: 'Borderline', value: 'borderline' },
        ],
      },
      {
        key: 'high_cholesterol',
        label: 'High Cholesterol',
        helpText: 'Have you ever been told your cholesterol is high?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
          { label: 'Borderline', value: 'borderline' },
        ],
      },
      {
        key: 'cardiovascular_disease',
        label: 'Cardiovascular Disease',
        helpText: 'Ever diagnosed with angina or coronary heart disease?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'stroke',
        label: 'Stroke',
        helpText: 'Ever had a stroke?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'kidney_disease',
        label: 'Kidney Disease',
        helpText: 'Ever told you have kidney disease (excluding kidney stones, bladder infection)?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'general_health',
        label: 'General Health',
        helpText: 'How would you rate your general health?',
        options: [
          { label: 'Excellent', value: 'excellent' },
          { label: 'Very Good', value: 'very_good' },
          { label: 'Good', value: 'good' },
          { label: 'Fair', value: 'fair' },
          { label: 'Poor', value: 'poor' },
        ],
      },
    ],
  },
  {
    id: 'access',
    title: 'Section D — Healthcare Access',
    subtitle: 'Access to healthcare services',
    fields: [
      {
        key: 'health_insurance',
        label: 'Health Insurance',
        helpText: 'Do you have any kind of health care coverage?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'personal_provider',
        label: 'Personal Healthcare Provider',
        helpText: 'Do you have one person you think of as your personal doctor or health provider?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'medical_cost',
        label: 'Medical Cost Barrier',
        helpText: 'Was there a time in the past 12 months when you needed to see a doctor but could not afford it?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        key: 'checkup',
        label: 'Routine Checkup',
        helpText: 'About how long has it been since you last visited a doctor for a routine checkup?',
        options: [
          { label: 'Within the past year', value: 'past_year' },
          { label: 'Within the past 2 years', value: 'past_2_years' },
          { label: 'Within the past 5 years', value: 'past_5_years' },
          { label: '5 or more years ago', value: '5_plus_years' },
          { label: 'Never', value: 'never' },
        ],
      },
    ],
  },
];
