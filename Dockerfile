FROM alpine:latest

COPY . /app
WORKDIR /app

RUN apk add --update --no-cache nginx rsync nodejs-current && \
    wget -O - https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node && \
    pnpm install && \
    pnpm run build && \
    mkdir -p /run/nginx && \
    mv /app/nginx.conf /etc/nginx/conf.d/default.conf && \
    mkdir -p /usr/share/nginx/html/ && \
    rsync -a /app/dist/ /usr/share/nginx/html/ && \
    pnpm store prune && apk del rsync nodejs-current && \
    rm -rf /app

CMD nginx -g 'daemon off;'
