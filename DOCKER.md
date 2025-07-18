# Docker Setup for EchoBoard

This document provides detailed instructions for running EchoBoard using Docker.

## Quick Start

### Development Mode
```bash
# Copy environment template
cp env.template .env

# Edit .env with your Firebase credentials
# Then run development server
docker-compose --profile dev up --build
```

Application will be available at `http://localhost:3000`

### Production Mode
```bash
# Copy environment template
cp env.template .env

# Edit .env with your Firebase credentials  
# Then run production server
docker-compose --profile prod up --build
```

Application will be available at `http://localhost:80`

## Docker Files Overview

- **`Dockerfile`**: Multi-stage build for development and production
- **`docker-compose.yml`**: Main compose configuration with dev/prod profiles
- **`docker-compose.override.yml`**: Local development overrides
- **`nginx.conf`**: Nginx configuration for production serving
- **`.dockerignore`**: Excludes unnecessary files from build context
- **`env.template`**: Template for environment variables

## Environment Variables

Copy `env.template` to `.env` and configure with your Firebase settings:

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose --profile dev up` | Start development server |
| `docker-compose --profile prod up` | Start production server |
| `docker-compose --profile dev up --build` | Rebuild and start dev |
| `docker-compose --profile prod up --build` | Rebuild and start prod |
| `docker-compose down` | Stop all containers |
| `docker-compose logs -f` | View container logs |
| `docker-compose ps` | Show running containers |

## Architecture

### Development Container
- **Base**: Node.js 18 Alpine
- **Port**: 3000
- **Features**: Hot reload, development server
- **Volumes**: Source code mounted for live editing

### Production Container
- **Build Stage**: Node.js 18 Alpine for building React app
- **Runtime Stage**: Nginx Alpine for serving static files
- **Port**: 80
- **Features**: Optimized build, gzip compression, caching headers

## Troubleshooting

### Permission Issues
```bash
# Fix Docker permissions on Linux
sudo chown -R $(whoami):$(whoami) .
```

### Port Conflicts
If ports 3000 or 80 are in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

### Build Cache Issues
```bash
# Clear Docker build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Environment Variables Not Loading
1. Ensure `.env` file exists and is properly formatted
2. Check that variables start with `REACT_APP_`
3. Restart containers after changing environment variables

### Firebase Connection Issues
1. Verify Firebase configuration in `.env`
2. Ensure Firebase services are enabled (Auth, Firestore, Storage)
3. Check browser console for specific Firebase errors

## Production Deployment

### Using Docker

1. **Build production image**:
```bash
docker build --target production -t echoboard:latest .
```

2. **Run with environment variables**:
```bash
docker run -p 80:80 \
  -e REACT_APP_FIREBASE_API_KEY=your_key \
  -e REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain \
  # ... other env vars
  echoboard:latest
```

### Using Docker Compose

1. **Set production environment variables**
2. **Deploy**:
```bash
docker-compose --profile prod up -d
```

## Security Considerations

- Environment variables are built into the image during build time
- Ensure `.env` files are not committed to version control
- Use Docker secrets for sensitive production deployments
- Configure proper Firebase security rules

## Performance Tips

1. **Multi-stage builds** reduce final image size
2. **Nginx compression** reduces bandwidth usage
3. **Static asset caching** improves load times
4. **Alpine Linux** base images are smaller and more secure

## Monitoring

View application logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f echoboard-dev
```

Monitor resource usage:
```bash
docker stats
``` 