// Zero-dependency Web Audio API Sound Effects & Speech Synthesizer for Coder Kids

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved mute preference
    const saved = localStorage.getItem('coderkids_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setSoundMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('coderkids_sound_muted', muted.toString());
  }

  public toggleMute(): boolean {
    this.setSoundMuted(!this.isMuted);
    return this.isMuted;
  }

  // Unified sound player helper
  public play(effect: 'click' | 'correct' | 'error' | 'victory' | 'badge' | 'tick'): void {
    if (this.isMuted) return;
    switch (effect) {
      case 'click':
        this.playClick();
        break;
      case 'correct':
        this.playSuccess();
        break;
      case 'error':
        this.playError();
        break;
      case 'victory':
        this.playCheer();
        break;
      case 'badge':
        this.playFanfare();
        break;
      case 'tick':
        this.playTick();
        break;
      default:
        this.playClick();
    }
  }

  // 1. Success Chime (Major Arpeggio C5 -> E5 -> G5 -> C6)
  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.08);

      gain.gain.setValueAtTime(0.18, startTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.08);
      osc.stop(startTime + index * 0.08 + 0.35);
    });
  }

  // 2. Click / Tap Sound
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(400, time + 0.06);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // 3. Cheer / High-Five Sound (Dual Tone Sparkle)
  public playCheer(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    const startTime = ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.05);

      gain.gain.setValueAtTime(0.15, startTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.05);
      osc.stop(startTime + idx * 0.05 + 0.4);
    });
  }

  // 4. Badge / Level Up Fanfare
  public playFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    const time = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time + i * 0.1);

      gain.gain.setValueAtTime(0.08, time + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time + i * 0.1);
      osc.stop(time + i * 0.1 + 0.3);
    });
  }

  // 5. Wrong / Error Buzz
  public playError(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.setValueAtTime(130, time + 0.12);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  // 6. Timer Tick
  public playTick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  // 7. Thai Speech Synthesis (Text-to-Speech)
  public speakThai(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available:', e);
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEffects = new SoundEffectsService();
