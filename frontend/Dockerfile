# Build container
FROM node:8.8.1 as builder
COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

# Output container
FROM nginx:1.18-alpine

ADD ./docker_entrypoint.sh /docker_entrypoint.sh
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.template /etc/nginx/conf.d/default.conf

CMD ["sh", "/docker_entrypoint.sh"]
