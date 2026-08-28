import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Report: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-neutral-500">
        <HelpCircle className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-semibold uppercase tracking-wider">Step 1: Description Input</span>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-neutral-900">Explain your EPFO issue</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Tell us what happened. You can explain your issue in plain English, Hindi, or your mother tongue.
        </p>

        {/* Text Area Mock */}
        <div className="mt-5">
          <label htmlFor="issue-description" className="sr-only">Issue description</label>
          <textarea
            id="issue-description"
            rows={5}
            className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
            placeholder="e.g. I worked at XYZ company from 2022 to 2024. My UAN is 100... but I cannot see my employer PF updates."
            disabled
          ></textarea>
        </div>

        {/* Buttons Mock */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" disabled className="w-full sm:w-auto">
            Process with AI (Disabled in Phase 0)
          </Button>
          <Button variant="outline" onClick={() => navigate('/review')} className="w-full sm:w-auto">
            Preview Next Page (Review) →
          </Button>
        </div>
      </Card>

      <Card className="bg-primary-50/50 border-primary-100">
        <h3 className="text-sm font-bold text-primary-900">Phase 0 Architectural Notice</h3>
        <p className="text-xs text-primary-700 mt-1 leading-relaxed">
          The natural language text analyzer and speech-to-text recorders are disabled during Phase 0. 
          To move through the routing structure, click the <strong>Preview Next Page</strong> buttons.
        </p>
      </Card>
    </div>
  );
};
