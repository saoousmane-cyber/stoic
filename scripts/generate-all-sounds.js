// scripts/generate-all-sounds.js
// Exécuter avec: node scripts/generate-all-sounds.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Créer les dossiers
const soundsDir = path.join(__dirname, '../P3_frontend_landing/public/sounds');
const ambianceDir = path.join(soundsDir, 'ambiance');

if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });
if (!fs.existsSync(ambianceDir)) fs.mkdirSync(ambianceDir, { recursive: true });

console.log('🎵 Génération des fichiers audio...\n');

// Fonction pour créer un fichier WAV avec une tonalité simple
function generateToneWav(frequency, durationSeconds, sampleRate = 44100) {
  const numSamples = durationSeconds * sampleRate;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Generate sine wave
  const amplitude = 30000;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const value = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    const intValue = Math.floor(value);
    buffer.writeInt16LE(intValue, 44 + i * 2);
  }
  
  return buffer;
}

// Fonction pour créer un sweep (effet de transition)
function generateSweepWav(startFreq, endFreq, durationSeconds, sampleRate = 44100) {
  const numSamples = durationSeconds * sampleRate;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  const amplitude = 25000;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = startFreq + (endFreq - startFreq) * (t / durationSeconds);
    const value = Math.sin(2 * Math.PI * freq * t) * amplitude;
    const intValue = Math.floor(value);
    buffer.writeInt16LE(intValue, 44 + i * 2);
  }
  
  return buffer;
}

// Fonction pour créer un ping
function generatePingWav(frequency, durationSeconds, sampleRate = 44100) {
  const numSamples = durationSeconds * sampleRate;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  const amplitude = 32760;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 10);
    const value = Math.sin(2 * Math.PI * frequency * t) * amplitude * envelope;
    const intValue = Math.floor(value);
    buffer.writeInt16LE(intValue, 44 + i * 2);
  }
  
  return buffer;
}

// Génération des sons UI
const uiSounds = [
  { name: 'transition', generator: () => generateSweepWav(440, 880, 0.8) },
  { name: 'emphasis', generator: () => generateToneWav(660, 0.4) },
  { name: 'notification', generator: () => generatePingWav(880, 0.3) },
  { name: 'success', generator: () => generatePingWav(523.25, 0.5) },
  { name: 'error', generator: () => generateSweepWav(440, 220, 0.8) },
];

for (const sound of uiSounds) {
  const wavPath = path.join(soundsDir, `${sound.name}.wav`);
  const mp3Path = path.join(soundsDir, `${sound.name}.mp3`);
  const buffer = sound.generator();
  fs.writeFileSync(wavPath, buffer);
  console.log(`✅ Généré: ${sound.name}.wav`);
  
  // Convertir en MP3 si ffmpeg est disponible
  try {
    execSync(`ffmpeg -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" -y`, { stdio: 'ignore' });
    console.log(`✅ Converti: ${sound.name}.mp3`);
    fs.unlinkSync(wavPath);
  } catch (e) {
    console.log(`⚠️  Conversion MP3 ignorée pour ${sound.name} (ffmpeg non trouvé)`);
  }
}

// Génération des sons d'ambiance
const ambianceSounds = [
  { name: 'wind-mediterranean', generator: () => generateSweepWav(80, 200, 30) },
  { name: 'fire-crackling', generator: () => generateSweepWav(100, 400, 45) },
  { name: 'tibetan-bowl', generator: () => generatePingWav(432, 10) },
  { name: 'flowing-water', generator: () => generateSweepWav(200, 600, 60) },
  { name: 'forest-birds', generator: () => generateSweepWav(800, 1500, 30) },
  { name: 'battlefield', generator: () => generateSweepWav(100, 500, 25) },
  { name: 'medieval-market', generator: () => generateSweepWav(200, 800, 35) },
  { name: 'quiet-library', generator: () => generateSweepWav(100, 200, 45) },
  { name: 'brainwaves', generator: () => generateSweepWav(40, 100, 60) },
  { name: 'angelic-chimes', generator: () => generatePingWav(1046.50, 6) },
  { name: 'cosmic-drone', generator: () => generateSweepWav(50, 80, 60) },
  { name: 'motivational-rise', generator: () => generateSweepWav(220, 880, 12) },
  { name: 'divine-thunder', generator: () => generateSweepWav(60, 120, 8) },
  { name: 'magical-sparkle', generator: () => generatePingWav(2093.00, 2) },
];

for (const sound of ambianceSounds) {
  const wavPath = path.join(ambianceDir, `${sound.name}.wav`);
  const mp3Path = path.join(ambianceDir, `${sound.name}.mp3`);
  const buffer = sound.generator();
  fs.writeFileSync(wavPath, buffer);
  console.log(`✅ Généré: ambiance/${sound.name}.wav`);
  
  try {
    execSync(`ffmpeg -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" -y`, { stdio: 'ignore' });
    console.log(`✅ Converti: ambiance/${sound.name}.mp3`);
    fs.unlinkSync(wavPath);
  } catch (e) {
    console.log(`⚠️  Conversion MP3 ignorée pour ambiance/${sound.name}`);
  }
}

console.log('\n✨ Tous les sons ont été générés avec succès !');