FROM node:18 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]