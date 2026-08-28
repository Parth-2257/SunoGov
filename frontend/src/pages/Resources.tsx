import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/api';
import { ResourceItem } from '../types';

// Fallback resources in case API is offline
const FALLBACK_RESOURCES: ResourceItem[] = [
  {
    id: "guidance-pf-withdrawal",
    title: "General PF Withdrawal Guidance",
    description: "Information on withdrawing PF advances or full settlements.",
    category: "Withdrawal",
    link: "https://www.epfindia.gov.in/",
    what_it_means: "PF Withdrawal allows members to withdraw their accumulated EPF balance either partially (advance) during service or fully after retirement/unemployment.",
    what_you_need: [
      "Active UAN (Universal Account Number)",
      "Aadhaar card linked to your UAN",
      "Bank account number linked to your UAN (with IFSC code)",
      "Mobile number registered with Aadhaar"
    ],
    what_to_do: [
      "Ensure your KYC details are completely updated on the Unified Member Portal.",
      "Log in to the Member Portal using your UAN and Password.",
      "Go to 'Online Services' and select 'Claim (Form-31, 19, 10C & 10D)'.",
      "Verify your bank account digits, click 'Yes', and select your claim type."
    ],
    when_to_file_grievance: "File a grievance if your withdrawal claim is rejected without a clear explanation, remains pending for more than 20 days, or fails to get disbursed to your bank account after status shows settled."
  },
  {
    id: "guidance-pf-transfer",
    title: "PF Account Transfer Guidance",
    description: "How to transfer your EPF balance from a previous employer to a new one.",
    category: "Transfer",
    link: "https://www.epfindia.gov.in/",
    what_it_means: "PF Transfer consolidates your previous EPF accumulations into your current member ID, keeping your service continuous and maximizing your interest benefits.",
    what_you_need: [
      "Active UAN registered on Member Portal",
      "Correct and matching personal details across old and new employers",
      "Approved Aadhaar and Bank KYC details",
      "Approved digital signature registration by the current or previous employer"
    ],
    what_to_do: [
      "Log into the EPFO Unified Member Portal.",
      "Navigate to 'Online Services' and choose 'One Member - One EPF Account (Transfer Request)'.",
      "Input your previous member ID/UAN, and click 'Get Details'.",
      "Choose either your previous or current employer for claim attestation, get OTP, and submit."
    ],
    when_to_file_grievance: "File a grievance if your transfer request remains stuck with the employer for more than 15 days, or if the transfer is approved but the balance does not reflect in your current passbook after 20 days."
  },
  {
    id: "guidance-pension",
    title: "EPS Pension & Pension Claims",
    description: "Understand your eligibility and payouts under the Employees' Pension Scheme.",
    category: "Pension",
    link: "https://www.epfindia.gov.in/",
    what_it_means: "EPS-95 provides a regular monthly pension benefit to EPF members who complete a minimum of 10 years of eligible service and reach the age of 58 (or early pension at 50).",
    what_you_need: [
      "Form 10D for monthly pension claims",
      "Scheme Certificate (Form 10C) if leaving service before pension eligibility",
      "Joint bank account linked with Aadhaar",
      "Service records showing cumulative eligible service"
    ],
    what_to_do: [
      "Ensure your composite profile matches your Aadhaar record.",
      "Submit Form 10D online or via your employer on the Member Portal upon completing 10 years of service and reaching age 58.",
      "Alternatively, apply for a Scheme Certificate using Form 10C to retain your pension service credits."
    ],
    when_to_file_grievance: "File a grievance if your pension payout has not been received, your Form 10D claim gets rejected unfairly, or your monthly pension rate is calculated incorrectly."
  },
  {
    id: "guidance-claims",
    title: "EPFO Claim-related Guidance",
    description: "Best practices for submitting composite online claim files.",
    category: "Claim Guidance",
    link: "https://www.epfindia.gov.in/",
    what_it_means: "EPFO Claims process settlements for withdrawal, advances, and pension withdrawals through automated passbook verification routines.",
    what_you_need: [
      "Aadhaar-linked active mobile number",
      "Updated bank account passbook copy (showing name, account number, and IFSC)",
      "Form 15G/15H (if claiming PF before 5 years of service to avoid TDS)"
    ],
    what_to_do: [
      "Before applying, check your EPF passbook balance online.",
      "Select the correct Composite Claim Form on the Portal (Form-19 for PF, Form-10C for withdrawal benefit, Form-31 for advances).",
      "Upload a clear scanned copy of your checkbook/passbook (PDF/JPEG between 100kb and 500kb)."
    ],
    when_to_file_grievance: "File a grievance if your claim shows 'Under Process' for more than 15 days or is rejected multiple times without specifying concrete rectification steps."
  },
  {
    id: "guidance-documents",
    title: "Required Documents Catalog",
    description: "General list of KYC and identity verification documents required by EPFO.",
    category: "Documents",
    link: "https://www.epfindia.gov.in/",
    what_it_means: "Standardized documentation ensures secure and verified digital transactions, preventing fraud and speeding up automated settlement approvals.",
    what_you_need: [
      "Aadhaar Card (identity/address proof)",
      "PAN Card (mandatory if balance is >50,000 INR and service is <5 years)",
      "Bank Passbook/Cancelled Cheque showing bank details clearly",
      "Joint Declarations (if correcting spelling mistakes, dates of birth, or joining dates)"
    ],
    what_to_do: [
      "Confirm that your name and date of birth match exactly between your Aadhaar, PAN, and EPF records.",
      "If corrections are needed, submit a Joint Declaration request online through the Member Profile dashboard.",
      "Upload high-resolution scans of the documents when applying for corrections."
    ],
    when_to_file_grievance: "File a grievance if your employer refuses to approve your uploaded KYC documents or if the joint declaration change request is not processed by the field office within 30 days."
  }
];

