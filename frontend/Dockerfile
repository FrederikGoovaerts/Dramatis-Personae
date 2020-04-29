# Build container
FROM node:8.8.1 as builder
COPY ./frontend /app
WORKDIR /app

RUN npm install
RUN npm run build

# Output container
FROM nginx:1.18-alpine

ADD ./frontend/docker_entrypoint.sh /docker_entrypoint.sh
COPY --from=builder /app/build /usr/share/nginx/html

CMD ["sh", "/docker_entrypoint.sh"]
