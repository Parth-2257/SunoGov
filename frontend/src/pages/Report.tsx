import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mic, CheckCircle2, ChevronRight, Edit2, Info, Loader2, AlertCircle, Globe, StopCircle, RefreshCw, Trash2 } from 'lucide-react';
import { SpeechService, SpeechState } from '../services/speech';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const {
    rawInput,
    setRawInput,
    subStep,
    setSubStep,
    uan,
    setUan,
    analysis,
    triggerMockAnalysis,
    isAnalyzing,
    resetJourney
  } = useSunoGov();

  const [uanError, setUanError] = useState('');

  // Speech states
  const [speechState, setSpeechState] = useState<SpeechState>('IDLE');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechServiceInstance, setSpeechServiceInstance] = useState<SpeechService | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('en-IN');
  const [duration, setDuration] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  const formatDuration = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMicClick = () => {
    setSpeechError(null);
    setLiveTranscript('');
    setDuration(0);

    if (speechState === 'IDLE' || speechState === 'ERROR') {
      const service = new SpeechService({
        onStateChange: (state) => {
          setSpeechState(state);
        },
        onTranscript: (text) => {
          setLiveTranscript(text);
          setRawInput(text);
        },
        onError: (err) => {
          setSpeechState('ERROR');
          setSpeechError(err);
        },
        onDurationChange: (sec) => {
          setDuration(sec);
        }
      }, selectedLang);

      setSpeechServiceInstance(service);
      service.startListening();
    } else {
      if (speechServiceInstance) {
        speechServiceInstance.stopListening();
      }
      setSpeechState('IDLE');
    }
  };

  const handleCancelSpeech = () => {
    if (speechServiceInstance) {
      speechServiceInstance.stopListening();
    }
    setSpeechState('IDLE');
    setLiveTranscript('');
    setRawInput('');
    setSpeechError(null);
  };

  // ----------------------------------------
  // Helper / Handlers
  // ----------------------------------------
  
  const handleChipClick = async (scenarioText: string) => {
    if (isAnalyzing) return;
    setRawInput(scenarioText);
    await triggerMockAnalysis(scenarioText);
    setSubStep('understanding');
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim() || isAnalyzing) return;
    
    await triggerMockAnalysis(rawInput);
    setSubStep('understanding');
  };

  const handleConfirmUnderstanding = () => {
    setSubStep('info');
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uan.trim()) {
      setUanError('Please enter a mock UAN value.');
      return;
    }
    setUanError('');
    setSubStep('readiness');
  };

  const handleContinueToReview = () => {
    navigate('/review');
  };

  // Demo chips data
  const demoChips = [
    { label: 'PF transfer pending', text: 'Mera PF transfer 3 mahine se pending hai.' },
    { label: 'PF claim rejected', text: 'Mera PF claim reject ho gaya.' },
    { label: 'Pension payment issue', text: 'Mera pension payment issue hai.' },
    { label: 'Check grievance status', text: 'Grievance status check karna hai.' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Progress Tracker (Sub-steps) */}
      <div className="flex justify-between items-center px-2 text-xs text-neutral-400 font-semibold select-none border-b border-neutral-100 pb-3">
        <span className={subStep === 'input' ? 'text-primary-600 font-bold' : ''}>1. Explain Problem</span>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span className={subStep === 'understanding' ? 'text-primary-600 font-bold' : ''}>2. Understanding</span>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span className={subStep === 'info' ? 'text-primary-600 font-bold' : ''}>3. Required Details</span>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span className={subStep === 'readiness' ? 'text-primary-600 font-bold' : ''}>4. Readiness</span>
      </div>

      {/* ==========================================
          STEP 1: PROBLEM INPUT
         ========================================== */}
      {subStep === 'input' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900">What happened?</h2>
            <p className="text-sm text-neutral-500 mt-1.5">
              Explain your problem in your own words. You don't need to know the EPFO terminology.
            </p>
          </div>

          <Card>
            <form onSubmit={handleInputSubmit} className="space-y-5">
              {/* Language Selector (Only when IDLE or ERROR) */}
              {(speechState === 'IDLE' || speechState === 'ERROR') && (
                <div className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary-500" />
                    Speak in:
                  </span>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs focus:ring-primary-500 focus:border-primary-500 font-medium cursor-pointer"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="mr-IN">Marathi (मराठी)</option>
                  </select>
                </div>
              )}

              {/* Speech Recording UX Panel */}
              {speechState !== 'IDLE' && speechState !== 'ERROR' ? (
                <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50/50 flex flex-col items-center justify-center space-y-4 text-center min-h-[180px]">
                  {/* Timer & Pulsing Mic */}
                  <div className="flex items-center gap-3">
                    <div className={`p-4 rounded-full ${speechState === 'LISTENING' ? 'bg-red-500 text-white animate-pulse shadow' : 'bg-primary-100 text-primary-600'}`}>
                      {speechState === 'TRANSCRIBING' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </div>
                    {speechState === 'LISTENING' && (
                      <span className="text-xl font-mono font-bold text-neutral-700">
                        {formatDuration(duration)}
                      </span>
                    )}
                  </div>

                  {/* Status Text */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-800">
                      {speechState === 'LISTENING' && 'Listening... Start speaking now'}
                      {speechState === 'TRANSCRIBING' && 'Transcribing your voice...'}
                      {speechState === 'READY' && 'Done transcribing!'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Speaking language: {selectedLang === 'en-IN' ? 'English' : selectedLang === 'hi-IN' ? 'Hindi' : 'Marathi'}
                    </p>
                  </div>

                  {/* Live Transcript Preview */}
                  {liveTranscript && (
                    <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg p-3 text-sm text-neutral-600 italic leading-relaxed text-left max-h-[80px] overflow-y-auto shadow-inner">
                      "{liveTranscript}"
                    </div>
                  )}

                  {/* Stop / Cancel Controls */}
                  <div className="flex items-center gap-3">
                    {speechState === 'LISTENING' && (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleMicClick}
                        className="gap-1.5 text-xs font-semibold px-4 py-2 bg-red-500 hover:bg-red-600 border-red-600"
                      >
                        <StopCircle className="w-4 h-4" />
                        Stop Recording
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelSpeech}
                      className="text-xs font-semibold px-4 py-2 border-neutral-300 hover:bg-neutral-50 text-neutral-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* Textarea Form Layout */
                <div className="relative">
                  <label htmlFor="problem-description" className="sr-only">Explain your problem</label>
                  <textarea
                    id="problem-description"
                    rows={6}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[140px]"
                    placeholder="Example: Mera PF transfer 3 mahine se pending hai."
                  ></textarea>
                  
                  {/* Mic Button overlay */}
                  <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      aria-label="Start voice input"
                      className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Speech Error Banner with Retry/Clear triggers */}
              {speechError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                    <span>Voice Input Failed</span>
                  </div>
                  <p className="text-neutral-600 font-medium">{speechError}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelSpeech}
                      className="inline-flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={!rawInput.trim() || isAnalyzing || speechState !== 'IDLE'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Scenario chips */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Try a demo scenario</h3>
            <div className="flex flex-wrap gap-2.5">
              {demoChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChipClick(chip.text)}
                  className={`
                    px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${rawInput === chip.text 
                      ? 'bg-primary-500 border-primary-500 text-white shadow-sm' 
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                    }
                  `}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 2: UNDERSTANDING
         ========================================== */}
      {subStep === 'understanding' && analysis && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900">Here's what we understood</h2>
            <p className="text-sm text-neutral-500 mt-1.5">
              We used AI to understand your request. Please check that we've got it right.
            </p>
          </div>

          <Card className="divide-y divide-neutral-100">
            <div className="pb-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Your Issue</span>
              <p className="text-lg font-bold text-neutral-900">
                {analysis.summary}
              </p>
            </div>

            <div className="py-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">What you told us</span>
              <p className="text-sm text-neutral-600 leading-relaxed">
                "{rawInput}"
              </p>
            </div>

            <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setSubStep('input')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-neutral-700 focus:outline-none"
              >
                <Edit2 className="w-4 h-4" />
                Need to change something?
              </button>

              <Button 
                variant="primary" 
                onClick={handleConfirmUnderstanding}
                className="w-full sm:w-auto"
              >
                Confirm
              </Button>
            </div>
          </Card>

          <div className="p-3 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-lg text-xs flex items-center gap-2">
            <Info className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
            <p className="font-semibold text-neutral-700">
              AI-generated understanding • Please review before continuing.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 3: REQUIRED INFORMATION
         ========================================== */}
      {subStep === 'info' && analysis && (
        <div className="space-y-6">
          {analysis.request_type === 'INFORMATION' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">Information Resources</h2>
                <p className="text-sm text-neutral-500 mt-1.5">
                  Your query has been classified as informational.
                </p>
              </div>
              <Card className="space-y-5">
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 text-sm text-primary-800 leading-relaxed">
                  <p className="font-bold">No Grievance Required</p>
                  <p className="mt-1">
                    Formal grievances are for resolving service failures (e.g. transfer delays, claim rejections). Since your query is seeking general information, we recommend exploring our verified guidelines catalog.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto"
                  >
                    Back to home
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/resources', { state: { intent: analysis.intent.name } })}
                    className="w-full sm:w-auto"
                  >
                    View resources guide
                  </Button>
                </div>
              </Card>
            </div>
          ) : analysis.request_type === 'STATUS' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">Track Grievance Status</h2>
                <p className="text-sm text-neutral-500 mt-1.5">
                  You are inquiring about the status of a filed ticket.
                </p>
              </div>
              <Card className="space-y-5">
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 text-sm text-primary-800 leading-relaxed">
                  <p className="font-bold">Status Inquiry Classification</p>
                  <p className="mt-1">
                    If you already have a grievance reference number, you can check its live progress timeline immediately from our tracking dashboard page.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto"
                  >
                    Back to home
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      resetJourney();
                      navigate('/');
                    }}
                    className="w-full sm:w-auto"
                  >
                    Go to tracking
                  </Button>
                </div>
              </Card>
            </div>
          ) : analysis.request_type === 'UNKNOWN' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">Clarification Needed</h2>
                <p className="text-sm text-neutral-500 mt-1.5">
                  We could not determine the type of your request.
                </p>
              </div>
              <Card className="space-y-5">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-sm text-red-800 leading-relaxed">
                  <p className="font-bold">Clarification Notice</p>
                  <p className="mt-1">
                    The query analysis was unable to identify a clear EPFO category. Please try re-explaining the issue with alternative keywords (e.g. mention "transfer", "claim", or "pension") or provide more context.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto"
                  >
                    Back to home
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSubStep('input');
                    }}
                    className="w-full sm:w-auto"
                  >
                    Explain again
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">We need one thing from you</h2>
                <p className="text-sm text-neutral-500 mt-1.5">
                  Provide the missing detail identified below to complete your simulated filing.
                </p>
              </div>

              <Card>
                <form onSubmit={handleInfoSubmit} className="space-y-6">
                  
                  {/* Field Label & Explanation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Missing Detail: UAN</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-100">Required</span>
                    </div>
                    
                    {/* Explain why we ask */}
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <h4 className="text-xs font-bold text-primary-800 uppercase tracking-wide">Why do we ask?</h4>
                      <p className="text-xs text-primary-700 mt-1 leading-relaxed">
                        {analysis.missing_fields[0]?.description || 'We need it to identify the PF record related to your grievance.'}
                      </p>
                    </div>
                  </div>

                  {/* UAN Input */}
                  <Input
                    label="Enter UAN Number"
                    placeholder="DEMO-123456"
                    value={uan}
                    error={uanError}
                    onChange={(e) => {
                      setUan(e.target.value);
                      if (e.target.value.trim()) setUanError('');
                    }}
                    helperText="For this prototype, use demo information only. Do not input your actual EPFO credentials."
                  />

                  {/* Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setSubStep('understanding')}
                      className="text-sm font-semibold text-neutral-500 hover:text-neutral-700 focus:outline-none"
                    >
                      ← Back
                    </button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full sm:w-auto"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          STEP 4: READINESS CHECK
         ========================================== */}
      {subStep === 'readiness' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900">You're almost ready</h2>
            <p className="text-sm text-neutral-500 mt-1.5">
              Confirm the checklist is fully complete to proceed to review.
            </p>
          </div>

          <Card className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-neutral-700 font-medium">Problem understood</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-neutral-700 font-medium">Request type identified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-neutral-700 font-medium">Category selected</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-neutral-700 font-medium">Required information provided</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-neutral-700 font-medium">Grievance description ready</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-5 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSubStep('info')}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-700 focus:outline-none"
              >
                ← Back
              </button>
              <Button 
                variant="primary" 
                onClick={handleContinueToReview}
                className="w-full sm:w-auto"
              >
                Ready to review
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
