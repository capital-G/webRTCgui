FROM node:14-alpine

WORKDIR /root/web_rtc_gui

RUN apk add curl

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY server.js .

COPY client.js .

ENTRYPOINT [ "node", "client.js" ]
