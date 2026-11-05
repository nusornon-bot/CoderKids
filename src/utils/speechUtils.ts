// Web Speech API Utility for Thai Text-to-Speech (Assistive Learning)

class ThaiSpeechManager {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Pre-warm voices
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  public subscribe(listener: (isSpeaking: boolean) => void): () => void {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public speak(text: string, rate: number = 0.95): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // Stop ongoing speech
    this.stop();

    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = rate; // Slightly slower for primary school children clarity
    utterance.pitch = 1.05;

    // Try finding Thai voice
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find(
      (v) => v.lang.toLowerCase().includes('th') || v.name.toLowerCase().includes('thai')
    );
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    utterance.onstart = () => {
      this.currentUtterance = utterance;
      this.notify(true);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.currentUtterance = null;
      this.notify(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.notify(false);
    }
  }

  public getStatus(): boolean {
    return this.isSpeaking;
  }
}

export const speechManager = new ThaiSpeechManager();
