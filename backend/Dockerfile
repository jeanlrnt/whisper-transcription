# Utiliser une image Node.js
FROM node:18

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Créer un environnement virtuel Python
RUN python3 -m venv /venv

# Activer l'environnement virtuel et installer Whisper
RUN /venv/bin/pip install git+https://github.com/openai/whisper.git

# Créer un répertoire de travail
WORKDIR /app

# Copier le code source du backend
COPY . .

# Installer les dépendances Node.js
RUN npm install

# Exposer le port utilisé par le backend
EXPOSE 5000

# Définir la commande pour activer l'environnement virtuel et exécuter Node.js
CMD ["/bin/bash", "-c", "source /venv/bin/activate && node index.js"]
