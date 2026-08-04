# Stage 1: Build
FROM node:18-alpine AS builder

# Create non-root user during build stage
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package.json and package-lock.json
COPY --chown=nodejs:nodejs package*.json ./

# Install dependencies as non-root user
RUN chown -R nodejs:nodejs /app && \
    npm ci --omit=dev

# Copy the rest of the application as non-root user
COPY --chown=nodejs:nodejs . .

# Build the application as non-root user
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server to serve the built app
RUN npm install -g serve

# Create non-root user for security (same UID as builder)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder stage with correct ownership
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Set secure file permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]