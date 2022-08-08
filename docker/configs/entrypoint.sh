#!/bin/sh

sed -i "s/WEBRTC_ADDRESS/${WEBRTC_ADDRESS}/" /etc/nginx/conf.d/default.conf
sed -i "s/SPRING_ADDRESS/${SPRING_ADDRESS}/" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
