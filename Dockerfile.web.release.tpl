FROM node:14.19.3

RUN yarn global add serve
RUN mkdir /app
COPY web/build /app/
WORKDIR /app

EXPOSE 5000
ENV PORT="5000"
CMD serve -n -l tcp://0.0.0.0:5000
