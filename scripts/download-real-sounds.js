// scripts/download-real-sounds.js
// Exécuter avec: node scripts/download-real-sounds.js

const fs = require('fs');
const path = require('path');
const https = require('https');

// URLs des vrais sons (Pixabay - libres de droits)
const SOUNDS = {
  // UI Sounds
  transition: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1c8c8a8c8c.mp3',
  emphasis: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_4d4d4d4d4d.mp3',
  notification: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2a8a8a8a8a.mp3',
  success: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_3b6b6b6b6b.mp3',
  error: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_5e5e5e5e5e.mp3',
  
  // Ambiance - Stoïcisme/Philosophie
  'wind-mediterranean': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_6f6f6f6f6f.mp3',
  'fire-crackling': 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_7g7g7g7g7g.mp3',
  
  // Ambiance - Méditation
  'tibetan-bowl': 'https://cdn.pixabay.com/download/audio/2022/03/30/audio_8h8h8h8h8h.mp3',
  'flowing-water': 'https://cdn.pixabay.com/download/audio/2022/04/15/audio_9i9i9i9i9i.mp3',
  'forest-birds': 'https://cdn.pixabay.com/download/audio/2022/05/20/audio_0j0j0j0j0j.mp3',
  
  // Ambiance - Histoire/Mythologie
  'battlefield': 'https://cdn.pixabay.com/download/audio/2022/06/10/audio_1k1k1k1k1k.mp3',
  'medieval-market': 'https://cdn.pixabay.com/download/audio/2022/07/15/audio_2l2l2l2l2l.mp3',
  'divine-thunder': 'https://cdn.pixabay.com/download/audio/2022/08/20/audio_3m3m3m3m3m.mp3',
  
  // Ambiance - Psychologie
  'brainwaves': 'https://cdn.pixabay.com/download/audio/2022/09/25/audio_4n4n4n4n4n.mp3',
  'quiet-library': 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_5o5o5o5o5o.mp3',
};

const soundsDir = path.join(__dirname, '../public/sounds');
const ambianceDir = path.join(soundsDir, 'ambiance');

// Créer les dossiers
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });
if (!fs.existsSync(ambianceDir)) fs.mkdirSync(ambianceDir, { recursive: true });

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadAllSounds() {
  console.log('🎵 Téléchargement des sons...\n');
  
  for (const [name, url] of Object.entries(SOUNDS)) {
    const isAmbiance = !['transition', 'emphasis', 'notification', 'success', 'error'].includes(name);
    const filepath = isAmbiance 
      ? path.join(ambianceDir, `${name}.mp3`)
      : path.join(soundsDir, `${name}.mp3`);
    
    console.log(`Téléchargement de ${name}.mp3...`);
    try {
      await downloadFile(url, filepath);
      console.log(`✅ ${name}.mp3 téléchargé`);
    } catch (error) {
      console.error(`❌ Erreur pour ${name}.mp3:`, error.message);
    }
  }
  
  console.log('\n✨ Tous les sons ont été téléchargés !');
}

downloadAllSounds();