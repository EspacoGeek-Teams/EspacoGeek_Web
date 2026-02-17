## Next.js standalone multi-stage Dockerfile
# Builder: install deps and build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production || npm install --production

# Copy rest of source
COPY . .

# Build Next.js (produces .next/standalone)
RUN npm run build

## Runner: lightweight Node image running the standalone server
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output (contains server.js and node_modules required)
COPY --from=builder /app/.next/standalone/ .

# Copy next static assets and public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the application port
EXPOSE 3000

# Optional healthcheck (container must respond on /)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the Next.js standalone server
CMD ["node", "server.js"]
