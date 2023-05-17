# Build stage
FROM node:16-alpine

# Set current working directory
WORKDIR /app

# Recipes from https://github.com/CommunitySolidServer/recipes
COPY ./package*.json /app/

RUN npm ci

COPY ./config-*.json /app/

EXPOSE 3000

ENTRYPOINT ["npx", "community-solid-server", "-c", "config-mashlib.json"]
