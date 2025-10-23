# ---------- build stage ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-bookworm-slim
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]