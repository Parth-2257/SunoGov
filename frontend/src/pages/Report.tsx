import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Mic, 
  Send, 
  Globe, 
  Loader2, 
  AlertCircle, 
  StopCircle, 
  Bot, 
  User, 
  Edit2, 
  HelpCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { SpeechService, SpeechState } from '../services/speech';
import { ChatMessage } from '../types';
import { apiService } from '../services/api';

// Helper to normalize and interpret affirmative/negative replies deterministically
import { interpretSemanticAnswer } from '../utils/interpreter';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const {
    rawInput,
    setRawInput,
    setUan,
    analysis,
    triggerMockAnalysis,
    isAnalyzing,
    resetJourney,
    analysisError,
    setRefId,
    
    // Conversation states from context
    messages,
    setMessages,
    setCollectedFields,
    currentQuestionIndex,
    setCurrentQuestionIndex
  } = useSunoGov();

  const [composerText, setComposerText] = useState('');
  const [isAskingOptionalYesNo, setIsAskingOptionalYesNo] = useState(false);
  const [isWaitingForFieldValue, setIsWaitingForFieldValue] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeQuickReplyId, setActiveQuickReplyId] = useState<string | null>(null);
  const [uanHelpOpen, setUanHelpOpen] = useState(false);
  
  // Speech states
  const [speechState, setSpeechState] = useState<SpeechState>('IDLE');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechServiceInstance, setSpeechServiceInstance] = useState<SpeechService | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('en-IN');
  const [duration, setDuration] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Format record timer duration
  const formatDuration = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Microphone toggle handler
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
          setComposerText(text);
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

  // Cancel voice recording
  const handleCancelSpeech = () => {
    if (speechServiceInstance) {
      speechServiceInstance.stopListening();
    }
    setSpeechState('IDLE');
    setLiveTranscript('');
    setSpeechError(null);
  };

  // Initialize conversation greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'init-' + Date.now(),
        sender: 'assistant',
        text: "Hello! Tell me what happened. You can type or speak in English, Hindi, or Marathi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      if (rawInput) {
        // Came from scenario selection
        const userMsg: ChatMessage = {
          id: 'user-scenario-' + Date.now(),
          sender: 'user',
          text: rawInput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([greeting, userMsg]);
      } else {
        setMessages([greeting]);
      }
    }
  }, [messages, rawInput, setMessages]);

  // Handle classification response mapping
  useEffect(() => {
    if (!analysis || isAnalyzing) return;

    // Check if we already appended confirmation message
    const hasConfirm = messages.some(m => m.type === 'confirm_understanding');
    if (!hasConfirm) {
      const confirmMsg: ChatMessage = {
        id: 'confirm-' + Date.now(),
        sender: 'assistant',
        text: "Here's what I understood. Please review this summary before we proceed.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'confirm_understanding'
      };
      setMessages(prev => [...prev, confirmMsg]);
    }
  }, [analysis, isAnalyzing, messages, setMessages]);

  // Ask question for current missing field index
  const askQuestionForIndex = (idx: number, currentAnalysis = analysis) => {
    const fields = currentAnalysis?.missing_fields || [];
    
    if (idx >= fields.length) {
      // All parameters collected successfully
      const reviewMsgId = 'finish-' + Date.now();
      const reviewMsg: ChatMessage = {
        id: reviewMsgId,
        sender: 'assistant',
        text: "Thank you. I have collected all the details needed to prepare your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'quick_reply',
        options: ['Review request']
      };
      setActiveQuickReplyId(reviewMsgId);
      setMessages(prev => [...prev, reviewMsg]);
      return;
    }

    const nextField = fields[idx];
    if (nextField.required === false) {
      setIsAskingOptionalYesNo(true);
      setIsWaitingForFieldValue(false);
      const yesNoId = 'yesno-' + Date.now();
      const yesNoMsg: ChatMessage = {
        id: yesNoId,
        sender: 'assistant',
        text: `Do you have a ${nextField.field_name.replace(/_/g, ' ')}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'quick_reply',
        options: ['Yes', 'No']
      };
      setActiveQuickReplyId(yesNoId);
      setMessages(prev => [...prev, yesNoMsg]);
    } else {
      setIsAskingOptionalYesNo(false);
      setIsWaitingForFieldValue(false);
      const askMsg: ChatMessage = {
        id: 'ask-' + Date.now(),
        sender: 'assistant',
        text: nextField.question || `To continue, I need your ${nextField.field_name.replace(/_/g, ' ')}. ${nextField.description}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, askMsg]);
    }
  };

  // Confirm understanding handler
  const handleConfirmUnderstanding = () => {
    if (!analysis || isProcessing) return;

    // Simulate user confirmation message
    const userConfirmMsg: ChatMessage = {
      id: 'user-confirm-' + Date.now(),
      sender: 'user',
      text: "Yes, that's correct.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userConfirmMsg]);

    const reqType = analysis.request_type;

    if (reqType === 'INFORMATION') {
      const infoMsgId = 'info-redirect-' + Date.now();
      const infoMsg: ChatMessage = {
        id: infoMsgId,
        sender: 'assistant',
        text: "Since this is an informational query, I will guide you to our official resources catalog.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'quick_reply',
        options: ['View resources guide']
      };
      setActiveQuickReplyId(infoMsgId);
      setMessages(prev => [...prev, infoMsg]);
    } else if (reqType === 'STATUS') {
      // Prompt for grievance tracking ID
      const statusMsg: ChatMessage = {
        id: 'status-prompt-' + Date.now(),
        sender: 'assistant',
        text: "Sure. Please enter your grievance reference ID.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, statusMsg]);
    } else if (reqType === 'UNKNOWN') {
      // Clarification prompt options
      const clarifyId = 'clarify-' + Date.now();
      const clarificationMsg: ChatMessage = {
        id: clarifyId,
        sender: 'assistant',
        text: "I want to make sure I understand your issue. What would you like help with?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'quick_reply',
        options: ['PF Transfer', 'PF Claim', 'Pension', 'Grievance Status', 'Something else']
      };
      setActiveQuickReplyId(clarifyId);
      setMessages(prev => [...prev, clarificationMsg]);
    } else {
      // GRIEVANCE: Ask missing fields
      setCurrentQuestionIndex(0);
      askQuestionForIndex(0);
    }
  };

  // Submit composer text input
  const handleSendText = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // Clear active quick replies
    setActiveQuickReplyId(null);
    setIsProcessing(true);

    // Add user message to history
    const userMsgId = 'user-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setComposerText('');

    // Case 1: Initial user query submission
    if (!analysis) {
      setRawInput(text);
      await triggerMockAnalysis(text);
      setIsProcessing(false);
      return;
    }

    const reqType = analysis.request_type;

    // Case 2: Status check flow
    if (reqType === 'STATUS') {
      const semanticAns = interpretSemanticAnswer(text);
      if (semanticAns === 'YES' || semanticAns === 'NO') {
        const errorMsg: ChatMessage = {
          id: 'status-error-' + Date.now(),
          sender: 'assistant',
          text: "Please enter your grievance reference ID to track your status.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsProcessing(false);
        return;
      }

      setRefId(text);
      const ackMsg: ChatMessage = {
        id: 'ack-status-' + Date.now(),
        sender: 'assistant',
        text: `Checking status for Reference ID: ${text}... Redirecting to tracker.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, ackMsg]);
      setTimeout(() => {
        navigate('/track');
      }, 1200);
      setIsProcessing(false);
      return;
    }

    // Case 3: Clarification fallback flow
    if (reqType === 'UNKNOWN') {
      setRawInput(text);
      await triggerMockAnalysis(text);
      setIsProcessing(false);
      return;
    }

    // Case 4: Grievance missing fields answering
    if (reqType === 'GRIEVANCE') {
      const fields = analysis.missing_fields;
      if (currentQuestionIndex >= 0 && currentQuestionIndex < fields.length) {
        const activeField = fields[currentQuestionIndex];
        
        // Handling optional Yes/No quick replies
        if (activeField.required === false && isAskingOptionalYesNo) {
          // Layered interpretation: Local check first
          let semanticAns = interpretSemanticAnswer(text);
          
          // Call OpenRouter if ambiguous
          if (semanticAns === 'AMBIGUOUS') {
            try {
              const response = await apiService.analyzeRequest(text, 'BOOLEAN');
              if (response.success && response.analysis) {
                const ans = response.analysis.summary.toUpperCase().trim();
                if (ans === 'YES' || ans === 'NO') {
                  semanticAns = ans as 'YES' | 'NO';
                }
              }
            } catch (err) {
              // Ignore error, keep ambiguous
            }
          }

          if (semanticAns === 'NO') {
            setIsAskingOptionalYesNo(false);
            setCollectedFields(prev => ({ ...prev, [activeField.field_name]: 'Not provided' }));
            const nextIdx = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIdx);
            askQuestionForIndex(nextIdx);
          } else if (semanticAns === 'YES') {
            setIsAskingOptionalYesNo(false);
            setIsWaitingForFieldValue(true); // Now wait for the value
            const promptValueMsg: ChatMessage = {
              id: 'prompt-val-' + Date.now(),
              sender: 'assistant',
              text: activeField.question || `Please enter the ${activeField.field_name.replace(/_/g, ' ')}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, promptValueMsg]);
          } else {
            // Still ambiguous: repeat question
            const repeatId = 'repeat-' + Date.now();
            const repeatMsg: ChatMessage = {
              id: repeatId,
              sender: 'assistant',
              text: `I want to make sure I understood. Do you have a ${activeField.field_name.replace(/_/g, ' ')}?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'quick_reply',
              options: ['Yes', 'No']
            };
            setActiveQuickReplyId(repeatId);
            setMessages(prev => [...prev, repeatMsg]);
          }
          setIsProcessing(false);
          return;
        }

        // Validate values (UAN or REFERENCE_ID)
        const semanticAns = interpretSemanticAnswer(text);
        if ((isWaitingForFieldValue || activeField.required) && (semanticAns === 'YES' || semanticAns === 'NO')) {
          const rejectMsg: ChatMessage = {
            id: 'reject-' + Date.now(),
            sender: 'assistant',
            text: `Please enter the actual value for your ${activeField.field_name.replace(/_/g, ' ')}, not "yes" or "no".`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, rejectMsg]);
          setIsProcessing(false);
          return;
        }

        // Specifically set the UAN parameter globally
        if (activeField.field_name === 'uan') {
          if (text.trim().length < 3) {
            const errorMsg: ChatMessage = {
              id: 'uan-error-' + Date.now(),
              sender: 'assistant',
              text: "Please enter a valid mock UAN value (e.g. DEMO-1234).",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsProcessing(false);
            return;
          }
          setUan(text);
        }

        // Store value
        setCollectedFields(prev => ({ ...prev, [activeField.field_name]: text }));
        setIsWaitingForFieldValue(false);

        // Move to next question
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        askQuestionForIndex(nextIdx);
      }
    }

    setIsProcessing(false);
  };

  // Quick reply option clicks
  const handleQuickReplyClick = (option: string) => {
    if (isProcessing) return;

    // 1. Direct Page Navigations
    if (option === 'Review request') {
      navigate('/review');
      return;
    }
    if (option === 'View resources guide' && analysis) {
      navigate('/resources', { state: { intent: analysis.intent.name } });
      return;
    }

    // 2. Intent Clarification Fallbacks
    if (option === 'PF Transfer') {
      handleSendText("I need help with my PF transfer");
      return;
    }
    if (option === 'PF Claim') {
      handleSendText("I need help with my PF claim");
      return;
    }
    if (option === 'Pension') {
      handleSendText("I have pension payout issues");
      return;
    }
    if (option === 'Grievance Status') {
      handleSendText("Check my grievance status");
      return;
    }
    if (option === 'Something else') {
      const askAgainMsg: ChatMessage = {
        id: 'ask-again-' + Date.now(),
        sender: 'assistant',
        text: "Please describe your issue in a different way so I can understand.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, askAgainMsg]);
      return;
    }

    // 3. Regular flow responses
    handleSendText(option);
  };

  // Clear states to edit initial query
  const handleEditOriginalQuery = () => {
    resetJourney();
  };

  // Compute active question progress step
  const getSubstepProgress = () => {
    if (!analysis) return "Explain ● Details ○ Review ○";
    if (analysis.request_type === 'INFORMATION' || analysis.request_type === 'STATUS' || analysis.request_type === 'UNKNOWN') {
      return "Explain ✓ Details ● Review ○";
    }
    if (currentQuestionIndex >= analysis.missing_fields.length) {
      return "Explain ✓ Details ✓ Review ●";
    }
    return `Details (Question ${currentQuestionIndex + 1} of ${analysis.missing_fields.length})`;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Top Banner Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
            SG
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-800">SunoGov Assistant</h3>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase">Personalized guidance</p>
          </div>
        </div>

        {/* Header step progress */}
        <span className="text-xs text-neutral-500 font-bold bg-neutral-200/60 px-2.5 py-1 rounded">
          {getSubstepProgress()}
        </span>
      </div>

      {/* Messages Thread list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Profile Avatar Icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                msg.sender === 'user' 
                  ? 'bg-primary-50 border-primary-100 text-primary-600' 
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600'
              }`}>
                {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              {/* Message Content Bubble wrapper */}
              <div className="space-y-1.5">
                <div className={`rounded-xl p-3.5 text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Confirm Understanding Card node */}
                {msg.type === 'confirm_understanding' && analysis && (
                  <Card className="bg-white border-neutral-200 shadow-sm p-4 space-y-4 max-w-md">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Your Issue</span>
                      <p className="text-base font-bold text-neutral-900 leading-snug">{analysis.summary}</p>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">What you told us</span>
                      <p className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50 p-2.5 rounded">"{rawInput}"</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleEditOriginalQuery}
                        className="flex-1 gap-1 border-neutral-300 font-bold text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleConfirmUnderstanding}
                        className="flex-1 font-bold text-xs shadow-sm"
                      >
                        Confirm
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Show Why We Ask block for UAN input question */}
                {msg.sender === 'assistant' && analysis && 
                 analysis.missing_fields[currentQuestionIndex]?.field_name === 'uan' && 
                 msg.text.includes('UAN') && (
                  <div className="mt-1 max-w-sm rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                    <button
                      type="button"
                      onClick={() => setUanHelpOpen(!uanHelpOpen)}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] text-neutral-500 hover:text-neutral-800 font-semibold focus:outline-none"
                    >
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-primary-500" />
                        Why do we ask for UAN?
                      </span>
                      {uanHelpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {uanHelpOpen && (
                      <div className="px-3 pb-3 pt-0.5 text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-100 bg-white">
                        We ask for this universal identifier only to simulate locating your EPFO account records in this prototype environment. <strong>Do NOT enter real credentials.</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Reply Selection Buttons (only for active question, disabled if processing) */}
                {msg.type === 'quick_reply' && msg.options && msg.id === activeQuickReplyId && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        disabled={isProcessing}
                        onClick={() => handleQuickReplyClick(opt)}
                        className="px-4 py-1.5 rounded-full bg-white border border-primary-200 hover:bg-primary-50 disabled:bg-neutral-100 disabled:text-neutral-400 text-xs font-bold text-primary-600 transition-colors shadow-sm focus:ring-2 focus:ring-primary-500"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-neutral-400 block px-1 mt-1 font-medium">{msg.timestamp}</span>
              </div>

            </div>
          </div>
        ))}

        {/* Loading/Inference Spinner bubble */}
        {(isAnalyzing || isProcessing) && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-neutral-100 rounded-xl p-3 text-xs font-bold text-neutral-500 animate-pulse">
                Understanding your response…
              </div>
            </div>
          </div>
        )}

        {/* Error notification bubble */}
        {analysisError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs space-y-2.5 max-w-md mx-auto">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span>Connection Issue</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              We couldn't process that right now. Please try again.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => triggerMockAnalysis(rawInput)}
              className="text-[10px] font-bold border-red-200 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1"
            >
              Try Again
            </Button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Speech UX overlay timer block */}
      {speechState !== 'IDLE' && (
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${speechState === 'LISTENING' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-100 text-primary-600'}`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-neutral-800">
                  {speechState === 'LISTENING' ? 'Listening...' : speechState === 'ERROR' ? 'Voice Error' : 'Transcribing voice...'}
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  {selectedLang === 'en-IN' ? 'English (India)' : selectedLang === 'hi-IN' ? 'Hindi' : 'Marathi'} • {formatDuration(duration)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {speechState === 'LISTENING' && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleMicClick}
                  className="bg-red-500 hover:bg-red-600 border-red-600 text-xs font-bold px-3 py-1"
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1" />
                  Stop
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelSpeech}
                className="border-neutral-300 text-xs font-bold px-3 py-1"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Transcript Preview */}
          {liveTranscript && (
            <div className="bg-white border border-neutral-200 rounded p-2 text-xs italic text-neutral-600">
              "{liveTranscript}"
            </div>
          )}

          {/* Speech Error Banner */}
          {speechState === 'ERROR' && speechError && (
            <div className="bg-red-50 text-red-700 text-xs rounded p-2 font-medium">
              {speechError}
            </div>
          )}
        </div>
      )}

      {/* Composer Input Footer Form */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-3 space-y-2">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText(composerText);
          }}
          className="flex items-center gap-2.5"
        >
          {/* Free-form text input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={composerText}
              disabled={isAnalyzing || isProcessing || speechState === 'LISTENING' || speechState === 'TRANSCRIBING'}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder={(isAnalyzing || isProcessing) ? "Processing..." : "Type your message..."}
              className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-100"
            />
          </div>

          {/* Microphone button trigger */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isAnalyzing || isProcessing || speechState === 'TRANSCRIBING'}
            className={`p-2.5 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              speechState === 'LISTENING' 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
            }`}
            aria-label="Toggle voice input microphone"
          >
            {speechState === 'LISTENING' ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send text button */}
          <button
            type="submit"
            disabled={!composerText.trim() || isAnalyzing || isProcessing || speechState === 'LISTENING'}
            className="p-2.5 rounded-lg bg-primary-600 border border-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-300 disabled:border-neutral-300 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:outline-none"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Language selector for speech service */}
        {(speechState === 'IDLE' || speechState === 'ERROR') && (
          <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1 pt-1 select-none">
            <span className="flex items-center gap-1 font-semibold text-neutral-400">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              Speaking language:
            </span>
            <div className="flex gap-2 font-bold">
              <button
                type="button"
                onClick={() => setSelectedLang('en-IN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedLang === 'en-IN' ? 'bg-primary-100 text-primary-700' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hi-IN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedLang === 'hi-IN' ? 'bg-primary-100 text-primary-700' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Hindi
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('mr-IN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedLang === 'mr-IN' ? 'bg-primary-100 text-primary-700' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Marathi
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
