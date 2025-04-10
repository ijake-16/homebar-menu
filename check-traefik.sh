#!/bin/bash

echo "===== Checking Traefik Network ====="
docker network inspect traefik-proxy

echo -e "\n===== Checking Traefik Containers ====="
docker ps | grep traefik

echo -e "\n===== Checking Homebar Containers ====="
docker ps | grep homebar

# If Traefik container found, check its logs
TRAEFIK_CONTAINER=$(docker ps -q --filter name=traefik)
if [ ! -z "$TRAEFIK_CONTAINER" ]; then
    echo -e "\n===== Latest Traefik Logs ====="
    docker logs $TRAEFIK_CONTAINER --tail 30
    
    echo -e "\n===== Looking for bar.buttercrab.net in logs ====="
    docker logs $TRAEFIK_CONTAINER | grep -i bar.buttercrab.net
else
    echo -e "\n⚠️ No Traefik container found!"
    echo "You need to have Traefik running for the routing to work."
    echo "Make sure Traefik is started and connected to the traefik-proxy network"
fi

# Check if applications are exposed
echo -e "\n===== Application Network Configuration ====="
docker inspect homebar-menu_frontend_1 | grep -A 20 "Networks"
docker inspect homebar-menu_backend_1 | grep -A 20 "Networks" 