FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache openssl

# Criar usuário e grupo não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

# NOTE: This image expects required environment variables (e.g. AWS, JWT and other settings)
# to be provided at runtime, for example using:
#   docker run --env-file .env <image>
# or via docker-compose / your orchestrator, based on .env.example in the repository.
CMD ["node", "dist/main"]