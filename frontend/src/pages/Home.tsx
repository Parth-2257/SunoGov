import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MessageSquareText, ShieldAlert, Play } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { resetJourney, setRawInput, triggerMockAnalysis, setSubStep } = useSunoGov();

  const handleStartFresh = () => {
    resetJourney();
    navigate('/report');
  };

  const handleScenarioClick = async (scenarioText: string) => {
    resetJourney();
    setRawInput(scenarioText);
    setSubStep('understanding');
    navigate('/report');
    await triggerMockAnalysis(scenarioText);
  };

  const demoScenarios = [
    {
      label: "Hinglish PF Transfer Delay",
      text: "Mera PF transfer 3 mahine se pending hai.",
      badge: "Grievance Flow",
      desc: "Simulate filing a stuck transfer complaint in mixed Hindi-English dialect."
    },
    {
      label: "Marathi Transfer Pending",
      text: "माझा पीएफ ट्रान्सफर अजून झालेला नाही.",
      badge: "Marathi Grievance",
      desc: "Simulate filing a transfer stuck grievance written in Marathi."
    },
    {
      label: "PF Withdrawal Inquiry",
      text: "Medical emergency ke liye PF kaise withdraw kar sakta hoon?",
      badge: "Info Routing",
      desc: "Classifies as information query and routes the user to guidance resources."
    },
    {
      label: "Grievance Status Check",
      text: "Meri grievance ka status check karna hai.",
      badge: "Status Check",
      desc: "Simulate retrieving ticket tracking details."
    },
    {
      label: "General Ambiguous Query",
      text: "Help me with my PF.",
      badge: "Clarification Flow",
      desc: "Triggers low-confidence fallback to demonstrate the clarification prompt UI."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 px-4 sm:px-0">
      
      {/* Hero Section */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-semibold text-primary-700">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
          Prototype • Synthetic data only
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Something went wrong <br className="hidden sm:inline" />with your PF?
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Tell us what happened. Not what form to fill. SunoGov is an independent, citizen-first prototype that simplifies EPFO access.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleStartFresh}
            className="w-full sm:w-auto px-8 font-semibold shadow focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Start Fresh request
          </Button>
          <a 
            href="#demo-scenarios"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm bg-white"
          >
            Explore scenarios
          </a>
        </div>
      </section>

      {/* Core Principle Explainer */}
      <section className="border-t border-neutral-200 pt-6">
        <Card className="bg-white border-neutral-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-50 rounded-lg text-primary-600 shrink-0">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-neutral-900">How SunoGov helps you</h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Explain your problem in simple language. SunoGov will analyze your request using AI, retrieve missing parameters, and guide you to resource centers or simulated grievance submissions.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Demo Mode Curated Scenarios Panel */}
      <section id="demo-scenarios" className="border-t border-neutral-200 pt-6 space-y-4Scroll">
        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-1.5">
            <Play className="w-5 h-5 text-primary-500" />
            Demo Mode Scenarios
          </h2>
          <p className="text-xs text-neutral-500">
            Select one of these curated scenarios to test different dynamic user-flow paths.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {demoScenarios.map((sc, idx) => (
            <Card 
              key={idx} 
              padded 
              className="hover:border-primary-300 hover:bg-primary-50/10 cursor-pointer transition-all border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full">
                    {sc.badge}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400">"{sc.text}"</span>
                </div>
                <h3 className="text-sm font-bold text-neutral-800">{sc.label}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{sc.desc}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleScenarioClick(sc.text)}
                className="w-full sm:w-auto gap-1 border-neutral-300 font-bold text-xs"
              >
                Run Scenario
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Prototype Warning Banner */}
      <section className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl flex gap-3 text-yellow-800">
        <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Important Disclaimer:</strong> SunoGov is an independent public-service accessibility prototype. It is NOT connected to real EPFO databases, live government portals, or official services. All submissions andpassbook claims run strictly in mock simulation mode.
        </p>
      </section>

    </div>
  );
};
