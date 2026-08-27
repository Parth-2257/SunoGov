export type RequestType = 'GRIEVANCE' | 'INFORMATION' | 'STATUS' | 'UNKNOWN';

export type GrievanceStatus = 'DRAFT' | 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface MissingField {
  field_name: string;
  field_type: string;
  description: string;
}

export interface Intent {
  name: string;
  confidence: number;
  description: string;
}

export interface AIAnalysis {
  request_type: RequestType;
  intent: Intent;
  extracted_fields: Record<string, string | null | undefined>;
  missing_fields: MissingField[];
  summary: string;
  confidence: number;
}

export interface Grievance {
  id: string;
  citizen_name: string;
  contact_number: string;
  email?: string;
  uan: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  created_at: string;
  updated_at: string;
  reminders_sent: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  category: string;
}
