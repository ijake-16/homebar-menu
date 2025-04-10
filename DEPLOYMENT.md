# Homebar Menu Deployment Guide

This guide explains how to deploy the Homebar Menu application using Docker Compose with Traefik.

## Prerequisites

- Docker and Docker Compose installed on your server
- A running Traefik reverse proxy with Docker provider enabled
- Git (to clone the repository)
- A MongoDB Atlas account and database

## MongoDB Atlas Setup

Both development and production environments connect to the same MongoDB Atlas database to ensure consistency.

1. Set up your MongoDB Atlas cluster if you haven't already:
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Create a database user with appropriate permissions
   - Whitelist your IP addresses (including your development machine and production server)
   - Get your connection string from MongoDB Atlas

2. Update the .env file with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/homebar?retryWrites=true&w=majority
   ```

## Development Setup

For local development with hot-reloading:

```bash
# Start the development environment
docker-compose -f docker-compose.dev.yml up -d

# Access the development frontend at http://localhost:8016
# Backend API is accessible at http://localhost:8016/api
```

This setup provides:
- Nginx proxy that routes requests between frontend and backend
- Hot reloading for backend
- Frontend running with Vite
- Connection to your MongoDB Atlas database

## Production Deployment with Traefik

The main docker-compose.yml is configured for production deployment with Traefik. It assumes:
- You have a running Traefik instance
- You have a Docker network named `traefik-proxy`
- You want to deploy to the domain `bar.buttercrab.net`

To deploy:

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd homebar-menu
   ```

2. Configure environment variables:
   ```bash
   # Edit the .env file with your MongoDB Atlas connection string
   nano .env
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

   This will:
   - Build the backend (FastAPI) and frontend (React+Vite) containers
   - Connect all services to the Traefik network
   - Configure Traefik to route traffic to the appropriate services
   - Connect to your MongoDB Atlas database

4. Access the application:
   - Frontend: https://bar.buttercrab.net
   - Backend API: https://bar.buttercrab.net/api
   - API Documentation: https://bar.buttercrab.net/api/docs

## Managing the Deployment

- View logs:
  ```bash
  # View all logs
  docker-compose logs -f
  
  # View logs for a specific service
  docker-compose logs -f backend
  docker-compose logs -f frontend
  ```

- Stop the services:
  ```bash
  docker-compose down
  ```

- Restart the services:
  ```bash
  docker-compose restart
  ```

- Update the deployment:
  ```bash
  git pull
  docker-compose up -d --build
  ```

## Database Management

Since we're using MongoDB Atlas, database management is done through the MongoDB Atlas Dashboard:

- Backups are handled automatically by MongoDB Atlas
- Restore operations can be performed through the MongoDB Atlas interface
- You can monitor database performance and metrics through the dashboard
- Data is automatically synchronized between environments as they connect to the same database

## Troubleshooting

- **Traefik routing issues**: Check Traefik logs to ensure routes are properly registered.

- **Backend can't connect to MongoDB Atlas**: 
  - Verify that the MONGODB_URI environment variable is correctly set in the .env file
  - Check that IP whitelisting is configured correctly in MongoDB Atlas
  - Ensure your database user has the correct permissions

- **TLS certificate issues**: Ensure Traefik is properly configured to request certificates from Let's Encrypt.

- **Checking container status**:
  ```bash
  docker-compose ps
  ```

## Production Considerations

- Ensure the `traefik-proxy` network exists before deployment:
  ```bash
  docker network create traefik-proxy
  ```
- Use a secure password for your MongoDB Atlas user
- Consider using MongoDB Atlas IP access lists to restrict access to your database
- Consider setting up MongoDB Atlas alerts for monitoring
- Set up monitoring and alerting for your Docker containers 