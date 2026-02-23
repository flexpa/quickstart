export const eobDetailsUnified = {
  resourceType: 'ViewDefinition',
  resource: 'ExplanationOfBenefit',
  name: 'carin-bb-eob-details-unified',
  status: 'active',
  select: [
    {
      column: [
        // ============================================
        // COMMON FIELDS (All EOB Types)
        // ============================================
        {
          name: 'id',
          path: 'id',
        },
        {
          name: 'supportedProfiles',
          path: "meta.profile.join(',')",
        },
        {
          name: 'patient',
          path: "patient.reference.join(',')",
        },
        {
          name: 'unique_claim_id',
          path: "identifier.where(type.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType').code='uc').value.join(',')",
        },
        {
          name: 'type',
          path: "type.coding.where(system='http://terminology.hl7.org/CodeSystem/claim-type').code.join(',')",
        },
        {
          name: 'subType_code',
          path: "subType.coding.code.join(',')",
        },
        {
          name: 'subType_system',
          path: "subType.coding.system.join(',')",
        },
        {
          name: 'status',
          path: 'status',
        },
        {
          name: 'use',
          path: 'use',
        },
        {
          name: 'disposition',
          path: 'disposition',
        },
        {
          name: 'outcome',
          path: 'outcome',
        },
        {
          name: 'created',
          path: 'created',
        },
        {
          name: 'insurer',
          path: "insurer.reference.join(',')",
        },
        {
          name: 'provider',
          path: "provider.reference.join(',')",
        },
        {
          name: 'payee_party',
          path: "payee.party.reference.join(',')",
        },
        {
          name: 'prescription',
          path: "prescription.reference.join(',')",
        },
        {
          name: 'facility',
          path: "facility.reference.join(',')",
        },

        // ============================================
        // CONTAINED RESOURCES
        // ============================================
        {
          name: 'contained_org_ids',
          path: "contained.where(resourceType='Organization').id",
          collection: true,
        },
        {
          name: 'contained_org_names',
          path: "contained.where(resourceType='Organization').name",
          collection: true,
        },
        {
          name: 'contained_org_identifier_values',
          path: "contained.where(resourceType='Organization').identifier.value",
          collection: true,
        },
        {
          name: 'contained_org_identifier_systems',
          path: "contained.where(resourceType='Organization').identifier.system",
          collection: true,
        },
        {
          name: 'contained_practitioner_ids',
          path: "contained.where(resourceType='Practitioner').id",
          collection: true,
        },
        {
          name: 'contained_practitioner_names',
          path: "contained.where(resourceType='Practitioner').name.text",
          collection: true,
        },

        {
          name: 'billablePeriod_start',
          path: 'billablePeriod.start',
        },
        {
          name: 'billablePeriod_end',
          path: 'billablePeriod.end',
        },

        // Financial Totals
        {
          name: 'total_submitted',
          path: "total.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='submitted').amount.value.join(',')",
        },
        {
          name: 'total_benefit',
          path: "total.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='benefit').amount.value.join(',')",
        },
        {
          name: 'total_discount',
          path: "total.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudication').code='discount').amount.value.join(',')",
        },
        {
          name: 'total_memberliability',
          path: "total.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudication').code='memberliability').amount.value.join(',')",
        },
        {
          name: 'total_deductible',
          path: "total.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='deductible').amount.value.join(',')",
        },
        {
          name: 'total_copay',
          path: "total.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudication').code='copay').amount.value.join(',')",
        },

        // Insurance
        {
          name: 'insurance_focal',
          path: "insurance.focal.join(',')",
        },
        {
          name: 'insurance_coverage_reference',
          path: "insurance.coverage.reference.join(',')",
        },

        // Items - Common Fields
        {
          name: 'item_sequence',
          path: 'item.sequence',
          collection: true,
        },
        {
          name: 'item_servicedDate',
          path: 'item.servicedDate',
          collection: true,
        },
        {
          name: 'item_servicedPeriod_start',
          path: 'item.servicedPeriod.start',
          collection: true,
        },
        {
          name: 'item_servicedPeriod_end',
          path: 'item.servicedPeriod.end',
          collection: true,
        },
        {
          name: 'item_productOrService_system',
          path: 'item.productOrService.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'item_productOrService_code',
          path: 'item.productOrService.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'item_productOrService_display',
          path: 'item.productOrService.coding.display.distinct()',
          collection: true,
        },
        {
          name: 'item_quantity_value',
          path: 'item.quantity.value',
          collection: true,
        },
        {
          name: 'item_net_value',
          path: 'item.net.value',
          collection: true,
        },
        {
          name: 'item_diagnosisSequence',
          path: 'item.diagnosisSequence',
          collection: true,
        },
        {
          name: 'item_procedureSequence',
          path: 'item.procedureSequence',
          collection: true,
        },

        // Item Adjudications
        {
          name: 'item_adjudication_submitted',
          path: "item.adjudication.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='submitted').amount.value",
          collection: true,
        },
        {
          name: 'item_adjudication_benefit',
          path: "item.adjudication.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='benefit').amount.value",
          collection: true,
        },
        {
          name: 'item_adjudication_copay',
          path: "item.adjudication.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudication').code='copay').amount.value",
          collection: true,
        },
        {
          name: 'item_adjudication_deductible',
          path: "item.adjudication.where(category.coding.where(system='http://terminology.hl7.org/CodeSystem/adjudication').code='deductible').amount.value",
          collection: true,
        },
        {
          name: 'item_adjudication_memberliability',
          path: "item.adjudication.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBAdjudication').code='memberliability').amount.value",
          collection: true,
        },

        // Item Adjudication Reasons
        {
          name: 'item_adjudication_reason_system',
          path: 'item.adjudication.reason.coding.system',
          collection: true,
        },
        {
          name: 'item_adjudication_reason_code',
          path: 'item.adjudication.reason.coding.code',
          collection: true,
        },
        {
          name: 'item_adjudication_reason_display',
          path: 'item.adjudication.reason.coding.display',
          collection: true,
        },
        {
          name: 'item_adjudication_category_code',
          path: 'item.adjudication.category.coding.code',
          collection: true,
        },

        // Item Modifiers
        {
          name: 'item_modifier_system',
          path: 'item.modifier.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'item_modifier_code',
          path: 'item.modifier.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'item_modifier_display',
          path: 'item.modifier.coding.display.distinct()',
          collection: true,
        },

        // Item Revenue (Institutional)
        {
          name: 'item_revenue_system',
          path: 'item.revenue.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'item_revenue_code',
          path: 'item.revenue.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'item_revenue_display',
          path: 'item.revenue.coding.display.distinct()',
          collection: true,
        },

        // Item Location (Professional)
        {
          name: 'item_locationCodeableConcept_system',
          path: 'item.locationCodeableConcept.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'item_locationCodeableConcept_code',
          path: 'item.locationCodeableConcept.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'item_locationCodeableConcept_display',
          path: 'item.locationCodeableConcept.coding.display.distinct()',
          collection: true,
        },

        // Item Details (Pharmacy - for compound medications)
        {
          name: 'item_detail_productOrService_system',
          path: 'item.detail.productOrService.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'item_detail_productOrService_code',
          path: 'item.detail.productOrService.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'item_detail_productOrService_display',
          path: 'item.detail.productOrService.coding.display.distinct()',
          collection: true,
        },

        // Care Team
        {
          name: 'careTeam_role_system',
          path: 'careTeam.role.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_role_code',
          path: 'careTeam.role.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_role_display',
          path: 'careTeam.role.coding.display.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_provider_reference',
          path: 'careTeam.provider.reference.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_qualification_system',
          path: 'careTeam.qualification.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_qualification_code',
          path: 'careTeam.qualification.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'careTeam_qualification_display',
          path: 'careTeam.qualification.coding.display.distinct()',
          collection: true,
        },

        // Diagnoses
        {
          name: 'diagnosis_sequence',
          path: 'diagnosis.sequence',
          collection: true,
        },
        {
          name: 'diagnosis_type_system',
          path: 'diagnosis.type.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'diagnosis_type_code',
          path: 'diagnosis.type.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'diagnosis_type_display',
          path: 'diagnosis.type.coding.display.distinct()',
          collection: true,
        },
        {
          name: 'diagnosisCodeableConcept_system',
          path: 'diagnosis.diagnosisCodeableConcept.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'diagnosisCodeableConcept_code',
          path: 'diagnosis.diagnosisCodeableConcept.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'diagnosisCodeableConcept_display',
          path: 'diagnosis.diagnosisCodeableConcept.coding.display.distinct()',
          collection: true,
        },
        {
          name: 'onAdmission_system',
          path: 'diagnosis.onAdmission.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'onAdmission_code',
          path: 'diagnosis.onAdmission.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'onAdmission_display',
          path: 'diagnosis.onAdmission.coding.display.distinct()',
          collection: true,
        },

        // Procedures
        {
          name: 'procedure_sequence',
          path: 'procedure.sequence',
          collection: true,
        },
        {
          name: 'procedure_type_system',
          path: 'procedure.type.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'procedure_type_code',
          path: 'procedure.type.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'procedure_type_display',
          path: 'procedure.type.coding.display.distinct()',
          collection: true,
        },
        {
          name: 'procedure_date',
          path: 'procedure.date',
          collection: true,
        },
        {
          name: 'procedure_procedureCodeableConcept_system',
          path: 'procedure.procedureCodeableConcept.coding.system.distinct()',
          collection: true,
        },
        {
          name: 'procedure_procedureCodeableConcept_code',
          path: 'procedure.procedureCodeableConcept.coding.code.distinct()',
          collection: true,
        },
        {
          name: 'procedure_procedureCodeableConcept_display',
          path: 'procedure.procedureCodeableConcept.coding.display.distinct()',
          collection: true,
        },

        // ============================================
        // PHARMACY-SPECIFIC FIELDS
        // ============================================
        {
          name: 'dayssupply_value',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='dayssupply').valueQuantity.value.join(',')",
        },
        {
          name: 'dawcode_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='dawcode').code.coding.system.join(',')",
        },
        {
          name: 'dawcode_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='dawcode').code.coding.code.join(',')",
        },
        {
          name: 'dawcode_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='dawcode').code.coding.display.join(',')",
        },
        {
          name: 'refillnum',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='refillnum').valueQuantity.value.join(',')",
        },
        {
          name: 'refillsauthorized',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='refillsauthorized').valueQuantity.value.join(',')",
        },
        {
          name: 'brandgenericindicator_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='brandgenericindicator').code.coding.system.join(',')",
        },
        {
          name: 'brandgenericindicator_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='brandgenericindicator').code.coding.code.join(',')",
        },
        {
          name: 'brandgenericindicator_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='brandgenericindicator').code.coding.display.join(',')",
        },
        {
          name: 'rxorigincode_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='rxorigincode').code.coding.system.join(',')",
        },
        {
          name: 'rxorigincode_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='rxorigincode').code.coding.code.join(',')",
        },
        {
          name: 'rxorigincode_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='rxorigincode').code.coding.display.join(',')",
        },
        {
          name: 'compoundcode_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='compoundcode').code.coding.system.join(',')",
        },
        {
          name: 'compoundcode_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='compoundcode').code.coding.code.join(',')",
        },
        {
          name: 'compoundcode_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='compoundcode').code.coding.display.join(',')",
        },

        // ============================================
        // INSTITUTIONAL-SPECIFIC FIELDS
        // ============================================
        {
          name: 'admissionperiod_start',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='admissionperiod').timingPeriod.start.join(',')",
        },
        {
          name: 'admissionperiod_end',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='admissionperiod').timingPeriod.end.join(',')",
        },
        {
          name: 'typeofbill_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='typeofbill').code.coding.system",
          collection: true,
        },
        {
          name: 'typeofbill_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='typeofbill').code.coding.code",
          collection: true,
        },
        {
          name: 'typeofbill_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='typeofbill').code.coding.display",
          collection: true,
        },
        {
          name: 'pointoforigin_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='pointoforigin').code.coding.system",
          collection: true,
        },
        {
          name: 'pointoforigin_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='pointoforigin').code.coding.code.distinct()",
          collection: true,
        },
        {
          name: 'pointoforigin_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='pointoforigin').code.coding.display.distinct()",
          collection: true,
        },
        {
          name: 'admtype_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='admtype').code.coding.system.distinct()",
          collection: true,
        },
        {
          name: 'admtype_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='admtype').code.coding.code.distinct()",
          collection: true,
        },
        {
          name: 'admtype_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='admtype').code.coding.display.distinct()",
          collection: true,
        },
        {
          name: 'discharge_status_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='discharge-status').code.coding.system.distinct()",
          collection: true,
        },
        {
          name: 'discharge_status_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='discharge-status').code.coding.code.distinct()",
          collection: true,
        },
        {
          name: 'discharge_status_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='discharge-status').code.coding.display.distinct()",
          collection: true,
        },
        {
          name: 'drg_system',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='drg').code.coding.system.join(',')",
        },
        {
          name: 'drg_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='drg').code.coding.code.join(',')",
        },
        {
          name: 'drg_display',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='drg').code.coding.display.join(',')",
        },

        // ============================================
        // PROFESSIONAL-SPECIFIC FIELDS
        // ============================================
        {
          name: 'servicefacility_reference',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='servicefacility').valueReference.reference.join(',')",
        },

        // ============================================
        // SHARED SUPPORTING INFO
        // ============================================
        {
          name: 'billingnetworkcontractingstatus_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='billingnetworkcontractingstatus').code.coding.code.join(',')",
        },
        {
          name: 'performingnetworkcontractingstatus_code',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='performingnetworkcontractingstatus').code.coding.code.join(',')",
        },
        {
          name: 'clmrecvddate_date',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='clmrecvddate').timingDate.join(',')",
        },
        {
          name: 'medicalrecordnumber_value',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='medicalrecordnumber').valueString.join(',')",
        },
        {
          name: 'patientaccountnumber_value',
          path: "supportingInfo.where(category.coding.where(system='http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType').code='patientaccountnumber').valueString.join(',')",
        },

        // ============================================
        // PAYMENT & NOTES
        // ============================================
        {
          name: 'payment_type_system',
          path: 'payment.type.coding.system',
          collection: true,
        },
        {
          name: 'payment_type_code',
          path: 'payment.type.coding.code',
          collection: true,
        },
        {
          name: 'payment_type_display',
          path: 'payment.type.coding.display',
          collection: true,
        },
        {
          name: 'payment_date',
          path: "payment.date.join(',')",
        },
        {
          name: 'process_note',
          path: "processNote.text.join(',')",
        },
      ],
    },
  ],
};
