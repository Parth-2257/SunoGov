import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <Card className="flex flex-col items-center py-8 px-6">
        <div className="w-16 h-16 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-900">Simulated Submission Successful!</h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
          Your mock grievance has been successfully submitted to the simulated SunoGov response portal.
        </p>

        {/* Ticket ID Box */}
        <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4 w-full max-w-sm flex justify-between items-center">
          <div className="text-left">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Grievance Ticket ID</span>
            <span className="text-base font-extrabold text-neutral-800 font-mono">GRV-MOCK-77192</span>
          </div>
          <Button variant="outline" size="sm" className="min-h-[38px] p-2" onClick={() => alert('Copied Mock ID!')}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Button Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button variant="primary" onClick={() => navigate('/track')} className="w-full sm:w-auto">
            Track this Grievance
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
