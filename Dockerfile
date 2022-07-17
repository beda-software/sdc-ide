FROM node:14.19.3 as builder

RUN mkdir -p /app/web
RUN mkdir -p /app/shared

WORKDIR /app

ADD lerna.json lerna.json

ADD package.json package.json
ADD web/package.json web/package.json
ADD yarn.lock yarn.lock
ADD tsconfig.base.json tsconfig.base.json
ADD tsconfig.json tsconfig.json

ADD shared /app/shared
ADD sdc-qrf /app/sdc-qrf

RUN yarn
RUN yarn global add serve

ADD . /app

ARG BASE_URL
RUN echo "{\"BASE_URL\": \"$BASE_URL\"}" > web/src/services/config.json

ARG TIER
RUN cp web/src/services/initialize.${TIER}.ts web/src/services/initialize.ts

WORKDIR /app/web/build

EXPOSE 5000
ENV PORT="5000"
CMD serve -n -l tcp://0.0.0.0:5000

RUN yarn build
