# Deployment Guide

Comprehensive guide for deploying the AI Plagiarism & Paraphrase Assistant to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
  - [Docker](#docker)
  - [Heroku](#heroku)
  - [Vercel](#vercel)
  - [Railway](#railway)
  - [AWS EC2](#aws-ec2)
  - [Google Cloud Run](#google-cloud-run)
  - [DigitalOcean](#digitalocean)
  - [Traditional VPS](#traditional-vps)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

1. **Google Gemini API Key**
   - Sign up at [Google AI Studio](https://ai.google.dev/)
   - Create a project and generate an API key
   - Note: Free tier has rate limits (60 requests/minute)

2. **Git Repository Access**
   - Fork or clone the repository
   - Ensure you have push access if using CI/CD

3. **Domain Name (Optional)**
   - For production deployments
   - SSL certificate (most platforms provide free SSL)

---

## Environment Variables

All deployment methods require these environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `API_KEY` | Google Gemini API key | Yes | None |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment (development/production) | No | development |

**Setting Environment Variables:**

```bash
# Linux/Mac
export API_KEY="your_api_key_here"
export PORT=3000

# Windows PowerShell
$env:API_KEY="your_api_key_here"
$env:PORT=3000

# .env file (not recommended for production)
API_KEY=your_api_key_here
PORT=3000
```

---

## Deployment Options

### Docker

Docker provides a consistent deployment environment.

#### Step 1: Create Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
```

#### Step 2: Create .dockerignore

Create `.dockerignore`:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
```

#### Step 3: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=${API_KEY}
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Step 4: Deploy

```bash
# Create .env file
echo "API_KEY=your_api_key_here" > .env

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Docker Hub Deployment

```bash
# Build image
docker build -t yourusername/plagiarism-assistant:latest .

# Login to Docker Hub
docker login

# Push image
docker push yourusername/plagiarism-assistant:latest

# On production server
docker pull yourusername/plagiarism-assistant:latest
docker run -d -p 3000:3000 -e API_KEY=your_key yourusername/plagiarism-assistant:latest
```

---

### Heroku

Heroku offers simple deployment with Git push.

#### Step 1: Install Heroku CLI

```bash
# Mac
brew install heroku/brew/heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Create Procfile

Create `Procfile` in project root:

```
web: npm start
```

#### Step 3: Deploy

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set API_KEY=your_api_key_here

# Set Node.js version (optional)
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open

# View logs
heroku logs --tail
```

#### Auto-Deployment from GitHub

1. Go to Heroku Dashboard
2. Select your app
3. Click "Deploy" tab
4. Choose "GitHub" as deployment method
5. Connect your repository
6. Enable automatic deploys from main branch

---

### Vercel

Vercel is optimized for Node.js applications.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Create vercel.json

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "API_KEY": "@api_key"
  }
}
```

#### Step 3: Deploy

```bash
# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add API_KEY

# Deploy to production
vercel --prod
```

#### Deploy via GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `API_KEY`: Your Gemini API key
5. Click "Deploy"

---

### Railway

Railway offers simple deployment with automatic HTTPS.

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Deploy

```bash
# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set API_KEY=your_api_key_here

# Deploy
railway up

# Get deployment URL
railway domain
```

#### Deploy via GitHub

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables in settings
6. Railway automatically deploys

---

### AWS EC2

Deploy on AWS EC2 for full control.

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose Ubuntu Server 22.04 LTS
4. Select instance type (t2.micro for testing)
5. Configure security group:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
6. Create or select key pair
7. Launch instance

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-public-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### Step 4: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/Ghulam-Mustafa-Keerio/AI-Plagiarism-Paraphrase-Assistant.git
cd AI-Plagiarism-Paraphrase-Assistant

# Install dependencies
npm install --production

# Set environment variable
export API_KEY="your_api_key_here"

# Start with PM2
pm2 start server.js --name plagiarism-assistant

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/plagiarism-assistant
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/plagiarism-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### Google Cloud Run

Serverless deployment on Google Cloud.

#### Step 1: Install gcloud CLI

```bash
# Follow instructions at: https://cloud.google.com/sdk/docs/install
```

#### Step 2: Create Dockerfile (if not exists)

Use the Docker section's Dockerfile.

#### Step 3: Deploy

```bash
# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy plagiarism-assistant \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=your_api_key_here

# Get URL
gcloud run services describe plagiarism-assistant --region us-central1 --format 'value(status.url)'
```

---

### DigitalOcean

Deploy on DigitalOcean App Platform or Droplet.

#### App Platform (Recommended)

1. Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com/)
2. Click "Apps" → "Create App"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add environment variable: `API_KEY`
6. Choose plan ($5/month basic)
7. Launch app

#### Droplet (VPS)

Follow the same steps as [AWS EC2](#aws-ec2), but:

1. Create Ubuntu Droplet ($4/month for 1GB RAM)
2. Use DigitalOcean's 1-Click Node.js app
3. Follow EC2 deployment steps

---

### Traditional VPS

Deploy on any VPS provider (Linode, Vultr, etc.).

#### Step 1: Create Server

1. Choose Ubuntu 22.04 LTS
2. Select plan (1GB RAM minimum)
3. Add SSH key
4. Launch server

#### Step 2: Initial Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Switch to new user
su - deploy
```

#### Step 3: Install Required Software

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx
sudo apt install nginx -y

# PM2
sudo npm install -g pm2

# Git
sudo apt install git -y
```

#### Step 4: Deploy Application

Follow steps from [AWS EC2 deployment](#step-4-clone-and-setup-application).

---

## Post-Deployment

### Verify Deployment

```bash
# Test API endpoints
curl -X POST https://your-domain.com/api/detect-source \
  -H "Content-Type: application/json" \
  -d '{"text": "test text"}'

# Check health
curl https://your-domain.com/
```

### Setup Monitoring

#### Using PM2 (Node.js)

```bash
# View logs
pm2 logs

# Monitor
pm2 monit

# View process info
pm2 info plagiarism-assistant
```

#### Using Systemd Service

Create `/etc/systemd/system/plagiarism-assistant.service`:

```ini
[Unit]
Description=AI Plagiarism Assistant
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/AI-Plagiarism-Paraphrase-Assistant
Environment="API_KEY=your_api_key_here"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable plagiarism-assistant
sudo systemctl start plagiarism-assistant
sudo systemctl status plagiarism-assistant
```

### Backup Strategy

```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backups/plagiarism-assistant"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /path/to/app

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

---

## Monitoring

### Health Checks

Add health check endpoint to `server.js`:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

### Log Management

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Application logs (PM2)
pm2 logs plagiarism-assistant

# System logs
journalctl -u plagiarism-assistant -f
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Application Won't Start

```bash
# Check logs
pm2 logs plagiarism-assistant --err

# Check environment variables
pm2 env 0

# Restart application
pm2 restart plagiarism-assistant
```

#### Nginx Configuration Error

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

#### High Memory Usage

```bash
# Check memory
free -h

# Check process memory
pm2 status

# Restart application
pm2 restart plagiarism-assistant
```

### Performance Optimization

#### Enable Gzip Compression (Nginx)

Add to Nginx configuration:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

#### Add Caching Headers

```javascript
// In server.js
app.use(express.static('.', {
  maxAge: '1d',
  etag: true
}));
```

#### Use PM2 Cluster Mode

```bash
pm2 start server.js -i max --name plagiarism-assistant
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Implement rate limiting
- [ ] Add authentication for API endpoints
- [ ] Keep dependencies updated
- [ ] Use firewall (UFW on Ubuntu)
- [ ] Disable root SSH access
- [ ] Set up automatic security updates
- [ ] Monitor logs for suspicious activity
- [ ] Regular backups

---

## Cost Estimates

| Platform | Monthly Cost | Notes |
|----------|--------------|-------|
| Heroku | $7 | Hobby tier |
| Vercel | Free - $20 | Free for personal projects |
| Railway | $5 | 5GB bandwidth |
| AWS EC2 | $5-10 | t2.micro instance |
| DigitalOcean | $4-6 | Basic droplet |
| Google Cloud Run | ~$5 | Pay per use |

**Note:** Gemini API costs are separate. Free tier available with limits.

---

## Support

For deployment issues:
- Check the [main README](../README.md)
- Open an [issue](https://github.com/Ghulam-Mustafa-Keerio/AI-Plagiarism-Paraphrase-Assistant/issues)
- Join discussions in [GitHub Discussions](https://github.com/Ghulam-Mustafa-Keerio/AI-Plagiarism-Paraphrase-Assistant/discussions)
