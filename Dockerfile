FROM node:14-alpine AS frontend-build

# includes static build of the frontend

WORKDIR /root/web_rtc_gui

COPY frontend/package.json .

COPY frontend/package-lock.json .

RUN npm install

COPY frontend .

# build in such a way that the socket address
# is derived from the URL the browser is using
# and is ignoring additional/changing ports
RUN npm run build

FROM node:14-alpine AS deploy

WORKDIR /root/web_rtc_gui

COPY --from=frontend-build /root/web_rtc_gui/dist /root/web_rtc_gui/frontend_build

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY server.js .

COPY client.js .

ENTRYPOINT [ "node", "client.js" ]
