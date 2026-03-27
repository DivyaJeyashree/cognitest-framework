FROM node:20-bookworm AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json eslint.config.mjs ./
COPY src ./src
RUN npm run build

FROM mcr.microsoft.com/playwright:v1.53.2-noble
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
RUN mkdir -p /app/reports/allure-results /app/reports/videos
RUN npx playwright install --with-deps chromium
EXPOSE 3000
CMD ["node", "dist/main.js"]
