import whisper
import os
import sys
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning, message="FP16 is not supported on CPU")

# Charger le modèle Whisper
model = whisper.load_model("base")

# Récupérer le chemin du fichier audio passé en argument
audio_path = sys.argv[1]

# Vérifiez que le fichier audio existe
if not os.path.exists(audio_path):
    print(f"Erreur : le fichier audio {audio_path} n'existe pas.")
    sys.exit(1)

# Transcrire l'audio
result = model.transcribe(audio_path)

# Afficher la transcription dans la console
transcription = result['text']

def generate_srt(res, audio_filename):
    str_filename = audio_filename.replace('.wav', '.srt')
    try:
        with open(str_filename, 'w') as srt_file:
            segments = res['segments']
            for i, segment in enumerate(segments, start=1):
                start = segment['start']
                end = segment['end']
                text = segment['text']
                srt_file.write(f"{i}\n")
                srt_file.write(f"{format_time(start)} --> {format_time(end)}\n")
                srt_file.write(f"{text}\n\n")
            srt_file.close()
        print(f"Fichier SRT créé : {str_filename}")
    except Exception as e:
        print(f"Erreur lors de la génération du fichier SRT : {e}")
    return str_filename

# Fonction pour formater le temps en SRT (hh:mm:ss,SSS)
def format_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{int(seconds):02},{milliseconds:03}"

# Générer le fichier SRT
srt_filename = generate_srt(result, audio_path)

# Retourner la transcription et le nom du fichier SRT
print(transcription)
print(srt_filename)  # On renvoie également le nom du fichier SRT