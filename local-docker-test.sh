#!/bin/bash
      
# This is a quick and dirty script to assist manually testing to ensure
# that the docker image builds and runs locally
docker stop poc
docker remove poc
docker build --progress=plain --no-cache -t local/poc:100 . --build-arg BUILD='local-docker'
docker run -d --rm --name poc -p 3000:3000 local/poc:100
echo "Waiting for container to start..."
sleep 5
curl http://localhost:3000
echo "\n\n"
echo "Run `docker stop poc` when finished"
      