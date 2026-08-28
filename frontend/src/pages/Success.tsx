import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, Copy, FileText, Info } from 'lucide-react';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const { refId, analysis, uan, rawInput } = useSunoGov();
  
  const [ackOpen, setAckOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCopy = () => {
    if (refId) {
      navigator.clipboard.writeText(refId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <Card className="flex flex-col items-center py-10 px-6 text-center space-y-5">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center border border-accent-100 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-neutral-900">Grievance created</h2>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            Your demonstration grievance has been created successfully.
          </p>
        </div>

        {/* Reference Number Box */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 w-full max-w-sm flex justify-between items-center text-left">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Demo Reference Number</span>
            <span className="text-lg font-black text-neutral-800 font-mono tracking-wide">{refId}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="p-2 border-neutral-300 min-h-[38px]"
            aria-label="Copy reference number"
          >
            {copied ? <span className="text-xs font-semibold text-accent-600">Copied!</span> : <Copy className="w-4 h-4 text-neutral-500" />}
          </Button>
        </div>

        {/* Detailed Grid */}
        <div className="w-full max-w-md border-t border-b border-neutral-100 py-4 space-y-3.5 text-left text-sm">
          <div className="flex justify-between items-start gap-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-0.5">Issue</span>
            <span className="text-neutral-800 font-semibold text-right">
              {analysis?.summary || 'PF transfer pending'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Submitted</span>
            <span className="text-neutral-800 font-semibold">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</span>
            <Badge variant="success">Submitted</Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
          <Button 
            variant="primary" 
            onClick={() => navigate('/track')} 
            className="w-full sm:flex-1"
          >
            Track grievance
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setAckOpen(!ackOpen)} 
            className="w-full sm:flex-1 border-neutral-300 gap-1.5"
          >
            <FileText className="w-4 h-4" />
            {ackOpen ? 'Hide Acknowledgement' : 'View Acknowledgement'}
          </Button>
        </div>

      </Card>

      {/* Expandable Acknowledgement Card */}
      {ackOpen && (
        <Card className="bg-white border-neutral-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <FileText className="w-5 h-5 text-primary-500" />
              <h3 className="text-base font-bold text-neutral-800">Simulated Acknowledgement Receipt</h3>
            </div>
            
            <div className="space-y-3.5 text-xs text-neutral-600 font-mono">
              <div className="grid grid-cols-3 gap-1">
                <span>RECEIPT_ID:</span>
                <span className="col-span-2 font-bold">{refId}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span>TIMESTAMP:</span>
                <span className="col-span-2">{new Date().toISOString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span>UAN_REF:</span>
                <span className="col-span-2">{uan}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span>CLASSIFIED:</span>
                <span className="col-span-2">{analysis?.intent.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span>STATEMENT:</span>
                <span className="col-span-2 italic">"{rawInput}"</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-[10px] text-neutral-400 italic">
              Note: This is a generated structural metadata receipt representing local state.
            </div>
          </div>
        </Card>
      )}

      {/* Prototype Notice */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs flex items-start gap-2.5">
        <Info className="w-4.5 h-4.5 text-yellow-600 shrink-0 mt-0.5" />
        <p>
          <strong>Prototype Disclaimer:</strong> This is a simulated grievance for demonstration purposes. Nothing has been submitted to EPFO, and no external calls have occurred.
        </p>
      </div>

    </div>
  );
};
