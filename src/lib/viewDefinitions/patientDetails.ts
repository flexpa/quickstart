export const patientDetails = {
  resourceType: 'ViewDefinition',
  resource: 'Patient',
  name: 'patient-details',
  status: 'active',
  select: [
    {
      column: [
        // ============================================
        // BASIC IDENTITY
        // ============================================
        {
          name: 'id',
          path: 'id',
        },
        {
          name: 'name_text',
          path: 'name.text',
          collection: true,
        },
        {
          name: 'name_family',
          path: 'name.family',
          collection: true,
        },
        {
          name: 'name_given',
          path: 'name.given',
          collection: true,
        },
        {
          name: 'name_prefix',
          path: 'name.prefix',
          collection: true,
        },
        {
          name: 'name_suffix',
          path: 'name.suffix',
          collection: true,
        },
        {
          name: 'name_use',
          path: 'name.use',
          collection: true,
        },
        {
          name: 'birthDate',
          path: 'birthDate',
        },
        {
          name: 'gender',
          path: 'gender',
        },
        {
          name: 'maritalStatus_code',
          path: "maritalStatus.coding.code.join(',')",
        },
        {
          name: 'maritalStatus_display',
          path: "maritalStatus.coding.display.join(',')",
        },
        // ============================================
        // US CORE EXTENSIONS
        // ============================================
        {
          name: 'race_code',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension.where(url='ombCategory').valueCoding.code.join(',')",
        },
        {
          name: 'race_display',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension.where(url='ombCategory').valueCoding.display.join(',')",
        },
        {
          name: 'race_text',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension.where(url='text').valueString.join(',')",
        },
        {
          name: 'ethnicity_code',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity').extension.where(url='ombCategory').valueCoding.code.join(',')",
        },
        {
          name: 'ethnicity_display',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity').extension.where(url='ombCategory').valueCoding.display.join(',')",
        },
        {
          name: 'ethnicity_text',
          path: "extension.where(url='http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity').extension.where(url='text').valueString.join(',')",
        },
        // ============================================
        // IDENTIFIERS
        // ============================================
        {
          name: 'identifier_system',
          path: 'identifier.system',
          collection: true,
        },
        {
          name: 'identifier_value',
          path: 'identifier.value',
          collection: true,
        },
        {
          name: 'identifier_type_code',
          path: 'identifier.type.coding.code',
          collection: true,
        },
        // ============================================
        // TELECOM
        // ============================================
        {
          name: 'telecom_system',
          path: 'telecom.system',
          collection: true,
        },
        {
          name: 'telecom_value',
          path: 'telecom.value',
          collection: true,
        },
        {
          name: 'telecom_use',
          path: 'telecom.use',
          collection: true,
        },
        // ============================================
        // ADDRESS
        // ============================================
        {
          name: 'address_text',
          path: 'address.text',
          collection: true,
        },
        {
          name: 'address_line',
          path: 'address.line',
          collection: true,
        },
        {
          name: 'address_city',
          path: 'address.city',
          collection: true,
        },
        {
          name: 'address_state',
          path: 'address.state',
          collection: true,
        },
        {
          name: 'address_postalCode',
          path: 'address.postalCode',
          collection: true,
        },
        {
          name: 'address_country',
          path: 'address.country',
          collection: true,
        },
        {
          name: 'address_use',
          path: 'address.use',
          collection: true,
        },
        // ============================================
        // COMMUNICATION
        // ============================================
        {
          name: 'communication_language_code',
          path: 'communication.language.coding.code',
          collection: true,
        },
        {
          name: 'communication_language_display',
          path: 'communication.language.coding.display',
          collection: true,
        },
        {
          name: 'communication_preferred',
          path: 'communication.preferred',
          collection: true,
        },
        // ============================================
        // REFERENCES
        // ============================================
        {
          name: 'generalPractitioner',
          path: "generalPractitioner.reference.join(',')",
        },
        {
          name: 'managingOrganization',
          path: "managingOrganization.reference.join(',')",
        },
      ],
    },
  ],
};
