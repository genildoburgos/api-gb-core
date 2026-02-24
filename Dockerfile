FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# NOTE: This image expects required environment variables (e.g. AWS, JWT and other settings)
# to be provided at runtime, for example using:
#   docker run --env-file .env <image>
# or via docker-compose / your orchestrator, based on .env.example in the repository.
CMD ["node", "dist/main"]