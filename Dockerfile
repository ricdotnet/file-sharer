FROM node:20-alpine3.20 AS builder

WORKDIR /builder

COPY ./package.json /builder/package.json
COPY ./yarn.lock /builder/yarn.lock
COPY ./.yarnrc.yml /builder/.yarnrc.yml

RUN corepack enable && yarn install

COPY . .

RUN yarn build

FROM node:20-alpine3.20 AS production

WORKDIR /app

COPY --from=builder /builder/.output /app
COPY --from=mwader/static-ffmpeg:7.1.1 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:7.1.1 /ffprobe /usr/local/bin/

EXPOSE 3000

ENTRYPOINT ["node", "./server/index.mjs"]