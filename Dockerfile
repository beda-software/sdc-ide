FROM node:lts as builder

RUN yarn global add serve

ADD web/build /app
ADD web/public/docker_entrypoint.sh /app
WORKDIR /app

EXPOSE 5000
ENV PORT="5000"
CMD /app/docker_entrypoint.sh
