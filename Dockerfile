FROM node:20-alpine

# PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY entrypoint.sh ./entrypoint.sh

RUN npm run build

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
