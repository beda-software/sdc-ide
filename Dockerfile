FROM node:12.16.1 as builder

RUN mkdir -p /app/web
RUN mkdir -p /app/mobile
RUN mkdir -p /app/shared

WORKDIR /app

ADD lerna.json lerna.json

ADD package.json package.json
ADD web/package.json web/package.json
ADD mobile/package.json mobile/package.json
ADD yarn.lock yarn.lock
ADD tsconfig.base.json tsconfig.base.json

ADD shared /app/shared

RUN yarn --network-concurrency=1

ADD . /app

ARG TIER
RUN cp web/src/services/initialize.${TIER}.ts web/src/services/initialize.ts

RUN yarn build
