export type RequestType = 'GRIEVANCE' | 'INFORMATION' | 'STATUS' | 'UNKNOWN';

export type GrievanceStatus = 'SUBMITTED' | 'ACKNOWLEDGED' | 'UNDER_REVIEW' | 'REGIONAL_REVIEW' | 'RESOLVED';

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
  request_type: RequestType;
  intent: string;
  summary: string;
  category: string;
  description: string;
  uan: string;
  status: GrievanceStatus;
  created_at: string;
  updated_at: string;
  is_demo: boolean;
  last_reminded_at?: string | null;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  category: string;
}
