FROM --platform=linux/amd64 node:20-bullseye-slim

WORKDIR /app

COPY . .

# Remove package-lock.json to avoid package manager conflicts
RUN rm -f package-lock.json
RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn","start"]
