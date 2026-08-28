import React, { createContext, useContext, useState } from 'react';
import { AIAnalysis, Grievance, GrievanceStatus } from '../types';

export type SubStepType = 'input' | 'understanding' | 'info' | 'readiness';

interface SunoGovContextType {
  rawInput: string;
  setRawInput: (val: string) => void;
  selectedScenarioId: string | null;
  setSelectedScenarioId: (val: string | null) => void;
  subStep: SubStepType;
  setSubStep: (step: SubStepType) => void;
  uan: string;
  setUan: (val: string) => void;
  analysis: AIAnalysis | null;
  setAnalysis: (val: AIAnalysis | null) => void;
  grievance: Grievance | null;
  setGrievance: (val: Grievance | null) => void;
  refId: string | null;
  setRefId: (val: string | null) => void;
  status: GrievanceStatus | null;
  setStatus: (val: GrievanceStatus | null) => void;
  resetJourney: () => void;
  triggerMockAnalysis: (text: string) => void;
  updateGrievance: (newGrievance: Grievance | null) => void;
}

const SunoGovContext = createContext<SunoGovContextType | undefined>(undefined);

export const SunoGovProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawInput, setRawInput] = useState<string>('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [subStep, setSubStep] = useState<SubStepType>('input');
  const [uan, setUan] = useState<string>('');
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [status, setStatus] = useState<GrievanceStatus | null>(null);

  const updateGrievance = (newGrievance: Grievance | null) => {
    setGrievance(newGrievance);
    setRefId(newGrievance ? newGrievance.id : null);
    setStatus(newGrievance ? newGrievance.status : null);
  };

  // Generate deterministic mock analysis based on input text keywords
  const triggerMockAnalysis = (text: string) => {
    const cleanText = text.toLowerCase();
    
    let requestType: 'GRIEVANCE' | 'INFORMATION' | 'STATUS' | 'UNKNOWN' = 'GRIEVANCE';
    let intentName = 'DEMO_PF_TRANSFER_DELAY';
    let intentDesc = 'Citizen is experiencing delay in settling PF transfer request.';
    let summary = 'PF transfer appears to be pending for approximately 3 months.';
    let missingDesc = 'We need your UAN to identify the PF record related to your grievance.';

    if (cleanText.includes('reject') || cleanText.includes('rejection') || cleanText.includes('kharij')) {
      intentName = 'DEMO_PF_CLAIM_REJECTED';
      intentDesc = 'Citizen withdrawal claim was rejected.';
      summary = 'PF withdrawal claim Form 19/31 rejected by regional office.';
      missingDesc = 'We need your UAN to retrieve your claim records and identify rejection reasons.';
    } else if (cleanText.includes('pension') || cleanText.includes('retired') || cleanText.includes('eps')) {
      intentName = 'DEMO_PENSION_ISSUE';
      intentDesc = 'Citizen inquiring or complaining about pension payout eligibility.';
      summary = 'EPS pension scheme eligibility and payout issues.';
      missingDesc = 'We need your UAN to inspect your total service tenure for pension calculations.';
    } else if (cleanText.includes('status') || cleanText.includes('check') || cleanText.includes('track')) {
      requestType = 'STATUS';
      intentName = 'DEMO_TRACKING_INQUIRY';
      intentDesc = 'Citizen is trying to check the status of a filed grievance.';
      summary = 'Query tracking current status of files.';
      missingDesc = 'We need your UAN to search active ticket listings.';
    } else if (!cleanText.includes('transfer') && !cleanText.includes('pending') && cleanText.length > 0) {
      // General fallback so any typing works
      intentName = 'DEMO_GENERAL_GRIEVANCE';
      intentDesc = 'Citizen described a general EPFO support issue.';
      summary = `Simulated general grievance: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`;
      missingDesc = 'We need your UAN to verify your member account profile details.';
    }

    setAnalysis({
      request_type: requestType,
      intent: {
        name: intentName,
        confidence: 0.95,
        description: intentDesc,
      },
      extracted_fields: {
        uan: null
      },
      missing_fields: [
        {
          field_name: 'uan',
          field_type: 'string',
          description: missingDesc,
        }
      ],
      summary: summary,
      confidence: 0.94
    });
  };

  const resetJourney = () => {
    setRawInput('');
    setSelectedScenarioId(null);
    setSubStep('input');
    setUan('');
    setAnalysis(null);
    setGrievance(null);
    setRefId(null);
    setStatus(null);
  };

  return (
    <SunoGovContext.Provider
      value={{
        rawInput,
        setRawInput,
        selectedScenarioId,
        setSelectedScenarioId,
        subStep,
        setSubStep,
        uan,
        setUan,
        analysis,
        setAnalysis,
        grievance,
        setGrievance,
        refId,
        setRefId,
        status,
        setStatus,
        resetJourney,
        triggerMockAnalysis,
        updateGrievance
      }}
    >
      {children}
    </SunoGovContext.Provider>
  );
};

export const useSunoGov = () => {
  const context = useContext(SunoGovContext);
  if (!context) {
    throw new Error('useSunoGov must be used within a SunoGovProvider');
  }
  return context;
};
