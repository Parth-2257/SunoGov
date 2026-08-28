from typing import List, Optional
from fastapi import APIRouter, status
from app.schemas.schemas import ResourceItem

router = APIRouter()

STATIC_RESOURCES = [
    {
        "id": "guidance-pf-withdrawal",
        "title": "General PF Withdrawal Guidance",
        "description": "Information on withdrawing PF advances or full settlements.",
        "category": "Withdrawal",
        "link": "https://www.epfindia.gov.in/",
        "what_it_means": "PF Withdrawal allows members to withdraw their accumulated EPF balance either partially (advance) during service or fully after retirement/unemployment.",
        "what_you_need": [
            "Active UAN (Universal Account Number)",
            "Aadhaar card linked to your UAN",
            "Bank account number linked to your UAN (with IFSC code)",
            "Mobile number registered with Aadhaar"
        ],
        "what_to_do": [
            "Ensure your KYC details are completely updated on the Unified Member Portal.",
            "Log in to the Member Portal using your UAN and Password.",
            "Go to 'Online Services' and select 'Claim (Form-31, 19, 10C & 10D)'.",
            "Verify your bank account digits, click 'Yes', and select your claim type."
        ],
        "when_to_file_grievance": "File a grievance if your withdrawal claim is rejected without a clear explanation, remains pending for more than 20 days, or fails to get disbursed to your bank account after status shows settled."
    },
    {
        "id": "guidance-pf-transfer",
        "title": "PF Account Transfer Guidance",
        "description": "How to transfer your EPF balance from a previous employer to a new one.",
        "category": "Transfer",
        "link": "https://www.epfindia.gov.in/",
        "what_it_means": "PF Transfer consolidates your previous EPF accumulations into your current member ID, keeping your service continuous and maximizing your interest benefits.",
        "what_you_need": [
            "Active UAN registered on Member Portal",
            "Correct and matching personal details across old and new employers",
            "Approved Aadhaar and Bank KYC details",
            "Approved digital signature registration by the current or previous employer"
        ],
        "what_to_do": [
            "Log into the EPFO Unified Member Portal.",
            "Navigate to 'Online Services' and choose 'One Member - One EPF Account (Transfer Request)'.",
            "Input your previous member ID/UAN, and click 'Get Details'.",
            "Choose either your previous or current employer for claim attestation, get OTP, and submit."
        ],
        "when_to_file_grievance": "File a grievance if your transfer request remains stuck with the employer for more than 15 days, or if the transfer is approved but the balance does not reflect in your current passbook after 20 days."
    },
    {
        "id": "guidance-pension",
        "title": "EPS Pension & Pension Claims",
        "description": "Understand your eligibility and payouts under the Employees' Pension Scheme.",
        "category": "Pension",
        "link": "https://www.epfindia.gov.in/",
        "what_it_means": "EPS-95 provides a regular monthly pension benefit to EPF members who complete a minimum of 10 years of eligible service and reach the age of 58 (or early pension at 50).",
        "what_you_need": [
            "Form 10D for monthly pension claims",
            "Scheme Certificate (Form 10C) if leaving service before pension eligibility",
            "Joint bank account linked with Aadhaar",
            "Service records showing cumulative eligible service"
        ],
        "what_to_do": [
            "Ensure your composite profile matches your Aadhaar record.",
            "Submit Form 10D online or via your employer on the Member Portal upon completing 10 years of service and reaching age 58.",
            "Alternatively, apply for a Scheme Certificate using Form 10C to retain your pension service credits."
        ],
        "when_to_file_grievance": "File a grievance if your pension payout has not been received, your Form 10D claim gets rejected unfairly, or your monthly pension rate is calculated incorrectly."
    },
    {
        "id": "guidance-claims",
        "title": "EPFO Claim-related Guidance",
        "description": "Best practices for submitting composite online claim files.",
        "category": "Claim Guidance",
        "link": "https://www.epfindia.gov.in/",
        "what_it_means": "EPFO Claims process settlements for withdrawal, advances, and pension withdrawals through automated passbook verification routines.",
        "what_you_need": [
            "Aadhaar-linked active mobile number",
            "Updated bank account passbook copy (showing name, account number, and IFSC)",
            "Form 15G/15H (if claiming PF before 5 years of service to avoid TDS)"
        ],
        "what_to_do": [
            "Before applying, check your EPF passbook balance online.",
            "Select the correct Composite Claim Form on the Portal (Form-19 for PF, Form-10C for withdrawal benefit, Form-31 for advances).",
            "Upload a clear scanned copy of your checkbook/passbook (PDF/JPEG between 100kb and 500kb)."
        ],
        "when_to_file_grievance": "File a grievance if your claim shows 'Under Process' for more than 15 days or is rejected multiple times without specifying concrete rectification steps."
    },
    {
        "id": "guidance-documents",
        "title": "Required Documents Catalog",
        "description": "General list of KYC and identity verification documents required by EPFO.",
        "category": "Documents",
        "link": "https://www.epfindia.gov.in/",
        "what_it_means": "Standardized documentation ensures secure and verified digital transactions, preventing fraud and speeding up automated settlement approvals.",
        "what_you_need": [
            "Aadhaar Card (identity/address proof)",
            "PAN Card (mandatory if balance is >50,000 INR and service is <5 years)",
            "Bank Passbook/Cancelled Cheque showing bank details clearly",
            "Joint Declarations (if correcting spelling mistakes, dates of birth, or joining dates)"
        ],
        "what_to_do": [
            "Confirm that your name and date of birth match exactly between your Aadhaar, PAN, and EPF records.",
            "If corrections are needed, submit a Joint Declaration request online through the Member Profile dashboard.",
            "Upload high-resolution scans of the documents when applying for corrections."
        ],
        "when_to_file_grievance": "File a grievance if your employer refuses to approve your uploaded KYC documents or if the joint declaration change request is not processed by the field office within 30 days."
    }
]


@router.get("", response_model=List[ResourceItem], status_code=status.HTTP_200_OK)
async def get_resources(category: Optional[str] = None):
    """
    List FAQs and information guide resources for EPFO processes.
    Supports optional category filtering.
    """
    if category:
        filtered = [r for r in STATIC_RESOURCES if r["category"].lower() == category.lower()]
        return filtered
    return STATIC_RESOURCES
