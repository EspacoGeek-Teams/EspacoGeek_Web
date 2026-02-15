# Frontend CI/CD Deployment Guide

## Overview
This document explains the CI/CD pipeline for the **EspacoGeek Frontend** deployed on Hostinger with Nginx.

## Workflow Trigger
The workflow runs automatically when:
1. A Pull Request is opened/updated targeting the `main` branch
2. Code is pushed (merged) to the `main` branch
3. Manually triggered via GitHub Actions UI

## Workflow Stages

### 1. **Lint and Test** (`lint_and_test`)
- Checks out the code
- Sets up Node.js 18
- Installs npm dependencies
- Runs ESLint (if configured)
- Runs tests (if configured)
- **Blocks deployment** if linting or tests fail

### 2. **Build and Deploy** (`build_and_publish`)
- Only runs if linting/tests pass
- Sets up Node.js 18 and builds the React app with Vite
- Reads version from `package.json`
- Builds a Docker image with Nginx
- Pushes to GitHub Container Registry (GHCR)
- **On PRs**: Tags as `pr-<number>-<short-sha>` (no push to registry)
- **On main branch**: Tags as `latest`, `sha-<short-sha>`, `<date>`, `v<version>` (pushes to registry)
- Deploys to Hostinger via SSH

## Docker Image Details

### Build Process
- **Builder Stage**: Node.js 18 Alpine
  - Installs dependencies with npm
  - Builds production bundle with `npm run build`
  - Output: `/app/dist` directory

- **Runtime Stage**: Nginx Alpine
  - Copies built app to `/usr/share/nginx/html`
  - Configured with security headers, CORS, and caching
  - Exposes port 80
  - Health check enabled

### Nginx Configuration
- **Gzip compression** enabled for assets
- **SPA routing**: All requests fallback to `index.html`
- **Security headers**: Frame-Options, XSS-Protection, Content-Type-Options
- **CORS headers**: Configured for `api.espacogeek.com`
- **Cache strategies**:
  - `index.html`: No cache (development changes)
  - Static assets: 1 year cache (immutable)
- **Deny access** to hidden files and directories

## Required GitHub Secrets

Add these secrets to your repository (`Settings > Secrets and variables > Actions`):

| Secret | Description | Example |
|--------|-------------|---------|
| `HOSTINGER_HOST` | Hostinger server IP or domain | `123.45.67.89` |
| `HOSTINGER_USER` | SSH username | `ubuntu` or `root` |
| `HOSTINGER` | SSH private key (multiline) | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `HOSTINGER_PORT` | SSH port (optional, defaults to 22) | `22` |
| `GHCR_USER` | GitHub username for container registry | Your GitHub username |
| `GHCR_TOKEN` | GitHub Container Registry token | Personal access token with `write:packages` |

### How to Create GHCR Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `write:packages`, `read:packages`, `delete:packages`
4. Copy and save as `GHCR_TOKEN` secret

### How to Create SSH Key
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions@espacogeek"
# When prompted for filename, save as `id_ed25519_github`
# Press Enter for empty passphrase

# Add public key to Hostinger (~/.ssh/authorized_keys)
cat ~/.ssh/id_ed25519_github.pub

# Add private key to GitHub Secret (HOSTINGER)
cat ~/.ssh/id_ed25519_github
# Copy entire content including -----BEGIN and -----END lines
```

## Deployment Flow

### On Hostinger
1. SSH login to Hostinger
2. Docker login to GHCR using credentials
3. **deploy-frontend.sh** script:
   - Creates backup of old container
   - Stops and renames old container
   - Pulls new image from GHCR
   - Starts new container on port 3000 (maps to port 80 inside container)
   - Performs health checks (30 seconds max)
   - Removes old container if new one is healthy
   - Restores old container if deployment fails

### Container Mapping
- **Host**: `api.espacogeek.com:3000` → Internal Nginx `:80`
- **Container Name**: `espacogeek-frontend`
- **Restart Policy**: `unless-stopped`

## Monitoring & Debugging

### Check Deployment Status
```bash
# SSH into Hostinger
ssh -i ~/.ssh/id_ed25519_github user@host

# View running containers
docker ps | grep espacogeek-frontend

# View container logs
docker logs -f espacogeek-frontend

# View recent logs
docker logs --tail 50 espacogeek-frontend

# Stop container
docker stop espacogeek-frontend

# Start container
docker start espacogeek-frontend

# Remove container
docker rm espacogeek-frontend
```

### Check Available Backups
```bash
ls -la ~/espacogeek-backups/
```

## Rollback Procedure

### Automatic Rollback
If deployment fails, the old container is automatically restored.

### Manual Rollback
```bash
# SSH into Hostinger
ssh -i ~/.ssh/id_ed25519_github user@host

# Stop current container
docker stop espacogeek-frontend

# Remove current container
docker rm espacogeek-frontend

# Restore backup
cd ~/espacogeek-backups/
docker import espacogeek-frontend_backup_YYYYMMDD_HHMMSS.tar espacogeek-frontend:backup

# Run restored container
docker run -d --name espacogeek-frontend -p 3000:80 --restart unless-stopped espacogeek-frontend:backup
```

## Version Tags

### Example Tags
- **On PR #42**: `ghcr.io/espacogeek-teams/espacogeek-frontend:pr-42-a1b2c3d`
- **On main (v0.1.0)**: 
  - `ghcr.io/espacogeek-teams/espacogeek-frontend:latest`
  - `ghcr.io/espacogeek-teams/espacogeek-frontend:v0.1.0`
  - `ghcr.io/espacogeek-teams/espacogeek-frontend:20260215`
  - `ghcr.io/espacogeek-teams/espacogeek-frontend:sha-a1b2c3d`

## Local Development

### Build Docker image locally
```bash
docker build -t espacogeek-frontend:local .
```

### Run locally
```bash
docker run -d --name espacogeek-frontend-local -p 3000:80 espacogeek-frontend:local
```

### Access in browser
```
http://localhost:3000
```

### Clean up
```bash
docker stop espacogeek-frontend-local
docker rm espacogeek-frontend-local
```

## Troubleshooting

### Build Fails
- Check `npm run build` locally
- Verify Node.js version compatibility
- Check for missing environment variables

### Docker Push Fails
- Verify `GHCR_TOKEN` has `write:packages` scope
- Check GitHub username in `GHCR_USER`

### SSH Connection Fails
- Verify IP/domain in `HOSTINGER_HOST`
- Check SSH key is in authorized_keys on Hostinger
- Verify port in `HOSTINGER_PORT` (default: 22)

### Container Won't Start
- Check image pull was successful
- Verify port 3000 is not already in use
- Check Docker daemon is running on Hostinger

### Health Check Timeout
- Increase `MAX_RETRIES` in deploy script
- Check container logs: `docker logs espacogeek-frontend`

## Files Included

- `.github/workflows/cicd.yml` - Main CI/CD workflow
- `Dockerfile` - Multi-stage Docker build
- `nginx.conf` - Nginx main configuration
- `default.conf` - Nginx server configuration
- `deploy-frontend.sh` - Deployment script (downloaded and executed on Hostinger)
- `DEPLOYMENT.md` - This guide
