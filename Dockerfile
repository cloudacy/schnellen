FROM alpine:latest

COPY . /app
WORKDIR /app

RUN apk add --update --no-cache nginx rsync nodejs yarn && \
    yarn config set registry https://cpm.cloudacy.io/ && \
    yarn install && \
    yarn run build && \
    mkdir -p /run/nginx && \
    mv /app/nginx.conf /etc/nginx/conf.d/default.conf && \
    mkdir -p /usr/share/nginx/html/ && \
    rsync -a /app/dist/ /usr/share/nginx/html/ && \
    yarn cache clean && apk del rsync nodejs yarn && \
    rm -rf /app

CMD nginx -g 'daemon off;'
