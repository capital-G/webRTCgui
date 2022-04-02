FROM node:14-alpine

WORKDIR /root/remote_modular_client

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "node", "client.js" ]
