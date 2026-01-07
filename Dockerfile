FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash postgresql-client

COPY package*.json ./
RUN npm install ts-node typescript

COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY entrypoint.sh /app/entrypoint.sh

RUN mkdir -p data errors
RUN chmod +x /app/entrypoint.sh

# Компільуємо тільки src
RUN npx tsc --project tsconfig.json

ENV NODE_ENV=production

CMD ["/app/entrypoint.sh"]
