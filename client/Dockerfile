FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN rm -rf node_modules/.cache

RUN npm run build


RUN npm install -g serve

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173" ]