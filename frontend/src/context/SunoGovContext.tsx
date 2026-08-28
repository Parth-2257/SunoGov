import React, { createContext, useContext, useState } from 'react';
import { AIAnalysis, Grievance, GrievanceStatus } from '../types';
import { apiService } from '../services/api';

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
  triggerMockAnalysis: (text: string) => Promise<void>;
  updateGrievance: (newGrievance: Grievance | null) => void;
  isAnalyzing: boolean;
  analysisError: string | null;
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
  
  // Asynchronous API load states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const updateGrievance = (newGrievance: Grievance | null) => {
    setGrievance(newGrievance);
    setRefId(newGrievance ? newGrievance.id : null);
    setStatus(newGrievance ? newGrievance.status : null);
  };

  // Triggers real API analysis request targeting FastAPI backend
  const triggerMockAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      // Safe trim of the simulated prototype transcript tags if prefixed
      const cleanText = text.replace(/^\[DEMO TRANSCRIPT\]\s*/i, '');
      const response = await apiService.analyzeRequest(cleanText);
      
      if (response.success && response.analysis) {
        const result = response.analysis;
        
        // Map backend AIAnalysisSchema to frontend client types
        const clientAnalysis: AIAnalysis = {
          request_type: result.request_type,
          intent: {
            name: result.intent,
            confidence: result.confidence,
            description: result.summary
          },
          extracted_fields: {
            uan: null
          },
          missing_fields: result.missing_fields.map((f: any) => ({
            field_name: f.field,
            field_type: 'string',
            description: f.reason
          })),
          summary: result.summary,
          confidence: result.confidence
        };
        
        setAnalysis(clientAnalysis);
      } else {
        throw new Error('Analysis returned unsuccessful response payload.');
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Error executing text analysis request.');
      // Enforce clean UNKNOWN fallback models on exception
      setAnalysis({
        request_type: 'UNKNOWN',
        intent: {
          name: 'UNKNOWN',
          confidence: 0.30,
          description: 'Safe fallback triggered on query classification error.'
        },
        extracted_fields: {
          uan: null
        },
        missing_fields: [],
        summary: 'Safe fallback trigger due to system exception.',
        confidence: 0.30
      });
    } finally {
      setIsAnalyzing(false);
    }
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
    setIsAnalyzing(false);
    setAnalysisError(null);
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
        updateGrievance,
        isAnalyzing,
        analysisError
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
