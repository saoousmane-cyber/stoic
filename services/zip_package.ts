// AURA & LOGOS - Service de création de package ZIP
// Regroupe MP3, SRT, JSON et images dans une archive

import { createWriteStream, ReadStream } from 'fs'
import { Readable } from 'stream'

interface ZipPackageParams {
  audioBuffer: Buffer
  audioFilename: string
  srtContent: string
  srtFilename: string
  metadata: PackageMetadata
  includeImages?: boolean
  imagesBuffers?: Array<{ buffer: Buffer; filename: string }>
  includeVTT?: boolean
  vttContent?: string
}

interface PackageMetadata {
  title: string
  niche: string
  language: string
  durationSeconds: number
  generatedAt: string
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
  wordCount?: number
  modelUsed?: string
  cost?: number
}

interface ZipPackageResult {
  success: boolean
  zipBuffer?: Buffer
  zipSizeBytes?: number
  includedFiles: string[]
  error?: string
}

export async function createPackage(params: ZipPackageParams): Promise<ZipPackageResult> {
  const {
    audioBuffer,
    audioFilename,
    srtContent,
    srtFilename,
    metadata,
    includeImages = false,
    imagesBuffers = [],
    includeVTT = false,
    vttContent
  } = params

  const includedFiles: string[] = []
  const fileBuffers: Array<{ buffer: Buffer; filename: string }> = []

  try {
    // 1. Ajout du fichier audio
    const audioFileName = sanitizeFilename(audioFilename) + '.mp3'
    fileBuffers.push({ buffer: audioBuffer, filename: audioFileName })
    includedFiles.push(audioFileName)

    // 2. Ajout du fichier SRT
    const srtFileName = sanitizeFilename(srtFilename) + '.srt'
    fileBuffers.push({ buffer: Buffer.from(srtContent, 'utf-8'), filename: srtFileName })
    includedFiles.push(srtFileName)

    // 3. Ajout du fichier VTT (optionnel)
    if (includeVTT && vttContent) {
      const vttFileName = sanitizeFilename(srtFilename) + '.vtt'
      fileBuffers.push({ buffer: Buffer.from(vttContent, 'utf-8'), filename: vttFileName })
      includedFiles.push(vttFileName)
    }

    // 4. Ajout des métadonnées (JSON)
    const metadataJson = JSON.stringify(metadata, null, 2)
    const metadataFileName = 'metadata.json'
    fileBuffers.push({ buffer: Buffer.from(metadataJson, 'utf-8'), filename: metadataFileName })
    includedFiles.push(metadataFileName)

    // 5. Ajout des images (optionnel)
    if (includeImages && imagesBuffers.length > 0) {
      for (let i = 0; i < imagesBuffers.length; i++) {
        const img = imagesBuffers[i]
        const imgFileName = `image_${(i + 1).toString().padStart(2, '0')}_${img.filename}`
        fileBuffers.push({ buffer: img.buffer, filename: imgFileName })
        includedFiles.push(imgFileName)
      }
    }

    // 6. Création du ZIP
    const zipBuffer = await createZipBuffer(fileBuffers)

    return {
      success: true,
      zipBuffer,
      zipSizeBytes: zipBuffer.length,
      includedFiles
    }

  } catch (error) {
    console.error('Zip creation error:', error)
    return {
      success: false,
      includedFiles: [],
      error: error instanceof Error ? error.message : 'Erreur de création ZIP'
    }
  }
}

// Version simplifiée (pour développement local sans dépendance JSZip)
export async function createPackageSimple(params: ZipPackageParams): Promise<ZipPackageResult> {
  // Pour Phase 1, on ne crée pas vraiment de ZIP
  // On retourne juste un buffer factice
  console.log('Simple ZIP package created (mock)')
  
  return {
    success: true,
    zipBuffer: Buffer.from('mock-zip-content'),
    zipSizeBytes: 1024,
    includedFiles: ['audio.mp3', 'subtitles.srt', 'metadata.json']
  }
}

// Création du ZIP (avec JSZip)
async function createZipBuffer(files: Array<{ buffer: Buffer; filename: string }>): Promise<Buffer> {
  // Note: Ajouter "npm install jszip" au projet
  // Cette fonction sera implémentée quand JSZip sera installé
  
  // Version mock pour Phase 1
  console.log(`Creating ZIP with ${files.length} files`)
  return Buffer.from('mock-zip-content')
}

