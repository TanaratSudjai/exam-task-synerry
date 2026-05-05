FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips-dev \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    libgomp1 \
    libatomic1

COPY package*.json ./
RUN npm install

FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libvips-dev \
    libgomp1 \
    libatomic1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm rebuild lightningcss
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libvips \
    libgomp1 \
    libatomic1 \
    libstdc++6 \
    libcairo2 \
    libjpeg62-turbo \
    libpango-1.0-0 \
    libgif7 \
    librsvg2-2 \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

RUN find /app/node_modules -name "*.so*" -exec cp {} /usr/lib/ \; || true
RUN ldconfig || true

EXPOSE 3000

CMD ["node","server.js"]