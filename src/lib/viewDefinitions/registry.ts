import { coverageDetails } from './coverageDetails';
import { eobDetailsUnified } from './eobDetailsUnified';
import { patientDetails } from './patientDetails';

export interface ViewDefinitionEntry {
  key: string;
  displayName: string;
  description: string;
  definition: Record<string, unknown>;
}

export const viewDefinitionRegistry: ViewDefinitionEntry[] = [
  {
    key: 'patient-details',
    displayName: 'Patient',
    description: 'Demographics, contact info, and identifiers',
    definition: patientDetails,
  },
  {
    key: 'coverage-details',
    displayName: 'Coverage',
    description: 'Insurance plans, subscribers, and payors',
    definition: coverageDetails,
  },
  {
    key: 'eob-details-unified',
    displayName: 'Explanation of Benefit',
    description: 'Claims, diagnoses, procedures, and costs',
    definition: eobDetailsUnified,
  },
];

export function getViewDefinitionByKey(key: string) {
  return viewDefinitionRegistry.find((entry) => entry.key === key);
}
