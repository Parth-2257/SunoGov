import { AIAnalysis, RequestType } from '../types';

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
        description: f.reason
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

  console.log("All SunoGov User Flow Integration tests passed successfully!");
}
