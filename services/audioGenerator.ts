/**
 * Audio Generator - Create test audio files for development
 * Generates placeholder silence audio for Quran, Azkar, Adhan, etc.
 */

export async function generateAndSaveTestAudio() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Define audio categories with different durations
    const audioConfigs = [
      { name: 'quran/surah-al-fatiha', duration: 3 },
      { name: 'azkar/sabah', duration: 2 },
      { name: 'azkar/masaa', duration: 2 },
      { name: 'adhan/fajr', duration: 4 },
      { name: 'tasbih/click', duration: 0.1 },
    ];

    console.log('[AudioGenerator] Creating test audio files...');

    for (const config of audioConfigs) {
      const blob = generateSilenceAudio(audioContext, config.duration);
      // Store as data URL for now
      const url = URL.createObjectURL(blob);
      console.log(`✓ Generated ${config.name}: ${url}`);
    }

    console.log('[AudioGenerator] Test audio generation complete');
  } catch (error) {
    console.error('[AudioGenerator] Error:', error);
  }
}

function generateSilenceAudio(audioContext: AudioContext, durationSeconds: number): Blob {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * durationSeconds, sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with silence (zeros)
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }

  return bufferToWave(buffer);
}

function bufferToWave(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const length = audioBuffer.length * numberOfChannels * (bitDepth / 8);

  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true);
  view.setUint16(32, numberOfChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write silence (zeros)
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      view.setInt16(offset, 0, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
