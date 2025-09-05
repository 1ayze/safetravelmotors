# SafeTravels Motors - Car Dealership Website

A complete, modern car dealership website built with React, Node.js, and MySQL.

## Features

- 🚗 **Car Listings**: Browse cars with advanced search and filtering
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🔐 **Admin Dashboard**: Secure admin panel for managing inventory
- 📍 **Google Maps Integration**: Interactive maps on contact page
- 📝 **Blog System**: SEO-friendly blog for news and updates
- 🎨 **Modern UI**: Beautiful design with TailwindCSS
- ⚡ **Fast Performance**: Optimized for speed and SEO
- 🔒 **Secure**: JWT authentication and form validation

## Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Hook Form for form handling

### Backend
- Node.js with Express
- TypeScript for type safety
- MySQL database with Prisma ORM
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd safetravels-dealership
   npm run install-all
   ```

2. **Set up environment variables:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000/admin

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change these credentials in production!

## Project Structure

```
safetravels-dealership/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── prisma/             # Database schema and migrations
└── docs/                   # Documentation and deployment guides
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variables for API URL

### Backend (Render/Heroku)
1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables for database and JWT

### Database (PlanetScale/MySQL)
1. Create a MySQL database
2. Update connection string in backend environment variables
3. Run migrations: `npx prisma migrate deploy`

## Custom Domain Setup

1. **Purchase domain** from your preferred registrar
2. **Configure DNS:**
   - A record: Point to your hosting provider's IP
   - CNAME: www → your-domain.com
3. **SSL Certificate:** Most hosting providers offer free SSL
4. **Update environment variables** with your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@safetravelsmotors.com or create an issue in the repository.


