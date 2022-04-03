FROM node:14-alpine

WORKDIR /root/web_rtc_gui

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "serve", "--host 0.0.0.0" ]
