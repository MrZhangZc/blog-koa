FROM keymetrics/pm2:18-jessie

RUN pm2 install pm2-logrotate && \
    pm2 set pm2-logrotate:max_size 1G && \
    pm2 set pm2-logrotate:compress true && \
    pm2 set pm2-logrotate:rotateInterval '59 59 23 * * *' && \
    pm2 set pm2-logrotate:retain 30 && \
    pm2 set pm2-logrotate:dateFormat 'YYYY-MM-DD'

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