# Traefik Setup Guide

If your containers aren't accessible through the domain, the issue may be that Traefik isn't properly configured or running. This guide will help you set up Traefik correctly.

## Check Traefik Status

First, run the provided script to check Traefik's status:

```bash
chmod +x check-traefik.sh
./check-traefik.sh
```

## Setting Up Traefik (If Not Already Running)

If Traefik isn't running, follow these steps:

1. Create a directory for Traefik configuration:

```bash
mkdir -p traefik
cd traefik
```

2. Create a configuration file for Traefik:

```bash
cat > traefik.yml << EOF
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: traefik-proxy

certificatesResolvers:
  le:
    acme:
      email: your-email@example.com  # Replace with your email
      storage: acme.json
      httpChallenge:
        entryPoint: web
EOF
```

3. Create an empty ACME file for Let's Encrypt certificates:

```bash
touch acme.json
chmod 600 acme.json
```

4. Create a Docker Compose file for Traefik:

```bash
cat > docker-compose.yml << EOF
version: '3'

services:
  traefik:
    image: traefik:v2.9
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard - should be secured in production
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    networks:
      - traefik-proxy

networks:
  traefik-proxy:
    external: true
EOF
```

5. Create the traefik-proxy network if it doesn't exist:

```bash
docker network create traefik-proxy
```

6. Start Traefik:

```bash
docker-compose up -d
```

7. Go back to your homebar-menu directory and restart your application:

```bash
cd /path/to/homebar-menu
docker-compose down
docker-compose up -d --build
```

## Verifying the Setup

After starting Traefik and your application:

1. You should be able to access the Traefik dashboard at http://your-server-ip:8080

2. Check if your domain is registered with Traefik:
   - Look at the "HTTP" section in the dashboard
   - You should see routers for both frontend and backend with the rule containing "bar.buttercrab.net"

3. Ensure DNS is properly configured:
   - Run `nslookup bar.buttercrab.net`
   - Verify it points to your server's IP address

## Common Traefik Issues

1. **Certificate issues**: If HTTPS isn't working, it may be a problem with the Let's Encrypt challenge. Check Traefik logs:
   ```bash
   docker logs traefik | grep -i certificate
   ```

2. **Network connectivity**: Ensure containers can communicate with each other:
   ```bash
   docker network inspect traefik-proxy
   ```
   Both Traefik and your application containers should be listed.

3. **Entrypoints mismatch**: Ensure the entrypoints in your application's labels match those defined in Traefik's configuration.

4. **Docker socket permission**: Traefik needs access to the Docker socket to discover containers. Ensure proper permissions. 