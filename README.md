# EspacoGeek_Web-Front-End

**Project**: EspacoGeek front-end web application built with Next.js.

**Description**: This repository contains the Next.js frontend for EspacoGeek. The app is configured
to produce a standalone server build (`output: 'standalone'`) so it can run as a Node process inside
a container. The CI builds Docker images and pushes them to GitHub Container Registry (GHCR), then
deploys to the configured host via SSH using the included `deploy-frontend.sh` script.

**Quick Links**:
- **Source**: `.`
- **Dockerfile**: `Dockerfile`
- **Deploy script**: `deploy-frontend.sh`
- **CI workflow**: `.github/workflows/cicd.yml`

**Requirements**:
- **Node.js**: v20 recommended for building.
- **Docker**: for building and running production images locally.
- **GitHub secrets**: `HOSTINGER_HOST`, `HOSTINGER_USER`, `HOSTINGER`, `HOSTINGER_PORT`, `GHCR_USER`, `GHCR_TOKEN` (used by CI/deploy).

**Development**
- **Install dependencies**:

```powershell
npm ci
```

- **Run development server**:

```powershell
npm run dev
```

- Open `http://localhost:3000` in your browser. Use `.env.local` to configure `NEXT_PUBLIC_API_URI` for local API endpoints or set it on config.js.

**Production (local build & run)**
- **Build (Next.js standalone)**:

```powershell
npm run build
```

- After a successful build the standalone artifact should be available at `.next/standalone`.

- **Build Docker image locally**:

```powershell
docker build -t espacogeek-frontend:local .
```

- **Run Docker image** (maps port `3000` on the host to `3000` in the container):

```powershell
docker run --rm -p 3000:3000 espacogeek-frontend:local
```

- Visit `http://localhost:3000` to confirm the production server is serving the app.

**CI / Deployment**
- The repository includes a GitHub Actions workflow at `.github/workflows/cicd.yml` that:
	- runs lint/tests,
	- builds the Next.js standalone artifact,
	- builds and (on push to `main`) pushes a Docker image to `ghcr.io/${GHCR_OWNER}/${APP_NAME}`,
	- SSHs to the deployment host and runs `/opt/espacogeek/deploy-frontend.sh` to pull and run the image.
- The deploy script runs the container with `-p 3000:3000` and validates health by requesting `http://localhost:3000/`.

**Environment variables**
- Use `.env.local` for local development variables (example):

```text
NEXT_PUBLIC_API_URI=http://localhost:8080
```

**Troubleshooting**
- If the CI fails at image build: ensure `next.config.js` includes `output: 'standalone'` and that `npm run build` succeeds.
- If the container fails to start on the host: check Docker logs (`docker logs <container>`) and verify the GHCR credentials used by the deploy script.

**Notes**
- This project expects the deployment host to have Docker installed and network access to GHCR.
- Keep secrets for GHCR and SSH up-to-date in the repository settings. 
