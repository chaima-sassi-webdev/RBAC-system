#1. Choisir l'image de base Node.js
FROM node:20-alpine

#2. Définir le dossier de travail dans le conteneur
WORKDIR /app

#3. Copier les fichiers de dépendances
COPY package*.json ./

#4. Installer les dépendances
RUN npm install

#5. Copier le reste du code backend 
COPY . .

#6. Exposer le port utilisé par Express
EXPOSE 5000

#7. Lancer l'application
CMD ["npm", "start"]