/**
 * Audio Initialization Service
 * Initializes test audio files and sets up audio fallbacks
 */

import enhancedAudioPlayerService from './enhancedAudioPlayerService';

export const initializeTestAudio = async () => {
  try {
    console.log('[AudioInit] Initializing audio system...');

    // Create test audio blobs
    const silenceBlob = createSilenceAudio(1000); // 1 second of silence
    const clickBlob = createClickAudio(); // Click sound for Tasbeeh
    
    // Create ObjectURLs for fallback
    const silenceUrl = URL.createObjectURL(silenceBlob);
    const clickUrl = URL.createObjectURL(clickBlob);

    // Store in sessionStorage for quick access
    sessionStorage.setItem('audio_silence_url', silenceUrl);
    sessionStorage.setItem('audio_click_url', clickUrl);

    console.log('[AudioInit] Audio system initialized successfully');
    console.log(`  ✓ Silence audio: ${silenceUrl}`);
    console.log(`  ✓ Click audio: ${clickUrl}`);

    return {
      silenceUrl,
      clickUrl,
      isReady: true
    };
  } catch (error) {
    console.error('[AudioInit] Failed to initialize audio:', error);
    return {
      silenceUrl: null,
      clickUrl: null,
      isReady: false
    };
  }
};

/**
 * Create silence audio (for Quran, Azkar, etc.)
 */
function createSilenceAudio(durationMs: number): Blob {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = durationMs / 1000;
  
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with silence (zeros)
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }

  return bufferToWav(buffer);
}

/**
 * Create click sound (for Tasbeeh counter)
 */
export function createClickAudio(): Blob {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 0.1; // 100ms click
  
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Create a simple click sound using a sine wave burst
  const frequency = 1000; // 1kHz
  const amplitude = 0.3;
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Sine wave with exponential decay
    const decay = Math.exp(-t * 20);
    data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * decay;
  }

  return bufferToWav(buffer);
}

/**
 * Create notification/beep sound for alerts
 */
export function createBeepAudio(frequency: number = 800, durationMs: number = 200): Blob {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = durationMs / 1000;
  
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  const amplitude = 0.3;
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Sine wave with exponential decay envelope
    const envelope = Math.exp(-t * 8);
    data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  return bufferToWav(buffer);
}

/**
 * Convert AudioBuffer to WAV Blob
 */
function bufferToWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const length = audioBuffer.length * numberOfChannels * bytesPerSample;

  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  // Helper function to write string
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset, str.charCodeAt(i));
      offset++;
    }
  };

  // RIFF header
  writeString('RIFF');
  view.setUint32(offset, 36 + length, true);
  offset += 4;
  writeString('WAVE');

  // fmt sub-chunk
  writeString('fmt ');
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, format, true);
  offset += 2;
  view.setUint16(offset, numberOfChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * numberOfChannels * bytesPerSample, true);
  offset += 4;
  view.setUint16(offset, numberOfChannels * bytesPerSample, true);
  offset += 2;
  view.setUint16(offset, bitDepth, true);
  offset += 2;

  // data sub-chunk
  writeString('data');
  view.setUint32(offset, length, true);
  offset += 4;

  // Write audio data
  let index = offset;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      let sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(index, sample, true);
      index += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Pre-load audio for specific feature
 */
export async function preloadAudio(feature: 'quran' | 'azkar' | 'adhan' | 'tasbih') {
  const audioInit = await initializeTestAudio();
  
  if (!audioInit.isReady) {
    console.warn(`[AudioInit] Could not preload audio for ${feature}`);
    return false;
  }

  console.log(`[AudioInit] Audio preloaded for ${feature}`);
  return true;
}

/**
 * Play a quick test sound
 */
export async function playTestSound() {
  try {
    const click = createClickAudio();
    const url = URL.createObjectURL(click);
    
    const audio = new Audio(url);
    audio.volume = 0.5;
    await audio.play();
    
    // Clean up after playing
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return true;
  } catch (error) {
    console.error('[AudioInit] Failed to play test sound:', error);
    return false;
  }
}
