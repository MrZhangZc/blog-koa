FROM keymetrics/pm2:10-alpine

ARG NODE_ENV=production
ARG PORT=8888

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

EXPOSE $PORT

WORKDIR /app
COPY package.json yarn.lock up.yml /app/
COPY src/ /app/src
RUN yarn install \
    && yarn cache clean

CMD [ "pm2-runtime", "start", "up.yml" ]