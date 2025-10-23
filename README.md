# 🚀 Orbit Platform

A comprehensive professional networking platform designed for alumni communities, featuring real-time messaging, profile management, and networking capabilities.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 👤 Profile Management
- Comprehensive user profiles with experience and education
- Profile picture uploads via Cloudinary
- Skills and social media links
- Location-based profiles with geocoding
- Profile search and filtering

### 🤝 Networking Features
- Connection requests and management
- Alumni directory with advanced filtering
- Professional networking capabilities
- Connection status tracking

### 💬 Real-time Communication
- Socket.IO powered real-time messaging
- Private conversations
- Typing indicators
- Message history

### 📝 Content Management
- Create and manage posts
- Like and comment system
- Post deletion capabilities
- Content moderation

### 📊 Analytics Dashboard
- Admin analytics dashboard
- User engagement metrics
- Platform statistics
- Data visualization with Recharts

### 🎨 Modern UI/UX
- Material-UI components
- Responsive design
- Dark/Light theme support
- Framer Motion animations
- Interactive maps with Leaflet

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **Real-time**: Socket.IO
- **Security**: CORS, bcrypt, input validation

### Frontend (React)
- **Framework**: React 19 with Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Maps**: React Leaflet

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- PositionStack API key (for geocoding)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/orbit-platform.git
   cd orbit-platform
   ```

2. **Backend Setup**
   ```bash
   cd orbit-backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd orbit-frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Environment Configuration**

   **Backend (.env)**
   ```env
   MONGO_URI=mongodb://localhost:27017/orbit-platform
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5001
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   POSITIONSTACK_API_KEY=your-positionstack-key
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_SOCKET_URL=http://localhost:5001
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd orbit-backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd orbit-frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📁 Project Structure

```
orbit-platform/
├── orbit-backend/           # Backend API
│   ├── api/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication & authorization
│   │   ├── models/          # Database models
│   │   └── routes/          # API routes
│   ├── config/              # Database & service configs
│   ├── server.js           # Main server file
│   └── package.json
├── orbit-frontend/          # Frontend React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   └── assets/         # Static assets
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user

### Profiles
- `GET /api/profiles` - Get all profiles (with filtering)
- `GET /api/profiles/me` - Get current user's profile
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles/:id` - Get profile by ID

### Connections
- `GET /api/connections/requests` - Get connection requests
- `POST /api/connections/request/:id` - Send connection request
- `PUT /api/connections/accept/:id` - Accept connection
- `DELETE /api/connections/remove/:id` - Remove connection

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Add comment
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/messages/:conversationId` - Get messages

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Protected routes
- Role-based access control

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/your-username/orbit-platform/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Mobile app development
- [ ] Video calling integration
- [ ] Event management system
- [ ] Job posting features

---

**Built with ❤️ for alumni communities worldwide**
