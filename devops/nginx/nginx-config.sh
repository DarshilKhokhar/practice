#!/bin/bash

sed -i 's/@application_port/'"$APP_PORT"'/g' nginx.conf
sed -i 's/@container_port/'"$CONTAINER_PORT"'/g' nginx.conf
sed -i 's/@application/'"$SERVER_APP_NAME"'/g' nginx.conf
sed -i 's/@server_name/'"$APP_DOMAIN"'/g' nginx.conf
rm -f /etc/nginx/nginx.conf
cp nginx.conf /etc/nginx/nginx.conf
