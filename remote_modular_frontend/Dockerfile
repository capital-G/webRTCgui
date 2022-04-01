FROM node:14-alpine

WORKDIR /root/remote_modular_frontend

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "serve", "--host 0.0.0.0" ]
