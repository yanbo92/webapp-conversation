FROM --platform=linux/amd64 node:20-bullseye-slim AS builder

WORKDIR /app

# Add build arguments
ARG NEXT_PUBLIC_APP_ID
ARG NEXT_PUBLIC_APP_KEY
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_API_URL

# Set environment variables for build time
ENV NEXT_PUBLIC_APP_ID=$NEXT_PUBLIC_APP_ID
ENV NEXT_PUBLIC_APP_KEY=$NEXT_PUBLIC_APP_KEY
ENV NEXT_PUBLIC_APP_KEY=$NEXT_PUBLIC_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .

# Remove package-lock.json to avoid package manager conflicts
RUN rm -f package-lock.json
RUN yarn install
RUN yarn build
RUN yarn export

# Production image, copy static files and run nginx
FROM --platform=linux/amd64 nginx:alpine

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
