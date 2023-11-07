FROM node:18-alpine as builder
WORKDIR /app

FROM builder as client
COPY client ./
RUN npm install
EXPOSE 3000
CMD npm run dev -- --host

FROM builder as server
COPY server ./
RUN npm install
RUN npm run build
EXPOSE 9000
CMD npm run start
