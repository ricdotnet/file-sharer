FROM node:24-alpine3.22 AS builder

WORKDIR /builder

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine3.22 AS production

WORKDIR /app

ARG NEW_VERSION
RUN echo "$NEW_VERSION" > version

COPY --from=builder --chown=node:node /builder/.output /app
COPY --from=mwader/static-ffmpeg:7.1.1 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:7.1.1 /ffprobe /usr/local/bin/

USER node
EXPOSE 3000

ENTRYPOINT ["node", "./server/index.mjs"]
