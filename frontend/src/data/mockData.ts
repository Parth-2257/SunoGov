import { AIAnalysis, Grievance, ResourceItem } from '../types';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  rawQuery: string;
  analysis: AIAnalysis;
}

export const MOCK_SCENARIOS: DemoScenario[] = [
  {
    id: 'pf-withdrawal-delay',
    title: 'Delayed PF Settlement',
    description: 'Submitted withdrawal claim Form 31 but it is pending for over 3 weeks.',
    rawQuery: 'I submitted my Form 31 online claim on August 1st for UAN 100123456789 but it is still showing under process.',
    analysis: {
      request_type: 'GRIEVANCE',
      intent: {
        name: 'CLAIM_SETTLEMENT_DELAY',
        confidence: 0.96,
        description: 'Citizen experiencing delay in settling PF withdrawal claims.'
      },
      extracted_fields: {
        uan: '100123456789',
        form_type: 'Form 31'
      },
      missing_fields: [
        {
          field_name: 'claim_id',
          field_type: 'string',
          description: 'EPFO Claim Reference ID (if available)'
        }
      ],
      summary: 'Form 31 PF withdrawal claim pending status update for more than 20 days.',
      confidence: 0.94
    }
  },
  {
    id: 'pension-eligibility',
    title: 'Pension Scheme Inquiry',
    description: 'Citizen asking about service requirements for EPFO pension.',
    rawQuery: 'How many years of service do I need to be eligible for pension under EPS?',
    analysis: {
      request_type: 'INFORMATION',
      intent: {
        name: 'PENSION_ELIGIBILITY_INFO',
        confidence: 0.98,
        description: 'Citizen seeking details on pension eligibility rules.'
      },
      extracted_fields: {},
      missing_fields: [],
      summary: 'Information query regarding minimum eligibility service criteria for Employee Pension Scheme (EPS).',
      confidence: 0.98
    }
  }
];

export const MOCK_GRIEVANCES: Grievance[] = [
  {
    id: 'SG-2026-88271',
    request_type: 'GRIEVANCE',
    intent: 'DEMO_PF_TRANSFER_DELAY',
    summary: 'PF transfer pending for approximately 3 months.',
    category: 'DEMO_PF_TRANSFER_CATEGORY',
    description: 'Form 31 claim submitted for medical emergency is stuck for 3 weeks.',
    uan: 'DEMO-123456',
    status: 'UNDER_REVIEW',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_demo: true,
    last_reminded_at: null
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 'res-uan-activation',
    title: 'How to Activate your UAN',
    description: 'Learn the steps to activate your Universal Account Number online.',
    category: 'UAN Activation',
    link: 'https://www.epfindia.gov.in/'
  },
  {
    id: 'res-withdrawal-limit',
    title: 'PF Withdrawal Limits',
    description: 'Maximum claim boundaries for partial and full PF advance withdrawals.',
    category: 'Withdrawal Rules',
    link: 'https://www.epfindia.gov.in/'
  }
];
