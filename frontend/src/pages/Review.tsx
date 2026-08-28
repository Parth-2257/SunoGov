import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Review: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-neutral-500">
        <Eye className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-semibold uppercase tracking-wider">Step 2: Review Extracted Details</span>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-neutral-900 font-sans">Verify Extracted Information</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Review the details our AI extracted from your statement.
        </p>

        {/* Mock Summary details */}
        <div className="mt-6 border-t border-neutral-100 pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-xs font-semibold text-neutral-400">Request Type</span>
            <span className="text-sm font-bold text-neutral-800 col-span-2">Grievance (Simulated)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-xs font-semibold text-neutral-400">EPFO Category</span>
            <span className="text-sm font-bold text-neutral-800 col-span-2">Withdrawal delay issues</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-xs font-semibold text-neutral-400">Extracted UAN</span>
            <span className="text-sm font-bold text-neutral-800 col-span-2 font-mono">100123456789</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-xs font-semibold text-neutral-400">Problem Summary</span>
            <span className="text-sm text-neutral-600 col-span-2">
              Citizen filed Form 31 online claim on August 1st but PF settlement remains under process.
            </span>
          </div>
        </div>

        {/* Buttons Mock */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-neutral-100 pt-5">
          <Button variant="primary" disabled className="w-full sm:w-auto">
            Submit Simulated Grievance (Disabled in Phase 0)
          </Button>
          <Button variant="outline" onClick={() => navigate('/success')} className="w-full sm:w-auto gap-1">
            Preview Next Page (Success)
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
