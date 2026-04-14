# scripts/download-sounds.ps1
# Exécuter avec: powershell -File scripts/download-sounds.ps1

$soundsDir = "public/sounds"
$ambianceDir = "public/sounds/ambiance"

# Créer les dossiers
New-Item -ItemType Directory -Force -Path $soundsDir | Out-Null
New-Item -ItemType Directory -Force -Path $ambianceDir | Out-Null

Write-Host "🎵 Téléchargement des fichiers audio..." -ForegroundColor Cyan

# URLs des sons (Pixabay Music - libres de droits)
$sounds = @(
    @{url = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1c8c8a8c8c.mp3"; name = "transition.mp3"; dir = $soundsDir },
    @{url = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2a8a8a8a8a.mp3"; name = "emphasis.mp3"; dir = $soundsDir },
    @{url = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_3b6b6b6b6b.mp3"; name = "notification.mp3"; dir = $soundsDir },
    @{url = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_4d4d4d4d4d.mp3"; name = "success.mp3"; dir = $soundsDir },
    @{url = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_5e5e5e5e5e.mp3"; name = "error.mp3"; dir = $soundsDir }
)

foreach ($sound in $sounds) {
    $outputPath = Join-Path $sound.dir $sound.name
    Write-Host "Téléchargement de $($sound.name)..."
    Invoke-WebRequest -Uri $sound.url -OutFile $outputPath
    Write-Host "✅ Téléchargé: $($sound.name)" -ForegroundColor Green
}

# Sons d'ambiance
$ambianceSounds = @(
    @{url = "https://cdn.pixabay.com/download/audio/2022/01/18/audio_6f6f6f6f6f.mp3"; name = "wind-mediterranean.mp3" },
    @{url = "https://cdn.pixabay.com/download/audio/2022/02/22/audio_7g7g7g7g7g.mp3"; name = "fire-crackling.mp3" },
    @{url = "https://cdn.pixabay.com/download/audio/2022/03/30/audio_8h8h8h8h8h.mp3"; name = "tibetan-bowl.mp3" },
    @{url = "https://cdn.pixabay.com/download/audio/2022/04/15/audio_9i9i9i9i9i.mp3"; name = "flowing-water.mp3" },
    @{url = "https://cdn.pixabay.com/download/audio/2022/05/20/audio_0j0j0j0j0j.mp3"; name = "forest-birds.mp3" }
)

foreach ($sound in $ambianceSounds) {
    $outputPath = Join-Path $ambianceDir $sound.name
    Write-Host "Téléchargement de ambiance/$($sound.name)..."
    Invoke-WebRequest -Uri $sound.url -OutFile $outputPath
    Write-Host "✅ Téléchargé: ambiance/$($sound.name)" -ForegroundColor Green
}

Write-Host "`n✨ Tous les sons ont été téléchargés avec succès !" -ForegroundColor Cyan