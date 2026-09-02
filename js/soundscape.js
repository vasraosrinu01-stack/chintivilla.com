/**
 * FRNDSPACE LUXURY NIGHT VILLA - SYNTHESIZED AMBIENT SOUNDSCAPE ENGINE
 * Uses Web Audio API to create a gentle, warm nocturnal sound atmosphere (night breeze & bonfire crackle)
 * Works without external MP3 dependencies!
 */

class SoundscapeEngine {
  constructor() {
    this.isPlaying = false;
    this.audioCtx = null;
    this.masterGain = null;
    this.nodes = [];
    this.initUI();
  }

  initUI() {
    const soundToggle = document.getElementById('soundToggleBtn');
    if (!soundToggle) return;

    soundToggle.addEventListener('click', () => {
      if (this.isPlaying) {
        this.stop();
        soundToggle.classList.remove('playing');
      } else {
        this.start();
        soundToggle.classList.add('playing');
      }
    });
  }

  start() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.audioCtx.currentTime + 2);
      this.masterGain.connect(this.audioCtx.destination);

      this.createNightBreeze();
      this.createWarmPad();
      this.createFireCrackle();

      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext not allowed without user gesture:', e);
    }
  }

  createNightBreeze() {
    // Pink/Brown noise generator for gentle night wind
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for low-end nocturnal wind
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    // Subtle LFO modulation for wind gusts
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.frequency.value = 0.15; // 0.15 Hz slow gust
    lfoGain.gain.value = 80;
    lfo.connect(filter.frequency);

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);

    whiteNoise.start(0);
    lfo.start(0);

    this.nodes.push(whiteNoise, lfo);
  }

  createWarmPad() {
    // Soothing ethereal harmonic chord (Night villa calm ambiance)
    const freqs = [146.83, 220.00, 293.66]; // D3, A3, D4 (Open 5th chord)
    freqs.forEach((freq) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.value = 0.04;

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(0);
      this.nodes.push(osc);
    });
  }

  createFireCrackle() {
    // Gentle intermittent campfire crackle
    const bufferSize = this.audioCtx.sampleRate;
    const crackleBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = crackleBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() > 0.997) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      } else {
        data[i] = 0;
      }
    }

    const crackleSource = this.audioCtx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = this.audioCtx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 2400;
    crackleFilter.Q.value = 3;

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(this.masterGain);

    crackleSource.start(0);
    this.nodes.push(crackleSource);
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1);
      setTimeout(() => {
        this.nodes.forEach((n) => {
          try { n.stop(); } catch(e){}
        });
        this.nodes = [];
        if (this.audioCtx) this.audioCtx.close();
        this.isPlaying = false;
      }, 1000);
    }
  }
}

window.soundscape = new SoundscapeEngine();
