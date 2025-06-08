FROM node:18.12.0-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/client/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install --force


# RUN npm run build
COPY dist/ ./dist
#COPY node_modules/ ./node_modules
COPY app.js ./app.js
COPY --chown=node:node . .
EXPOSE 9000
ENV PORT=9000
ENV HOST=0.0.0.0
CMD [ "node", "app.js"]
