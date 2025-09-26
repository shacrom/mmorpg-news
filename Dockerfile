# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir la versión SSR
RUN npm run build

# Etapa de producción
FROM node:20-alpine
WORKDIR /app

# Copiar la build del contenedor builder
COPY --from=builder /app ./

EXPOSE 4321

# Comando para iniciar Astro en modo preview (producción)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4321", "--allowed-hosts", "zonagamer.online,www.zonagamer.online"]