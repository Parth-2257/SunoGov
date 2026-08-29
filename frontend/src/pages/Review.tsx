import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Edit2, ShieldCheck, ChevronDown, ChevronUp, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { Grievance } from '../types';

export const Review: React.FC = () => {
  const navigate = useNavigate();
  const {
    rawInput,
    uan,
    analysis,
    setSubStep,
    updateGrievance,
    collectedFields
  } = useSunoGov();

  const [categoryHelpOpen, setCategoryHelpOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [createdGrievance, setCreatedGrievance] = useState<Grievance | null>(null);

  // Route guard
  useEffect(() => {
    if (!analysis || !rawInput.trim()) {
      navigate('/');
    }
  }, [analysis, rawInput, navigate]);

  // Simulated submission status messages
  const submissionSteps = [
    'Checking your details...',
    'Preparing your grievance...',
    'Creating your acknowledgement...'
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSubmitting && !error) {
      if (submitStep < submissionSteps.length) {
        timer = setTimeout(() => {
          setSubmitStep(prev => prev + 1);
        }, 800); // Shift step every 800ms
      } else {
        if (createdGrievance) {
          updateGrievance(createdGrievance);
          setIsSubmitting(false);
          navigate('/success');
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, submitStep, createdGrievance, error]);

  const handleSubmit = async () => {
    if (!analysis) return;
    setIsSubmitting(true);
    setSubmitStep(0);
    setError(null);
    setCreatedGrievance(null);

    // Map intent to category
    const category = analysis.intent.name.includes('TRANSFER') 
      ? 'DEMO_PF_TRANSFER_CATEGORY' 
      : (analysis.intent.name.includes('REJECTED') 
        ? 'DEMO_PF_CLAIM_REJECTION_CATEGORY' 
        : (analysis.intent.name.includes('PENSION') 
          ? 'DEMO_PENSION_CATEGORY' 
          : 'DEMO_GENERAL_CATEGORY'));

    try {
      const payload = {
        request_type: analysis.request_type,
        intent: analysis.intent.name,
        summary: analysis.summary,
        category: category,
        description: rawInput,
        uan: uan
      };
      
      const result = await apiService.createGrievance(payload);
      setCreatedGrievance(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while creating your demo grievance. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    // Return to report and open at step input
    setSubStep('input');
    navigate('/report');
  };

  // If submitting, render the loader screen instead of the summary
  if (isSubmitting) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-6">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-neutral-900">Simulating Submission</h3>
            <p className="text-sm text-neutral-500 min-h-[20px] transition-all">
              {submissionSteps[submitStep] || 'Finalizing...'}
            </p>
          </div>
          
          {/* Visual progress bar */}
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((submitStep + 1) / (submissionSteps.length + 1)) * 100}%` }}
            ></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Progress Tracker (Sub-steps) */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-neutral-200 text-neutral-600">1</span>
          <span className="text-xs font-semibold text-neutral-500">Explain Problem</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-neutral-200 text-neutral-600">2</span>
          <span className="text-xs font-semibold text-neutral-500">AI Understanding</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-neutral-200 text-neutral-600">3</span>
          <span className="text-xs font-semibold text-neutral-500">Provide Details</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary-600 text-white shadow-sm">4</span>
          <span className="text-xs font-semibold text-neutral-900 font-bold">Review & Submit</span>
        </div>
      </div>

      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 font-sans">Review before submitting</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Ensure your details are accurate. Once submitted, your simulated ticket status will be generated.
          </p>
        </div>

        <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100 py-2 space-y-5">
          
          {/* Section: What you told us */}
          <div className="pt-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">What you told us</span>
            <p className="text-sm text-neutral-700 italic bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              "{rawInput}"
            </p>
          </div>

          {/* Section: What we understood */}
          <div className="pt-5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">What we understood</span>
            <p className="text-sm font-semibold text-neutral-800">
              {analysis?.summary}
            </p>
          </div>

          {/* Section: Request type */}
          <div className="pt-5 grid grid-cols-3 gap-2">
            <span className="text-xs font-semibold text-neutral-400">Request Type</span>
            <span className="text-sm font-bold text-neutral-800 col-span-2 capitalize">
              {analysis?.request_type.toLowerCase()} (Simulated)
            </span>
          </div>

          {/* Section: Category */}
          <div className="pt-5 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs font-semibold text-neutral-400">Demo Category</span>
              <span className="text-sm font-bold text-neutral-800 col-span-2 font-mono">
                {analysis?.intent.name || 'DEMO_PF_TRANSFER_CATEGORY'}
              </span>
            </div>

            {/* Why this category Help Interaction */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                type="button"
                onClick={() => setCategoryHelpOpen(!categoryHelpOpen)}
                className="w-full px-3 py-2 flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 font-semibold focus:outline-none"
              >
                <span>Why this category?</span>
                {categoryHelpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {categoryHelpOpen && (
                <div className="px-3 pb-3 pt-1 text-xs text-neutral-500 leading-relaxed border-t border-neutral-200 bg-white">
                  We selected this category based on the problem you described. In the production version, this would be mapped against a verified government category list.
                </div>
              )}
            </div>
          </div>

          {/* Section: Reference Info */}
          <div className="pt-5 pb-2 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Details Provided</span>
            {collectedFields && Object.keys(collectedFields).length > 0 ? (
              Object.entries(collectedFields).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 gap-2 text-sm border-b border-neutral-100 pb-2">
                  <span className="text-xs font-semibold text-neutral-400 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-bold text-neutral-800 col-span-2 font-mono">{val}</span>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-xs font-semibold text-neutral-400">UAN Reference</span>
                <span className="text-sm font-bold text-neutral-800 col-span-2 font-mono">{uan}</span>
              </div>
            )}
          </div>

        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Failure</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Edit & Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleEdit}
            className="w-full sm:w-auto gap-1.5 border-neutral-300"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            className="w-full sm:w-auto gap-1.5 shadow-md"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Submit grievance
          </Button>
        </div>

      </Card>
    </div>
  );
};
