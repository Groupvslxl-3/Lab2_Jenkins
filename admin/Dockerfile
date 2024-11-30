# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies first
COPY . .
RUN npm install

# Copy the rest of the frontend source code

# Build the application
RUN npm run build

# Stage 2: Serve the build with Caddy
FROM caddy:2.7.5-alpine
WORKDIR /app

# Copy the build files from the previous stage
COPY --from=builder /app/dist /usr/share/caddy

# Optional: Copy a custom Caddyfile if needed
COPY Caddyfile /etc/caddy/Caddyfile

# Expose the default Caddy port
EXPOSE 80

# Caddy will serve the static files by default
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
