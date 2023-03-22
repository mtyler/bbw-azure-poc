ARG BUILD=local
# ---- > Build
FROM node:14.21-bullseye AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
COPY app.js /usr/src/app
COPY server.js /usr/src/app
RUN npm ci --omit=dev

# ---- > Package
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