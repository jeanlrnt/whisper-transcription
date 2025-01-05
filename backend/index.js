const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process'); // Utiliser exec pour appeler le script Python
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middleware pour servir les fichiers statiques du dossier 'upload'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());

// Route pour télécharger le fichier
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const videoPath = req.file.path;

    // Extraction audio avec FFmpeg
    const audioPath = videoPath.replace(/\.[^/.]+$/, '.wav');
    ffmpeg(videoPath)
        .output(audioPath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .audioFrequency(44100)
        .audioChannels(2)
        .on('end', () => {
            // Appel du script Python avec l'environnement virtuel activé
            exec(`/bin/bash -c "source /venv/bin/activate && python3 transcribe.py ${audioPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de la transcription: ${error.message}`);
                    return res.status(500).json({ error: `Erreur lors de la transcription: ${error.message}` });
                }

                // Récupérer la transcription et le fichier SRT
                const output = stdout.trim().split('\n');
                const transcription = output[1];
                const srtFilename = output[2];

                // Envoyer la transcription et le fichier SRT
                const srtFilePath = path.join(__dirname, srtFilename);
                if (fs.existsSync(srtFilePath)) {
                    // Ajouter les sous-titres à la vidéo avec FFmpeg
                    const subtitledVideoPath = videoPath.replace(/\.[^/.]+$/, '_subtitled.mp4');
                    ffmpeg(videoPath)
                        .outputOptions('-vf', `subtitles=${srtFilename}`)
                        .save(subtitledVideoPath)
                        .on('end', () => {
                            res.json({
                                transcription,
                                subtitlesUrl: srtFilename,  // Utiliser un chemin relatif pour l'URL
                                videoUrl: `/uploads/${path.basename(subtitledVideoPath)}`,
                            })
                        })
                        .on('error', (err) => {
                            console.error('Erreur FFmpeg : ', err.message);
                            res.status(500).json({ error: 'Erreur lors de l’intégration des sous-titres' });
                        });
                } else {
                    res.status(500).json({ error: 'Fichier SRT non trouvé' });
                }
            });
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Erreur d\'extraction audio: ' + err.message });
        })
        .run();
});

// Démarrer le serveur sur le port 5000
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
