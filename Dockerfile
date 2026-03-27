# ---------- Builder Stage ----------
FROM node:20-bookworm AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY tsconfig.json eslint.config.mjs ./
COPY src ./src

# Build project
RUN npm run build


# ---------- Runtime Stage ----------
FROM mcr.microsoft.com/playwright:v1.53.2-noble

WORKDIR /app

# Copy only required files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Optional (only if needed at runtime)
COPY --from=builder /app/src ./src

# Create report folders
RUN mkdir -p /app/reports/allure-results /app/reports/videos

# Install browsers (already included, but safe)
RUN npx playwright install --with-deps chromium

# Expose API port
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
