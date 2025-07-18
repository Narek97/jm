# Step 1: Build stage
FROM node:20.10.0-alpine AS builder

ARG VITE_API_URL=${VITE_API_URL}
ARG VITE_APP_URL=${VITE_APP_URL}
ARG VITE_SVG_URL=${VITE_SVG_URL}
ARG VITE_AUTHORIZATION_URL=${VITE_AUTHORIZATION_URL}
ARG VITE_CLIENT_ID=${VITE_CLIENT_ID}
ARG VITE_APP_KEY=${VITE_APP_KEY}
ARG VITE_CALLBACK_URL=${VITE_CALLBACK_URL}
ARG VITE_COOKIE_DOMAIN=${VITE_COOKIE_DOMAIN}
ARG VITE_AWS_URL=${VITE_AWS_URL}
ARG VITE_HOST=${VITE_HOST}
ARG VITE_QP_API=${VITE_QP_API}

# Remove cache
RUN apk add --no-cache \
    git python3 py3-pip make g++ \
    cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

ENV PYTHON=/usr/bin/python3

# Set the working directory
WORKDIR /app

# Copy configuration files
COPY package.json yarn.lock ./

# Manually install 'canvas' with prebuild support
RUN yarn add -D canvas

# Install dependencies (all dependencies needed for the build)
RUN yarn cache clean && yarn install --frozen-lockfile --production=false

# Copy the rest of the application files
COPY . .

# Generate codegen
RUN yarn codegen

# Check lint
RUN yarn lint

# Build the React.js application
RUN yarn build

# Check test
RUN yarn test

# Remove node_modules
RUN rm -rf node_modules

# Install production node_modules
RUN yarn install --production

# Step 2: Production stage
FROM node:20.10.0-alpine AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/routes ./src/routes

# Expose the port for the React.js server
EXPOSE 3003

# Start the React.js application
CMD ["sh", "-c", "yarn preview"]
