import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSunoGov } from '../context/SunoGovContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Search, 
  ArrowRight,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { resetJourney, setRawInput, triggerMockAnalysis, setSubStep } = useSunoGov();

  const handleStartFresh = () => {
    resetJourney();
    navigate('/report');
  };

  const handleExploreGuidance = () => {
    navigate('/resources');
  };

  const handleScenarioClick = async (scenarioText: string) => {
    resetJourney();
    setRawInput(scenarioText);
    setSubStep('understanding');
    navigate('/report');
    await triggerMockAnalysis(scenarioText);
  };

  // Custom polished scenarios
  const demoScenarios = [
    {
      label: "PF Transfer Delay",
      text: "Mera PF transfer 3 mahine se pending hai.",
      badge: "Hinglish Grievance",
      desc: "See how SunoGov processes a delayed transfer complaint in simple mixed Hindi-English language.",
      icon: ArrowRightLeft
    },
    {
      label: "Marathi Transfer Issue",
      text: "माझा पीएफ ट्रान्सफर अजून झालेला नाही.",
      badge: "Marathi Grievance",
      desc: "See how SunoGov handles a PF transfer concern written in Marathi.",
      icon: MessageSquare
    },
    {
      label: "PF Withdrawal Query",
      text: "Medical emergency ke liye PF kaise withdraw kar sakta hoon?",
      badge: "Info Request",
      desc: "See how SunoGov identifies general questions and redirects to helpful guides.",
      icon: BookOpen
    },
    {
      label: "Track Existing Ticket",
      text: "Meri grievance ka status check karna hai.",
      badge: "Status Check",
      desc: "See how SunoGov helps track a previously filed ticket.",
      icon: Search
    },
    {
      label: "General Help Request",
      text: "Help me with my PF.",
      badge: "Clarification Demo",
      desc: "See how SunoGov prompts for more details when a query is too general.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4 px-4 sm:px-0">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-semibold text-primary-700">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
          Independent Prototype • Synthetic Data Only
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight font-sans">
          Need help with your PF?
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Explain what happened in your own words. SunoGov helps you understand your issue, find the right guidance, and prepare a simulated grievance when needed.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleStartFresh}
            className="w-full sm:w-auto px-8 font-semibold shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Start a request
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleExploreGuidance}
            className="w-full sm:w-auto px-8 border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Explore guidance
          </Button>
        </div>

        {/* Interactive Visual Journey Diagram */}
        <div className="pt-6 hidden sm:block">
          <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-lg border border-neutral-200 shadow-sm text-xs font-medium text-neutral-500">
            <span className="text-primary-700 font-bold">1. Explain Problem</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-primary-700 font-bold">2. AI Understands</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-primary-700 font-bold">3. Get Guidance</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-primary-700 font-bold">4. Take Action</span>
          </div>
        </div>
      </section>

      {/* How SunoGov Helps Section */}
      <section className="border-t border-neutral-200 pt-8 space-y-6">
        <h2 className="text-lg font-bold text-neutral-900 text-center">How SunoGov works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padded className="bg-white border-neutral-200">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-800">Tell us what happened</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Explain your PF problem in normal language.
                </p>
              </div>
            </div>
          </Card>

          <Card padded className="bg-white border-neutral-200">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-800">We understand it</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  AI identifies the type of help you need.
                </p>
              </div>
            </div>
          </Card>

          <Card padded className="bg-white border-neutral-200">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-800">Get guidance</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  We direct you to resources or simulated grievances.
                </p>
              </div>
            </div>
          </Card>

          <Card padded className="bg-white border-neutral-200">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-800">Track status</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Track simulated submissions from one place.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Polish Demo Mode Scenarios Panel */}
      <section id="demo-scenarios" className="border-t border-neutral-200 pt-8 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-neutral-900">Try SunoGov</h2>
          <p className="text-xs text-neutral-500">
            Explore a few common PF situations. Each represents an interactive demo example.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {demoScenarios.map((sc, idx) => {
            const IconComponent = sc.icon;
            return (
              <Card 
                key={idx} 
                padded 
                className="bg-white border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      {sc.badge}
                    </span>
                    <IconComponent className="w-4 h-4 text-neutral-400" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-800">{sc.label}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {sc.desc}
                    </p>
                  </div>
                  
                  <div className="bg-neutral-50 rounded p-2 text-[10px] text-neutral-400 font-mono italic truncate">
                    "{sc.text}"
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
                  <button
                    onClick={() => handleScenarioClick(sc.text)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors focus:outline-none focus:underline"
                  >
                    Try this example
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
};
