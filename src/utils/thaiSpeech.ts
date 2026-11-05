/**
 * Web Speech API Utility for Thai Text-to-Speech (TTS)
 * Used across Coder Kids lessons to narrate explanations, instructions, and feedback
 */

export const speakThai = (text: string, onEnd?: () => void): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this browser.');
    return false;
  }

  try {
    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    // Remove markdown / symbols
    const cleanText = text
      .replace(/[#*_`~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 0.95; // comfortable pace for young learners
    utterance.pitch = 1.05; // cheerful tone

    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find((v) => v.lang === 'th-TH' || v.lang.startsWith('th'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error invoking SpeechSynthesis:', err);
    return false;
  }
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeechActive = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