// Création d'un buffer ZIP manuellement (sans librairie)
function createSimpleZip(files: Array<{ buffer: Buffer; filename: string }>): Buffer {
  // Format ZIP simple (local file headers)
  // Pour Phase 1, on utilise une approche simplifiée
  // En production, utiliser JSZip
  
  const chunks: Buffer[] = []
  
  for (const file of files) {
    // En-tête local file (signature 0x04034b50)
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)  // Signature
    localHeader.writeUInt16LE(20, 4)           // Version needed
    localHeader.writeUInt16LE(0, 6)            // General purpose bit
    localHeader.writeUInt16LE(0, 8)            // Compression method (store)
    localHeader.writeUInt16LE(0, 10)           // File modification time
    localHeader.writeUInt16LE(0, 12)           // File modification date
    localHeader.writeUInt32LE(0, 14)           // CRC-32 (0 pour store)
    localHeader.writeUInt32LE(file.buffer.length, 18)  // Compressed size
    localHeader.writeUInt32LE(file.buffer.length, 22)  // Uncompressed size
    localHeader.writeUInt16LE(file.filename.length, 26) // Filename length
    localHeader.writeUInt16LE(0, 28)           // Extra field length
    
    chunks.push(localHeader)
    chunks.push(Buffer.from(file.filename, 'utf-8'))
    chunks.push(file.buffer)
  }
  
  // Central directory (simplifié)
  const centralDirStart = chunks.reduce((sum, buf) => sum + buf.length, 0)
  const centralDir: Buffer[] = []
  
  let offset = 0
  for (const file of files) {
    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)  // Signature
    centralHeader.writeUInt16LE(20, 4)           // Version made by
    centralHeader.writeUInt16LE(20, 6)           // Version needed
    centralHeader.writeUInt16LE(0, 8)            // General purpose
    centralHeader.writeUInt16LE(0, 10)           // Compression method
    centralHeader.writeUInt16LE(0, 12)           // File mod time
    centralHeader.writeUInt16LE(0, 14)           // File mod date
    centralHeader.writeUInt32LE(0, 16)           // CRC-32
    centralHeader.writeUInt32LE(file.buffer.length, 20)  // Compressed size
    centralHeader.writeUInt32LE(file.buffer.length, 24)  // Uncompressed size
    centralHeader.writeUInt16LE(file.filename.length, 28) // Filename length
    centralHeader.writeUInt16LE(0, 30)            // Extra field length
    centralHeader.writeUInt16LE(0, 32)            // File comment length
    centralHeader.writeUInt16LE(0, 34)            // Disk number start
    centralHeader.writeUInt16LE(0, 36)            // Internal attributes
    centralHeader.writeUInt32LE(0, 38)            // External attributes
    centralHeader.writeUInt32LE(offset, 42)       // Relative offset
    
    centralDir.push(centralHeader)
    centralDir.push(Buffer.from(file.filename, 'utf-8'))
    
    offset += 30 + file.filename.length + file.buffer.length
  }
  
  // End of central directory
  const endHeader = Buffer.alloc(22)
  endHeader.writeUInt32LE(0x06054b50, 0)  // Signature
  endHeader.writeUInt16LE(0, 4)            // Number of this disk
  endHeader.writeUInt16LE(0, 6)            // Disk where central dir starts
  endHeader.writeUInt16LE(files.length, 8)  // Number of central dir entries on this disk
  endHeader.writeUInt16LE(files.length, 10) // Total number of entries
  const centralDirSize = centralDir.reduce((sum, buf) => sum + buf.length, 0)
  endHeader.writeUInt32LE(centralDirSize, 12)  // Size of central directory
  endHeader.writeUInt32LE(centralDirStart, 16) // Offset of central directory
  endHeader.writeUInt16LE(0, 20)               // Comment length
  
  centralDir.push(endHeader)
  
  const allChunks = [...chunks, ...centralDir]
  return Buffer.concat(allChunks as unknown as Uint8Array[])
}

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Génération du nom du package
export function generatePackageName(niche: string, topic: string, date: Date = new Date()): string {
  const dateStr = date.toISOString().slice(0, 19).replace(/:/g, '-')
  const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)
  return `${niche}-${safeTopic}-${dateStr}`
}