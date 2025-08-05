# TickTick - Project Management Platform

A modern, collaborative project management platform with integrated real-time messaging. TickTick helps you organize workspaces, manage projects and tasks, collaborate with team members, and communicate seamlessly in one unified platform.

## Features

- **Workspace Management**: Create and manage multiple workspaces for different teams or organizations
- **Project Management**: Organize and track projects within workspaces with comprehensive project oversight
- **Task Management**: Create, organize, and track tasks within projects with priorities and due dates
- **Team Collaboration**: Invite team members and assign tasks to collaborate effectively
- **Real-time Chat**: Integrated messaging with channel invites, personal notes, and direct messaging
- **Member Management**: Manage team roles and permissions within workspaces
- **Secure Authentication**: 
  - Email verification and password reset
  - Google OAuth integration
  - JWT session management
- **Email System**: Professional email templates with SMTP integration
- **Responsive Design**: Access your projects from any device with mobile-optimized interface

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Tanstack Query
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Real-time Chat**: Stream Chat React SDK for messaging functionality
- **Authentication**: JWT sessions, Google OAuth, email verification
- **Email Service**: Nodemailer with SMTP for transactional emails
- **Security**: Secure token generation, auto-expiring tokens, password hashing
- **Deployment**: Vercel (Frontend), Render (Backend)

<img width="1264" height="995" alt="ticktick-thumbnail-2" src="https://github.com/user-attachments/assets/63e62663-ad9e-44da-aec2-8c10c911ae39" />



## Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/henrydaoo/ticktick.git
cd ticktick
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env` in both frontend and backend directories
- Configure MongoDB connection and email SMTP settings

4. Start the development servers
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

