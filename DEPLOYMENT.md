# SafeTravels Motors - Deployment Guide

This guide will help you deploy the SafeTravels Motors car dealership website to production.

## 🚀 Quick Start (Docker)

The easiest way to deploy the entire application is using Docker Compose:

### 1. Prerequisites

- Docker and Docker Compose installed
- A domain name (optional, for custom domain setup)

### 2. Environment Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd safetravels-dealership

# Copy environment file
cp env.example .env

# Edit the .env file with your production values
nano .env
```

### 3. Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Initialize database
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### 4. Access Your Application

- **Frontend**: http://localhost (or your domain)
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost/admin

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

## 🌐 Production Deployment Options

### Option 1: Vercel + Render + PlanetScale (Recommended)

#### Frontend (Vercel)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Backend (Render)

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Select "Web Service"

2. **Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.com
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

4. **Database Setup**
   ```bash
   # SSH into your Render instance
   npx prisma migrate deploy
   npx prisma db seed
   ```

#### Database (PlanetScale)

1. **Create Database**
   - Go to [PlanetScale](https://planetscale.com)
   - Create a new database
   - Get the connection string

2. **Update Environment Variables**
   - Update `DATABASE_URL` in your backend environment

### Option 2: Netlify + Railway + MySQL

#### Frontend (Netlify)

1. **Deploy to Netlify**
   - Connect your GitHub repository
   - Build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

#### Backend (Railway)

1. **Deploy to Railway**
   - Connect your GitHub repository
   - Select the `backend` folder
   - Add environment variables

2. **Database (Railway MySQL)**
   - Add MySQL service
   - Update `DATABASE_URL` environment variable

### Option 3: AWS/GCP/Azure

For enterprise deployments, consider using:

- **Frontend**: AWS S3 + CloudFront, GCP Cloud Storage + CDN, Azure Blob Storage + CDN
- **Backend**: AWS ECS/EKS, GCP Cloud Run/GKE, Azure Container Instances/AKS
- **Database**: AWS RDS, GCP Cloud SQL, Azure Database for MySQL

## 🔧 Custom Domain Setup

### 1. Purchase Domain

Buy a domain from providers like:
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. Configure DNS

#### For Vercel (Frontend)
1. Go to your Vercel project settings
2. Add your domain in "Domains" section
3. Update DNS records as instructed by Vercel

#### For Render (Backend)
1. Go to your Render service settings
2. Add custom domain
3. Update DNS records

### 3. SSL Certificate

Most hosting providers offer free SSL certificates:
- Vercel: Automatic HTTPS
- Render: Automatic HTTPS
- Cloudflare: Free SSL

## 🔐 Security Configuration

### 1. Environment Variables

**Never commit these to version control:**

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Update your .env file
JWT_SECRET=your-generated-secret
```

### 2. Database Security

- Use strong passwords
- Enable SSL connections
- Restrict database access to your application only
- Regular backups

### 3. API Security

- Rate limiting (already implemented)
- CORS configuration
- Input validation
- File upload restrictions

## 📊 Monitoring & Analytics

### 1. Google Analytics

1. Create a Google Analytics account
2. Get your tracking ID
3. Add to environment variables:
   ```
   GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
   ```

### 2. Error Monitoring

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- New Relic for performance monitoring

### 3. Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

## 🚀 Performance Optimization

### 1. Image Optimization

- Use WebP format
- Implement lazy loading
- Compress images before upload

### 2. Caching

- CDN for static assets
- Database query caching
- API response caching

### 3. Database Optimization

- Add indexes for frequently queried fields
- Optimize queries
- Regular maintenance

## 📱 Mobile Optimization

The application is already mobile-responsive, but consider:

- Progressive Web App (PWA) features
- Mobile-specific optimizations
- Touch-friendly interactions

## 🔄 Backup Strategy

### 1. Database Backups

```bash
# Automated daily backups
mysqldump -h host -u user -p database > backup_$(date +%Y%m%d).sql
```

### 2. File Backups

- Regular uploads folder backups
- Version control for code
- Environment variable backups

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database is accessible

2. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Check disk space

3. **CORS Errors**
   - Update FRONTEND_URL in backend
   - Check CORS configuration

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Getting Help

- Check application logs
- Review error messages
- Test API endpoints
- Verify environment variables

## 📈 Scaling Considerations

### Horizontal Scaling

- Load balancers
- Multiple backend instances
- Database read replicas
- CDN for static assets

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching layers

## 🎯 Next Steps

After deployment:

1. **Change default admin credentials**
2. **Add your car inventory**
3. **Configure email settings**
4. **Set up Google Analytics**
5. **Test all functionality**
6. **Monitor performance**
7. **Regular backups**

## 📞 Support

For deployment support:
- Check the documentation
- Review error logs
- Test in staging environment first
- Consider professional deployment services

---

**Congratulations!** 🎉 Your SafeTravels Motors website is now live and ready to serve customers!





