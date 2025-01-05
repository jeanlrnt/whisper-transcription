@echo off
echo ============================
echo  Setup de l'environnement Python
echo ============================

:: Vérification de Python
python --version
IF ERRORLEVEL 1 (
    echo [Erreur] Python n'est pas installé. Veuillez l'installer depuis https://www.python.org/downloads/.
    pause
    exit /b
)

:: Création de l'environnement virtuel
echo Création de l'environnement virtuel...
python -m venv venv

:: Activation de l'environnement virtuel
echo Activation de l'environnement virtuel...
call venv\Scripts\activate

:: Installation de Whisper et des dépendances
echo Installation de Whisper...
pip install openai-whisper

echo ============================
echo  Setup terminé avec succès !
echo ============================

:: Pause pour laisser l'utilisateur voir les résultats
pause
