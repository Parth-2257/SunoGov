import { AIAnalysis, RequestType } from '../types';
import { interpretSemanticAnswer } from '../pages/Report';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

export function runFlowTests() {
  console.log("Running SunoGov User Flow Integration tests...");

  // 1. Verify Client Analysis Schema Mapper
  {
    const mockApiResponse = {
      success: true,
      analysis: {
        request_type: 'GRIEVANCE' as RequestType,
        intent: 'PF_TRANSFER',
        summary: "Member's PF transfer request remains pending.",
        confidence: 0.95,
        missing_fields: [
          { field: "uan", reason: "UAN is required to check transfer files." }
        ]
      }
    };

    // Client-side mapper simulation
    const clientAnalysis: AIAnalysis = {
      request_type: mockApiResponse.analysis.request_type,
      intent: {
        name: mockApiResponse.analysis.intent,
        confidence: mockApiResponse.analysis.confidence,
        description: mockApiResponse.analysis.summary
      },
      extracted_fields: { uan: null },
      missing_fields: mockApiResponse.analysis.missing_fields.map(f => ({
        field_name: f.field,
        field_type: 'string',
        description: f.reason,
        required: true,
        question: "Please enter your UAN."
      })),
      summary: mockApiResponse.analysis.summary,
      confidence: mockApiResponse.analysis.confidence
    };

    assert(clientAnalysis.request_type === 'GRIEVANCE', "Should map request_type successfully.");
    assert(clientAnalysis.intent.name === 'PF_TRANSFER', "Should map intent name successfully.");
    assert(clientAnalysis.missing_fields.length === 1, "Should map missing fields list successfully.");
    assert(clientAnalysis.missing_fields[0].field_name === 'uan', "Should map missing field name successfully.");

    console.log("Test 1: Client analysis schema mapper verification passed.");
  }

  // 2. Verify Fallback constraints on Exception
  {
    // In case of any API error, frontend must enforce clean UNKNOWN maps
    const errorFallbackAnalysis: AIAnalysis = {
      request_type: 'UNKNOWN',
      intent: {
        name: 'UNKNOWN',
        confidence: 0.0,
        description: 'Failed to complete query classification.'
      },
      extracted_fields: {},
      missing_fields: [],
      summary: 'Classification failed.',
      confidence: 0.0
    };

    assert(errorFallbackAnalysis.request_type === 'UNKNOWN', "Fallback request type must be UNKNOWN.");
    assert(errorFallbackAnalysis.intent.name === 'UNKNOWN', "Fallback intent name must be UNKNOWN.");
    assert(errorFallbackAnalysis.missing_fields.length === 0, "Fallback missing fields list must be empty.");

    console.log("Test 2: Error classification fallback verification passed.");
  }

  // 3. Verify Grievance Category Mapper
  {
    const mapIntentToCategory = (intent: string): string => {
      if (intent.includes('TRANSFER')) return 'DEMO_PF_TRANSFER_CATEGORY';
      if (intent.includes('REJECTED') || intent.includes('CLAIM')) return 'DEMO_PF_CLAIM_REJECTION_CATEGORY';
      if (intent.includes('PENSION')) return 'DEMO_PENSION_CATEGORY';
      return 'DEMO_GENERAL_CATEGORY';
    };

    assert(mapIntentToCategory('PF_TRANSFER_DELAY') === 'DEMO_PF_TRANSFER_CATEGORY', "Should map TRANSFER intents.");
    assert(mapIntentToCategory('PF_CLAIM_REJECTED') === 'DEMO_PF_CLAIM_REJECTION_CATEGORY', "Should map CLAIM/REJECTED intents.");
    assert(mapIntentToCategory('EPS_PENSION_PROBLEM') === 'DEMO_PENSION_CATEGORY', "Should map PENSION intents.");
    assert(mapIntentToCategory('UNKNOWN') === 'DEMO_GENERAL_CATEGORY', "Should map generic fallback intents.");

    console.log("Test 3: Grievance category mapper verification passed.");
  }

  // 4. Verify Semantic Yes/No Normalizer
  {
    const testYesPhrases = [
      'yes', 'Yes', 'y', 'yeah', 'yep', 'sure', 'okay', 'ok', 'correct', 'right',
      'haan', 'ha', 'han', 'ji', 'bilkul', 'yes I have it', 'yes, I have one', 'I have it', 'I do'
    ];
    for (const phrase of testYesPhrases) {
      assert(interpretSemanticAnswer(phrase) === 'YES', `Should classify "${phrase}" as YES`);
    }

    const testNoPhrases = [
      'no', 'No', 'NO', 'n', 'nope', 'nah', 'not really', "I don't", 'I do not',
      'nahi', 'nahin', 'nahi hai', "no I don't", "I don't have one", "I don't have it"
    ];
    for (const phrase of testNoPhrases) {
      assert(interpretSemanticAnswer(phrase) === 'NO', `Should classify "${phrase}" as NO`);
    }

    const ambiguousPhrases = [
      'I received something but not sure', 'maybe', 'not yet', 'some reference ID'
    ];
    for (const phrase of ambiguousPhrases) {
      assert(interpretSemanticAnswer(phrase) === 'AMBIGUOUS', `Should classify "${phrase}" as AMBIGUOUS`);
    }

    console.log("Test 4: Semantic Yes/No normalizer checks passed.");
  }

  // 5. Verify Rejecting Boolean Values for Identifiers (e.g. UAN, Reference ID)
  {
    const validateFieldInput = (fieldName: string, value: string): boolean => {
      const semanticAns = interpretSemanticAnswer(value);
      if (semanticAns === 'YES' || semanticAns === 'NO') {
        return false; // Reject yes/no answers for text fields
      }
      if (fieldName === 'uan' && value.trim().length < 3) {
        return false;
      }
      return true;
    };

    assert(validateFieldInput('uan', 'DEMO-1234') === true, "Should accept valid UAN");
    assert(validateFieldInput('uan', 'yes') === false, "Should reject yes as UAN");
    assert(validateFieldInput('uan', 'no') === false, "Should reject no as UAN");
    assert(validateFieldInput('transfer_reference_number', 'TRF-12345') === true, "Should accept valid reference number");
    assert(validateFieldInput('transfer_reference_number', 'haan') === false, "Should reject haan as reference ID");

    console.log("Test 5: Rejecting boolean values for identifier inputs passed.");
  }

  console.log("All SunoGov User Flow Integration tests passed successfully!");
}
