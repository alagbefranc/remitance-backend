# Deployment Guide

## Overview
This guide covers deploying the RemittanceApp backend API to various cloud platforms and production environments.

## Pre-deployment Checklist

### Environment Variables
Ensure all required environment variables are set:

```env
# Required for production
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/remittance-app
JWT_SECRET=your-super-secure-production-jwt-secret-at-least-32-chars
NIUM_API_KEY=your-production-nium-api-key
NIUM_CLIENT_HASH_ID=your-production-nium-client-hash-id
NIUM_ENVIRONMENT=production

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-app-domain.com

# Optional
JWT_EXPIRES_IN=7d
```

### Security Considerations
- [ ] Use strong, unique JWT secret (32+ characters)
- [ ] Configure CORS for your frontend domain only
- [ ] Set up rate limiting appropriate for your traffic
- [ ] Use production MongoDB with authentication
- [ ] Enable MongoDB connection encryption
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS in production
- [ ] Configure proper logging and monitoring

## Cloud Platform Deployments

### 1. Railway (Recommended)

**Steps:**
1. Push your code to GitHub
2. Connect GitHub repository to Railway
3. Set environment variables in Railway dashboard
4. Deploy automatically

**Railway Configuration:**
```bash
# In Railway dashboard, set these environment variables:
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
NIUM_API_KEY=your-production-key
NIUM_CLIENT_HASH_ID=your-client-hash-id
ALLOWED_ORIGINS=https://your-frontend.com
```

**Custom Start Command:**
```bash
npm run build && npm start
```

### 2. Heroku

**Prerequisites:**
- Heroku CLI installed
- Git repository initialized

**Deployment Steps:**
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-remittance-app-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set NIUM_API_KEY=your-production-key
heroku config:set NIUM_CLIENT_HASH_ID=your-client-hash-id
heroku config:set NIUM_ENVIRONMENT=production
heroku config:set ALLOWED_ORIGINS=https://your-frontend.com

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=1
```

**Heroku Procfile:** (create in root directory)
```
web: npm start
```

### 3. DigitalOcean App Platform

**Steps:**
1. Connect GitHub repository
2. Configure build and run commands
3. Set environment variables
4. Deploy

**Build Command:** `npm run build`  
**Run Command:** `npm start`

### 4. AWS (EC2 + RDS)

**Infrastructure Setup:**
```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Set up security groups (ports 22, 80, 443, 3001)
# Launch RDS MongoDB/DocumentDB instance

# On EC2 instance:
sudo apt update
sudo apt install nodejs npm nginx

# Clone repository
git clone https://github.com/yourusername/remittance-backend.git
cd remittance-backend

# Install dependencies
npm install

# Set up environment variables
sudo nano /etc/environment
# Add your production environment variables

# Build application
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start application with PM2
pm2 start dist/index.js --name remittance-backend

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Vercel (Serverless)

**Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure production settings
```

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Docker Production Deployment

### 1. Multi-stage Production Dockerfile

```dockerfile
# Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3001

USER node

CMD ["npm", "start"]
```

### 2. Docker Compose (Production)

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/remittance-app
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=securepassword123
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongodb_data:
```

### 3. Kubernetes Deployment

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: remittance-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: remittance-backend
  template:
    metadata:
      labels:
        app: remittance-backend
    spec:
      containers:
      - name: api
        image: your-registry/remittance-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
---
apiVersion: v1
kind: Service
metadata:
  name: remittance-backend-service
spec:
  selector:
    app: remittance-backend
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create a new cluster
3. Configure network access (IP whitelist)
4. Create database user
5. Get connection string
6. Set MONGODB_URI environment variable

### Self-hosted MongoDB
```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "securepassword123",
  roles: ["readWriteAnyDatabase", "dbAdminAnyDatabase"]
})

# Enable authentication in /etc/mongod.conf
security:
  authorization: enabled
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### Application Monitoring
- **Recommended:** New Relic, DataDog, or AppSignal
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up performance monitoring

### Logging Configuration
```javascript
// Add to production environment
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Performance Optimization

### Production Optimizations
- Enable gzip compression
- Set up caching (Redis)
- Database indexing
- Connection pooling
- Load balancing (for multiple instances)

### Example Production Optimizations:
```javascript
// In your Express app
app.use(compression());

// Database connection with connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  bufferMaxEntries: 0
});

// Redis caching
import redis from 'redis';
const client = redis.createClient(process.env.REDIS_URL);
```

## Backup Strategy

### Database Backups
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
aws s3 cp "/backups/backup_$DATE" s3://your-backup-bucket/ --recursive
```

### Application Backups
- Code: Git repository (already backed up)
- Configuration: Environment variables documented
- Database: Regular automated backups
- SSL certificates: Regular renewal

## Troubleshooting

### Common Issues
1. **503 Service Unavailable:** Check if MongoDB is accessible
2. **JWT errors:** Verify JWT_SECRET is set
3. **CORS errors:** Check ALLOWED_ORIGINS configuration
4. **Rate limiting:** Adjust rate limit settings
5. **Memory issues:** Monitor memory usage, consider increasing instance size

### Health Checks
Monitor these endpoints:
- `GET /health` - Application health
- Database connectivity
- Nium API connectivity
- Memory and CPU usage

## Rollback Strategy

### Quick Rollback
```bash
# Heroku
heroku rollback v123

# Railway
# Use Railway dashboard to rollback to previous deployment

# Docker
docker pull your-registry/remittance-backend:previous-tag
docker stop current-container
docker run new-container-with-previous-tag
```

## Security Best Practices

### Production Security Checklist
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Use strong JWT secrets
- [ ] Enable database authentication
- [ ] Keep dependencies updated
- [ ] Set up security monitoring
- [ ] Configure proper error handling (no sensitive data exposure)
- [ ] Use helmet.js for security headers
- [ ] Enable request logging
- [ ] Set up intrusion detection

---

This deployment guide ensures your RemittanceApp backend is production-ready with proper security, monitoring, and scalability considerations.
