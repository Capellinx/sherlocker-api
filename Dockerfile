FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Production stage
FROM base AS runner
WORKDIR /app

# Install pnpm and postgresql-client for healthcheck and migrations
RUN npm install -g pnpm && \
    apk add --no-cache postgresql-client wget

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (we need tsx to run TypeScript in production)
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./tsconfig.json

# Generate Prisma Client
RUN pnpm prisma generate

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]