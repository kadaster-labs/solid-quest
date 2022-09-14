#!/bin/sh
docker run --rm -d -v $PWD/data:/data:z -v $PWD/config:/config:z -p 3001:3001 --name solid-community-server -it solidproject/community-server:latest -p 3001
