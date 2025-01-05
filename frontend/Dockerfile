# Utiliser l'image officielle Node.js
FROM node:18-alpine

# Créer un répertoire de travail
WORKDIR /app

# Copier le package.json et installer les dépendances
COPY package.json .
RUN npm install

# Copier tout le code source
COPY . .

# Construire le projet
RUN npm run build

# Exposer le port de l'application Vue.js
EXPOSE 8080

# Lancer le serveur
CMD ["npm", "run", "serve"]
