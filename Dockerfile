FROM node:20-alpine3.20 AS builder

WORKDIR /builder

COPY ./package.json /builder/package.json
COPY ./package-lock.json /builder/package-lock.json

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine3.20 AS production

WORKDIR /app

ARG NEW_VERSION
RUN echo $NEW_VERSION > version

COPY --from=builder /builder/.output /app
COPY --from=mwader/static-ffmpeg:7.1.1 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:7.1.1 /ffprobe /usr/local/bin/

EXPOSE 3000

ENTRYPOINT ["node", "./server/index.mjs"]
