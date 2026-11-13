import fs from 'fs';
import path from 'path';

function createWavBuffer(sampleRate, durationSeconds, generateSample) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const blockAlign = 2; // 16-bit mono
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // write audio samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generateSample(t, durationSeconds, i)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;
const audioDir = path.resolve('src', 'assets', 'audio');
fs.mkdirSync(audioDir, { recursive: true });

// 1. click.mp3
const clickBuffer = createWavBuffer(sampleRate, 0.08, (t) => {
  const env = Math.exp(-t * 50);
  const freq = 1200 - t * 4000;
  return Math.sin(2 * Math.PI * freq * t) * env;
});
fs.writeFileSync(path.join(audioDir, 'click.mp3'), clickBuffer);

// 2. move.mp3 (X / O move)
const moveBuffer = createWavBuffer(sampleRate, 0.25, (t) => {
  const env = Math.exp(-t * 12);
  return (Math.sin(2 * Math.PI * 660 * t) + 0.5 * Math.sin(2 * Math.PI * 1320 * t)) * env * 0.8;
});
fs.writeFileSync(path.join(audioDir, 'move.mp3'), moveBuffer);

// 3. win.mp3
const winBuffer = createWavBuffer(sampleRate, 1.2, (t) => {
  const env = Math.exp(-t * 2.5);
  // Arpeggio notes: C5 (523), E5 (659), G5 (784), C6 (1046)
  let freq = 523.25;
  if (t > 0.15) freq = 659.25;
  if (t > 0.3) freq = 783.99;
  if (t > 0.45) freq = 1046.50;
  return Math.sin(2 * Math.PI * freq * t) * env * 0.9;
});
fs.writeFileSync(path.join(audioDir, 'win.mp3'), winBuffer);

// 4. draw.mp3
const drawBuffer = createWavBuffer(sampleRate, 0.8, (t) => {
  const env = Math.exp(-t * 3);
  return (Math.sin(2 * Math.PI * 220 * t) + Math.sin(2 * Math.PI * 224 * t)) * 0.5 * env;
});
fs.writeFileSync(path.join(audioDir, 'draw.mp3'), drawBuffer);

// 5. background-music.mp3
const bgMusicBuffer = createWavBuffer(sampleRate, 4.0, (t, dur) => {
  // Relaxing ambient drone / chord progression loop
  const env = 0.4 + 0.1 * Math.sin(2 * Math.PI * 0.25 * t);
  const c1 = Math.sin(2 * Math.PI * 130.81 * t); // C3
  const c2 = Math.sin(2 * Math.PI * 196.00 * t); // G3
  const c3 = Math.sin(2 * Math.PI * 261.63 * t); // C4
  const c4 = Math.sin(2 * Math.PI * 329.63 * t); // E4
  return (c1 + c2 * 0.7 + c3 * 0.5 + c4 * 0.4) * 0.25 * env;
});
fs.writeFileSync(path.join(audioDir, 'background-music.mp3'), bgMusicBuffer);

console.log('Audio files created in src/assets/audio/');

