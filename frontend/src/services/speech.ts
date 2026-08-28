export type SpeechState = 'IDLE' | 'LISTENING' | 'TRANSCRIBING' | 'READY' | 'ERROR';

export interface SpeechServiceCallbacks {
  onStateChange: (state: SpeechState) => void;
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
  onDurationChange?: (duration: number) => void;
}

export class SpeechService {
  private callbacks: SpeechServiceCallbacks;
  private state: SpeechState = 'IDLE';
  private recognition: any = null;
  private isListening: boolean = false;
  private durationSeconds: number = 0;
  private durationInterval: any = null;
  private language: string = 'en-IN';

  constructor(callbacks: SpeechServiceCallbacks, language: string = 'en-IN') {
    this.callbacks = callbacks;
    this.language = language;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onstart = () => {
        this.updateState('LISTENING');
        this.startTimer();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          this.callbacks.onTranscript(interimTranscript);
        } else if (finalTranscript) {
          this.callbacks.onTranscript(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.stopTimer();
        this.isListening = false;
        let errorMsg = 'Speech recognition error';
        if (event.error === 'not-allowed') {
          errorMsg = 'Permission denied. Please enable microphone access.';
        } else if (event.error === 'no-speech') {
          errorMsg = 'No speech was detected. Please try again.';
        } else {
          errorMsg = `Speech recognition failed: ${event.error}`;
        }
        this.updateState('ERROR');
        this.callbacks.onError(errorMsg);
      };

      this.recognition.onend = () => {
        this.stopTimer();
        if (this.isListening) {
          this.isListening = false;
          this.updateState('TRANSCRIBING');
          setTimeout(() => {
            this.updateState('READY');
            setTimeout(() => {
              this.updateState('IDLE');
            }, 800);
          }, 600);
        }
      };
    }
  }

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getLanguage(): string {
    return this.language;
  }

  public getState(): SpeechState {
    return this.state;
  }

  public startListening() {
    if (!this.recognition) {
      this.updateState('ERROR');
      this.callbacks.onError('Web Speech API is not supported in this browser.');
      return;
    }
    if (this.isListening) return;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      this.updateState('ERROR');
      this.callbacks.onError(`Failed to start recording: ${err.message}`);
    }
  }

  public stopListening() {
    if (!this.recognition || !this.isListening) return;
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (err) {
      // Ignore
    }
    this.stopTimer();
  }

  private startTimer() {
    this.durationSeconds = 0;
    if (this.callbacks.onDurationChange) {
      this.callbacks.onDurationChange(0);
    }
    this.durationInterval = setInterval(() => {
      this.durationSeconds += 1;
      if (this.callbacks.onDurationChange) {
        this.callbacks.onDurationChange(this.durationSeconds);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  private updateState(newState: SpeechState) {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }
}
