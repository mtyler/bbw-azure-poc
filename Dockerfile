# ---- > Build
FROM node:latest AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
COPY app.js /usr/src/app
COPY ./src/ /usr/src/app
RUN npm ci --only=production

# ---- > Package
FROM node:18.0-bullseye-slim
ENV NODE_ENV production
USER node 
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node app.js /usr/src/app
CMD [ "node", "app.js" ]