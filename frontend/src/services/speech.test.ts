import { SpeechService, SpeechState } from './speech';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

export function runSpeechTests() {
  console.log("Running SpeechService unit tests...");

  // 1. Unsupported browser handling
  {
    const globalWindow = globalThis as any;
    const originalSpeech = globalWindow.SpeechRecognition;
    const originalWebkit = globalWindow.webkitSpeechRecognition;
    delete globalWindow.SpeechRecognition;
    delete globalWindow.webkitSpeechRecognition;

    let errorCalled = false;
    let errorMsg = '';
    const service = new SpeechService({
      onStateChange: () => {},
      onTranscript: () => {},
      onError: (err) => {
        errorCalled = true;
        errorMsg = err;
      }
    });
    service.startListening();
    assert(errorCalled, "Should trigger error callback on unsupported browser");
    assert(errorMsg.includes("not supported"), "Error message should mention unsupported browser");

    // Restore
    globalWindow.SpeechRecognition = originalSpeech;
    globalWindow.webkitSpeechRecognition = originalWebkit;
    console.log("Test 1: Unsupported browser handling passed.");
  }

  // 2. Language configurations
  {
    const mockSpeechRecognition = class {
      lang = '';
      start() {}
      stop() {}
    };
    (globalThis as any).SpeechRecognition = mockSpeechRecognition;

    const service = new SpeechService({
      onStateChange: () => {},
      onTranscript: () => {},
      onError: () => {}
    }, 'hi-IN');

    assert(service.getLanguage() === 'hi-IN', "Should initialize with Hindi (hi-IN)");

    service.setLanguage('mr-IN');
    assert(service.getLanguage() === 'mr-IN', "Should update to Marathi (mr-IN)");

    console.log("Test 2: Language configuration checks passed.");
  }

  // 3. Permission denial handling
  {
    let receivedState: any = 'IDLE';
    let receivedError = '';

    const mockSpeechRecognitionWithError = class {
      lang = '';
      onerror: any = null;
      start() {
        if (this.onerror) {
          this.onerror({ error: 'not-allowed' });
        }
      }
      stop() {}
    };
    (globalThis as any).SpeechRecognition = mockSpeechRecognitionWithError;

    const service = new SpeechService({
      onStateChange: (state) => {
        receivedState = state;
      },
      onTranscript: () => {},
      onError: (err) => {
        receivedError = err;
      }
    });

    service.startListening();
    assert(receivedState === 'ERROR', "Should transition to ERROR state");
    assert(receivedError.includes("Permission denied"), "Error message should mention permissions");

    console.log("Test 3: Permission denial checks passed.");
  }

  // 4. State transitions loop
  {
    let states: SpeechState[] = [];

    const mockSpeechRecognitionFlow = class {
      lang = '';
      onstart: any = null;
      onend: any = null;
      start() {
        if (this.onstart) this.onstart();
      }
      stop() {
        if (this.onend) this.onend();
      }
    };
    (globalThis as any).SpeechRecognition = mockSpeechRecognitionFlow;

    const service = new SpeechService({
      onStateChange: (state) => {
        states.push(state);
      },
      onTranscript: () => {},
      onError: () => {}
    });

    service.startListening();
    assert(states.includes('LISTENING'), "Should transition to LISTENING state");

    service.stopListening();
    console.log("Test 4: State transitions loop checks passed.");
  }

  console.log("All SpeechService unit tests passed successfully!");
}
