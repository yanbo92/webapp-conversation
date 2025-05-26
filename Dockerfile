# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY . .

# Remove package-lock.json to avoid package manager conflicts
RUN rm -f package-lock.json
RUN yarn install
RUN yarn build

# Production stage with Nginx
FROM nginx:alpine

# Copy the built static files to Nginx serve directory
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a custom 404 page symlink
RUN ln -s /usr/share/nginx/html/404.html /usr/share/nginx/html/404/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
