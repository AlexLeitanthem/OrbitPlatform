# 🚀 Deployment Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (Atlas recommended for production)
- Cloudinary account
- PositionStack API key
- Domain name (for production)

## 🏗️ Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   Set these in Railway dashboard:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-platform
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5001
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   POSITIONSTACK_API_KEY=your-positionstack-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create orbit-platform-backend
   ```

2. **Configure Environment**
   ```bash
   heroku config:set MONGO_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   # ... set other variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Select Node.js environment
   - Configure build and run commands

2. **Environment Variables**
   Set all required environment variables in the dashboard

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-domain.com
   VITE_SOCKET_URL=https://your-backend-domain.com
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Link GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   Set in Netlify dashboard

### Option 3: GitHub Pages

1. **Configure GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Configure network access
   - Create database user

2. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/orbit-platform
   ```

### Local MongoDB

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   
   # Windows
   # Download from MongoDB website
   ```

2. **Start MongoDB**
   ```bash
   mongod
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/orbit-platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5001

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Geocoding
POSITIONSTACK_API_KEY=your-positionstack-key

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

## 🔒 Security Configuration

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure CORS for specific domains
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure file upload limits
- [ ] Set up monitoring and logging

### Security Headers

Add to your server configuration:

```javascript
// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

## 📊 Monitoring & Logging

### Recommended Tools

1. **Application Monitoring**
   - [Sentry](https://sentry.io) - Error tracking
   - [LogRocket](https://logrocket.com) - User session replay
   - [New Relic](https://newrelic.com) - Performance monitoring

2. **Database Monitoring**
   - MongoDB Atlas monitoring
   - Database performance insights

3. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://pingdom.com)

## 🚀 Performance Optimization

### Backend Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for frequently queried fields
   db.users.createIndex({ email: 1 });
   db.profiles.createIndex({ user: 1 });
   db.posts.createIndex({ createdAt: -1 });
   ```

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

### Frontend Optimization

1. **Build Optimization**
   ```bash
   npm run build
   # Optimize bundle size
   npm run analyze
   ```

2. **CDN Configuration**
   - Use CDN for static assets
   - Optimize images
   - Enable gzip compression

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL environment variable
   - Verify CORS configuration

2. **Database Connection**
   - Verify MONGO_URI
   - Check network access
   - Ensure database is running

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Validate file types

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

### Support

- Check application logs
- Monitor error tracking services
- Review database performance
- Test API endpoints

---

**Last Updated**: December 2024
