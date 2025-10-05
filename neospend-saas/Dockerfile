# ---- Base image ----
FROM node:20-alpine AS base

# ---- Arbeitsverzeichnis ----
WORKDIR /app

# ---- Abhängigkeiten installieren ----
COPY package*.json ./
RUN npm ci

# ---- Projektdateien kopieren ----
COPY . .

# ---- Build ----
RUN npm run build

# ---- Port freigeben ----
EXPOSE 3000

# ---- Startbefehl ----
CMD ["npm", "run", "start"]
