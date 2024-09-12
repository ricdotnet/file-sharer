FROM node:20 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN corepack enable
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
