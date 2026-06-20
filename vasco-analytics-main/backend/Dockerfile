# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Skip Puppeteer Chromium download (use system Chromium in runner)
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Install system Chromium for Puppeteer scraping scripts
RUN apk add --no-cache chromium

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3001

# Run Prisma migrations then start the app
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/src/main"]
