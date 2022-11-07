# Build stage
FROM node:lts-alpine AS build

# Set current working directory
WORKDIR /community-server-recipes

# Recipes from https://github.com/CommunitySolidServer/recipes
COPY ./Recipes /community-server-recipes

# Pick the configuration of your choice, and install its dependencies
RUN cd mashlib   # or penny

WORKDIR /community-server-recipes/mashlib

RUN npm ci --omit=dev

EXPOSE 3000

ENTRYPOINT ["npx", "community-solid-server"]
