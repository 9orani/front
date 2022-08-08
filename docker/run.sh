#!/bin/sh

docker build -t gorani:prod -f front.dockerfile .

docker-compose up -d
