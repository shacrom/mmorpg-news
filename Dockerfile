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

# Copiar la build y node_modules del contenedor builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4322

ENV HOST=0.0.0.0
ENV PORT=4322

# Comando para iniciar Astro SSR
CMD ["node", "./dist/server/entry.mjs"]