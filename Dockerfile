FROM node:16-alpine as builder
WORKDIR /app

FROM builder as client
COPY client ./
RUN npm install
EXPOSE 3000
CMD npm run dev

FROM builder as server
COPY server ./
RUN npm install
EXPOSE 9000
CMD npm run dev