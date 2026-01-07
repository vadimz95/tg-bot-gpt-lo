FROM postgres:16-alpine

# Локальні налаштування
ENV POSTGRES_DB=warehouse
ENV POSTGRES_USER=botuser
ENV POSTGRES_PASSWORD=botpassword

# Кодування та локаль
ENV LANG=C.UTF-8

EXPOSE 5432

COPY docker/postgres/init.sql /docker-entrypoint-initdb.d/

# # ---------- BUILD STAGE ----------
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY tsconfig.json ./
# COPY src ./src

# RUN npm run build


# # ---------- RUNTIME STAGE ----------
# FROM node:20-alpine

# WORKDIR /app

# ENV NODE_ENV=production

# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist

# # папка для Excel + фото
# RUN mkdir -p /app/data

# CMD ["node", "dist/bot.js"]
