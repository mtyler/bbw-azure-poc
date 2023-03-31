ARG BUILD=local
# ---- > Build
# This first section builds the app on a "thicker" image
FROM node:14.21-bullseye AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
COPY app.js /usr/src/app
COPY server.js /usr/src/app
RUN npm ci --omit=dev

# ---- > Package
# This section is used to eliminate build dependancies and 
# create a smaller, tighter image for portability 
FROM node:14.21-bullseye-slim
ARG BUILD
ENV BUILD=$BUILD
ENV NODE_ENV production
USER node 
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node app.js /usr/src/app
COPY --chown=node:node server.js /usr/src/app
CMD [ "node", "server.js" ]