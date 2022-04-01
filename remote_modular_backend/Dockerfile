FROM node:14-alpine

WORKDIR /root/remote_modular

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "node", "server.js" ]
