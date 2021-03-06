#!/bin/sh

sed -i \
 -e "s/OAUTH_CLIENT_ID_PLACEHOLDER/$OAUTH_CLIENT_ID/g" \
 -e "s@OAUTH_REDIRECT_URI_PLACEHOLDER@$OAUTH_REDIRECT_URI@g" \
 -e "s@API_HOST_PLACEHOLDER@$API_HOST@g" \
 -e "s/API_PROTOCOL_PLACEHOLDER/$API_PROTOCOL/g" \
 /usr/share/nginx/html/bundle.*.js

nginx -g "daemon off;"
