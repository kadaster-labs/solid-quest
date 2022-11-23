# Build stage
FROM node:lts-alpine

# Set current working directory
WORKDIR /app

# Recipes from https://github.com/CommunitySolidServer/recipes
COPY ./ /app

RUN npm ci

EXPOSE 3000

ENTRYPOINT ["npx", "community-solid-server", "-c", "config-mashlib.json"]