export const Resources: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [resources, setResources] = useState<ResourceItem[]>(FALLBACK_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories list
  const categories = ['All', 'Withdrawal', 'Transfer', 'Pension', 'Claim Guidance', 'Documents'];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getResources();
        if (data && data.length > 0) {
          setResources(data);
        }
      } catch (err) {
        console.warn("Could not retrieve resources from API, using fallback data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Handle routing state redirection/pre-filtering from Report screen
  useEffect(() => {
    const routedState = location.state as { intent?: string } | null;
    if (routedState?.intent) {
      const intentName = routedState.intent;
      let targetCategory = 'All';
      let targetId = null;

      if (intentName === 'PF_TRANSFER') {
        targetCategory = 'Transfer';
        targetId = 'guidance-pf-transfer';
      } else if (intentName === 'PF_CLAIM') {
        targetCategory = 'Withdrawal';
        targetId = 'guidance-pf-withdrawal';
      } else if (intentName === 'PENSION') {
        targetCategory = 'Pension';
        targetId = 'guidance-pension';
      }

      if (targetCategory !== 'All') {
        setSelectedCategory(targetCategory);
      }
      if (targetId) {
        setExpandedId(targetId);
      }
    }
  }, [location.state]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter resources based on Search and Selected Category tag
  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'All' || res.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      res.title.toLowerCase().includes(searchLower) || 
      res.description.toLowerCase().includes(searchLower) ||
      res.category.toLowerCase().includes(searchLower) ||
      (res.what_it_means && res.what_it_means.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            Official Guides & Guidance Catalog
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Explore rules, required files, and procedural guides for EPFO citizens.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="self-start sm:self-auto gap-1 border-neutral-300 hover:bg-neutral-50 text-neutral-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Demo Warning Banner */}
      <div className="p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3 text-yellow-800">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Prototype Guide:</strong> This informational catalog contains synthetic demonstration references only. It does not constitute official legal advise or binding EPFO policy. For actual rules, visit the official EPFO web portals.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Search guides</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
            placeholder="Search guides, documents, or terms (e.g. advance, Form 31)..."
          />
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 select-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer
                ${selectedCategory === cat 
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 space-y-2 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
            <p className="text-sm">Loading guides...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          filteredResources.map((resource) => {
            const isExpanded = expandedId === resource.id;
            return (
              <Card key={resource.id} padded className="hover:border-neutral-300 transition-all">
                <div 
                  onClick={() => toggleExpand(resource.id)}
                  className="flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{resource.category}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-neutral-800 leading-tight">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {resource.description}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 focus:outline-none"
                    aria-label={isExpanded ? "Collapse guidance details" : "Expand guidance details"}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Collapsible Guidance Content Details */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-neutral-100 space-y-4 text-sm animate-fade-in">
                    
                    {/* Section 1: What this means */}
                    {resource.what_it_means && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-primary-500" />
                          What this means
                        </span>
                        <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                          {resource.what_it_means}
                        </p>
                      </div>
                    )}

                    {/* Section 2: What you may need */}
                    {resource.what_you_need && resource.what_you_need.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-primary-500" />
                          What you may need
                        </span>
                        <ul className="list-disc pl-9 text-xs text-neutral-600 space-y-1">
                          {resource.what_you_need.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section 3: What to do next */}
                    {resource.what_to_do && resource.what_to_do.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                          What to do next
                        </span>
                        <ol className="list-decimal pl-9 text-xs text-neutral-600 space-y-1">
                          {resource.what_to_do.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Section 4: When to file a grievance */}
                    {resource.when_to_file_grievance && (
                      <div className="space-y-1.5 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                          When to file a grievance
                        </span>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {resource.when_to_file_grievance}
                        </p>
                      </div>
                    )}

                    {/* Official Portal Link */}
                    {resource.link && (
                      <div className="pt-2 flex justify-end">
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold focus:outline-none focus:underline"
                        >
                          Visit Official EPFO Portal
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-500">No guides match your search</p>
            <p className="text-xs text-neutral-400 mt-1">Try expanding search query parameters or category tags.</p>
          </div>
        )}
      </div>

    </div>
  );
};

// Simple loader helper icon
const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    className={`animate-spin ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
