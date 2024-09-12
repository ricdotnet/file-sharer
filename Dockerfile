FROM node:20 AS build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY ./.yarnrc.yml /app/.yarnrc.yml

RUN corepack enable
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000

CMD ["node", "./.output/server/index.mjs"]
