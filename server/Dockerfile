# ===== Stage 1: build =====
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# ===== Stage 2: production =====
FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/src/prisma ./dist/prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 8001

CMD ["node", "dist/app.js"]