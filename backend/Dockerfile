FROM node:14-alpine

WORKDIR /root/remote_modular

RUN apk add curl

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "node", "server.js" ]
