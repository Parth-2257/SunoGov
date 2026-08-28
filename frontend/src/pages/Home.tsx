import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Activity, CheckCircle, ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiService } from '../services/api';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [healthMessage, setHealthMessage] = useState<string>('');

  const checkBackendHealth = async () => {
    setHealthStatus('loading');
    setHealthMessage('');
    try {
      const data = await apiService.checkHealth();
      setHealthStatus('success');
      setHealthMessage(`Status: ${data.status}, Service: ${data.service}`);
    } catch (err: any) {
      setHealthStatus('error');
      setHealthMessage(err.message || 'Failed to connect to backend.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          "Tell us what happened. <br className="sm:hidden" />Not what form to fill."
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
          SunoGov is an experimental accessibility hub for EPFO provident fund services. 
          File grievance assistance tickets, check rules, and track claims in a simplified conversational interface.
        </p>
        <div className="mt-8 flex justify-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/report')}
            className="gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Voice or Text Request
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable>
          <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Speak or Type</h3>
          <p className="text-sm text-neutral-500">
            Explain your EPFO grievance or issue in simple, conversational language. No jargon required.
          </p>
        </Card>

        <Card hoverable>
          <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold mb-4">
            2
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">AI Analyzes</h3>
          <p className="text-sm text-neutral-500">
            Our system classifies the request, extracts fields (like UAN), and identifies what information is missing.
          </p>
        </Card>

        <Card hoverable>
          <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold mb-4">
            3
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Simulate Submission</h3>
          <p className="text-sm text-neutral-500">
            Review the summarized grievance layout and send a simulated claim file directly to our EPFO test engine.
          </p>
        </Card>
      </section>

      {/* Developer Diagnostics card */}
      <section>
        <Card className="border-dashed border-2 border-neutral-300 bg-neutral-50/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary-500" />
                Developer Diagnostics (Phase 0)
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Verify if the frontend client has reached the FastAPI backend service.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkBackendHealth}
              disabled={healthStatus === 'loading'}
            >
              Test Backend Connection
            </Button>
          </div>

          {healthStatus !== 'idle' && (
            <div className="mt-4 p-3 rounded-lg border text-xs flex items-start gap-2 bg-white">
              {healthStatus === 'loading' && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
                  <span>Connecting to FastAPI backend...</span>
                </div>
              )}

              {healthStatus === 'success' && (
                <div className="flex items-center gap-2 text-accent-700">
                  <CheckCircle className="w-4 h-4 text-accent-600 shrink-0" />
                  <div>
                    <p className="font-semibold">Connection Successful</p>
                    <p className="text-neutral-500">{healthMessage}</p>
                  </div>
                </div>
              )}

              {healthStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-700">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <p className="font-semibold">Connection Failed</p>
                    <p className="text-neutral-500">{healthMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>

    </div>
  );
};
