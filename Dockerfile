FROM keymetrics/pm2:10-alpine

ARG NODE_ENV=production
ARG PORT=8888

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT

EXPOSE $PORT

WORKDIR /app
COPY package.json yarn.lock .babelrc start.js up.yml /app/
RUN yarn install \
    && yarn cache clean
COPY src/ /app/src
COPY public/ /app/public

CMD [ "pm2-runtime", "start", "up.yml" ]