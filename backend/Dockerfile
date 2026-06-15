# 1. Base image builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo as de desenvolvimento necessárias para build)
RUN npm ci

# Copiar o resto do código-fonte
COPY . .

# Gerar o client do Prisma e rodar o build do NestJS
RUN npx prisma generate
RUN npm run build

# 2. Imagem final enxuta
FROM node:20-alpine AS production

WORKDIR /app

# Variável de ambiente essencial para produção
ENV NODE_ENV=production

# Copiar do builder apenas os arquivos necessários para rodar
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# O Cloud Run expõe automaticamente a porta através da variável PORT (padrão 8080)
# Definimos 8080 como fallback caso não venha
ENV PORT=8080
EXPOSE 8080

# Rodar as migrações (opcional, se quiser automatizar no startup) e iniciar a aplicação
# Nota: "npm run start:prod" roda "node dist/src/main"
CMD ["npm", "run", "start:prod"]
