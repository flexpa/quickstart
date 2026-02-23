export const coverageDetails = {
  resourceType: 'ViewDefinition',
  resource: 'Coverage',
  name: 'coverage-details',
  status: 'active',
  select: [
    {
      column: [
        // ============================================
        // IDENTIFIERS & STATUS
        // ============================================
        {
          name: 'id',
          path: 'id',
        },
        {
          name: 'status',
          path: 'status',
        },
        {
          name: 'type_code',
          path: "type.coding.code.join(',')",
        },
        {
          name: 'type_display',
          path: "type.coding.display.join(',')",
        },
        {
          name: 'type_system',
          path: "type.coding.system.join(',')",
        },
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
        // SUBSCRIBER & BENEFICIARY
        // ============================================
        {
          name: 'policyHolder',
          path: "policyHolder.reference.join(',')",
        },
        {
          name: 'subscriber',
          path: "subscriber.reference.join(',')",
        },
        {
          name: 'subscriberId',
          path: 'subscriberId',
        },
        {
          name: 'beneficiary',
          path: "beneficiary.reference.join(',')",
        },
        {
          name: 'dependent',
          path: 'dependent',
        },
        {
          name: 'relationship_code',
          path: "relationship.coding.code.join(',')",
        },
        {
          name: 'relationship_display',
          path: "relationship.coding.display.join(',')",
        },

        // ============================================
        // PERIOD
        // ============================================
        {
          name: 'period_start',
          path: 'period.start',
        },
        {
          name: 'period_end',
          path: 'period.end',
        },

        // ============================================
        // PAYOR
        // ============================================
        {
          name: 'payor_reference',
          path: "payor.reference.join(',')",
        },
        {
          name: 'payor_display',
          path: "payor.display.join(',')",
        },

        // ============================================
        // CLASS (Group, Plan, SubPlan)
        // ============================================
        {
          name: 'class_type_code',
          path: 'class.type.coding.code',
          collection: true,
        },
        {
          name: 'class_value',
          path: 'class.value',
          collection: true,
        },
        {
          name: 'class_name',
          path: 'class.name',
          collection: true,
        },

        // ============================================
        // NETWORK & ORDER
        // ============================================
        {
          name: 'network',
          path: 'network',
        },
        {
          name: 'order',
          path: 'order',
        },
      ],
    },
  ],
};
