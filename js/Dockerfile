FROM node:14-alpine AS build

WORKDIR /root/web_rtc_gui

ADD package.json .
ADD package-lock.json .

RUN npm install

COPY . .

ARG VUE_APP_SOCKET_ENDPOINT

RUN [ "npm", "run",  "build"]

ENTRYPOINT [ "npm", "run", "server" ]
