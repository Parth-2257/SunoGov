from app.ai.base import AIProvider
from app.ai.schemas import AIAnalysisSchema, AIRequestType, AIIntent, AIMissingField


# Mock provider for testing and fallback scenarios
class MockAIProvider(AIProvider):
    """
    Deterministic AI provider simulator for Phase 3A architecture validation.
    Maps natural language keywords to strict request type and intent taxonomies.
    """

    async def analyze(self, text: str) -> AIAnalysisSchema:
        clean_text = text.strip().lower()

        # Rule 1: Status / Grievance Tracking Check
        # Matches if user asks for status checks unless they explicitly mention pension details
        if "status" in clean_text or ("check" in clean_text and "pension" not in clean_text):
            return AIAnalysisSchema(
                request_type=AIRequestType.STATUS,
                intent=AIIntent.GRIEVANCE_STATUS,
                language="hinglish",
                summary="Checking the status of a filed grievance.",
                confidence=0.96,
                missing_fields=[
                    AIMissingField(
                        field="grievance_reference_number",
                        reason="We need your grievance reference ID to track your request.",
                        required=True,
                        question="Please enter your grievance reference ID."
                    )
                ]
            )

        # Rule 2: Claims Rejection
        # Matches when claim rejection is detected
        elif "reject" in clean_text or "rejection" in clean_text or "रिजेक्ट" in clean_text:
            return AIAnalysisSchema(
                request_type=AIRequestType.GRIEVANCE,
                intent=AIIntent.PF_CLAIM,
                language="hinglish",
                summary="PF claim rejection issue.",
                confidence=0.94,
                missing_fields=[
                    AIMissingField(
                        field="uan",
                        reason="We need your UAN to retrieve your claim records.",
                        required=True,
                        question="What is your UAN?"
                    ),
                    AIMissingField(
                        field="claim_reference_number",
                        reason="Optional claim reference number allows us to trace the specific transaction.",
                        required=False,
                        question="Do you have a claim reference number?"
                    )
                ]
            )

        # Rule 3: Pension Issues
        # Matches queries mentioning pension
        elif "pension" in clean_text:
            return AIAnalysisSchema(
                request_type=AIRequestType.GRIEVANCE,
                intent=AIIntent.PENSION,
                language="hinglish",
                summary="EPS pension payout has not been received.",
                confidence=0.94,
                missing_fields=[
                    AIMissingField(
                        field="uan",
                        reason="We need your UAN to verify your EPS contribution records.",
                        required=True,
                        question="What is your UAN?"
                    ),
                    AIMissingField(
                        field="ppo_number",
                        reason="Optional pension payment order (PPO) number helps track EPS payments.",
                        required=False,
                        question="Do you have a PPO number?"
                    )
                ]
            )

        # Rule 4: Claim Withdraw / Medical Information Inquiry
        # Matches queries asking *how* to withdraw or check eligibility (Informational)
        elif "kaise withdraw" in clean_text or "how to withdraw" in clean_text or "withdraw kar sakta" in clean_text:
            return AIAnalysisSchema(
                request_type=AIRequestType.INFORMATION,
                intent=AIIntent.PF_CLAIM,
                language="hinglish",
                summary="Requesting information on how to withdraw PF for a medical emergency.",
                confidence=0.98,
                missing_fields=[]
            )

        # Rule 5: Claim Withdraw / Medical Emergency Request
        # Matches queries requesting a withdrawal under emergency or medical grounds
        elif "emergency" in clean_text or "withdraw" in clean_text or "nikalna" in clean_text:
            return AIAnalysisSchema(
                request_type=AIRequestType.GRIEVANCE,
                intent=AIIntent.PF_CLAIM,
                language="hinglish",
                summary="PF claim withdrawal request for medical emergency.",
                confidence=0.92,
                missing_fields=[
                    AIMissingField(
                        field="uan",
                        reason="We need your UAN to process the withdrawal request.",
                        required=True,
                        question="What is your UAN?"
                    )
                ]
            )

        # Rule 6: PF Transfer Stuck / Pending
        # Matches queries regarding pending or stuck transfers
        elif "transfer" in clean_text or "ट्रान्सफर" in clean_text or "ट्रांसफर" in clean_text or "stuck" in clean_text:
            lang = "hinglish"
            if "मेरा" in clean_text:
                lang = "hindi"
            elif "माझा" in clean_text:
                lang = "marathi"
            elif "my pf" in clean_text:
                lang = "english"

            return AIAnalysisSchema(
                request_type=AIRequestType.GRIEVANCE,
                intent=AIIntent.PF_TRANSFER,
                language=lang,
                summary="PF transfer has been pending for approximately 3 months.",
                confidence=0.95,
                missing_fields=[
                    AIMissingField(
                        field="uan",
                        reason="We need your UAN to identify the PF record related to your grievance.",
                        required=True,
                        question="What is your UAN?"
                    ),
                    AIMissingField(
                        field="transfer_reference_number",
                        reason="Optional transfer reference number allows us to locate the exact transaction.",
                        required=False,
                        question="Do you have a transfer reference number?"
                    )
                ]
            )

        # Rule 7: Fallback for all other queries
        else:
            return AIAnalysisSchema(
                request_type=AIRequestType.UNKNOWN,
                intent=AIIntent.UNKNOWN,
                language="unknown",
                summary="Unable to classify user query.",
                confidence=0.30,
                missing_fields=[]
            )

    async def classify_boolean(self, text: str) -> str:
        """
        Classifies semantic boolean text deterministically for testing and offline scenarios.
        """
        clean = text.lower().strip()
        
        # Test Case matching phrases
        if any(w in clean for w in ["yes", "haan", "yep", "yeah", "ok", "correct", "i do"]):
            return "YES"
        if any(w in clean for w in ["no", "nahi", "nope", "nah", "don't", "dont"]):
            return "NO"
            
        return "AMBIGUOUS"
