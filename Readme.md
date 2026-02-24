# Student Connect 🎓

Student Connect is a premium, full-stack student networking and project showcase platform. It enables students to build professional digital identities, showcase their technical achievements, and discover peers through a "Smart Directory" interface.

## 🚀 Key Features

*   **Smart Directory**: A decluttered, search-first directory that reveals student profiles only when you need them.
*   **Student Studio (Dashboard 2.0)**: A high-performance personal workspace for managing profile details, resumes, and project launches.
*   **Dedicated Profile Pages**: Shareable, public-facing profiles (`/profile/:id`) that highlight a student's full journey and project history.
*   **Monochromatic Modern UI**: A sleek, professional dark-mode inspired aesthetic optimized for focus and readability.
*   **Project Showcase**: Integrated "launchpad" for students to publish their technical work with GitHub and Live Demo links.
*   **Activity Scoring**: An automated system that tracks and displays social/technical engagement metrics.

## 🛠️ Tech Stack

### Frontend
- **React.js & Vite**: Fast, modern development and build system.
- **Framer Motion**: Smooth, high-end micro-animations and transitions.
- **React Router 6**: Robust client-side routing with dynamic profile support.
- **Context API**: Global state management for Auth and Real-time Data.

### Backend
- **Node.js & Express**: Scalable server architecture.
- **MongoDB & Mongoose**: Flexible NoSQL data modeling.
- **JWT Auth**: Secure, stateless authentication flow.
- **Multer**: Optimized handling for profile image and resume uploads.

## 🏁 Getting Started

### Prerequisites
- Node.js (LTS)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Priyanshu-x/Student-Connect
   cd Student-Connect
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup:**
   ```bash
   cd student-showcase
   npm install
   ```
   Create a `.env` file in `student-showcase/`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Running Locally

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd student-showcase && npm run dev`

## 📂 Project Structure

```
Student-Connect/
├── backend/                  # Express Server & API
│   ├── src/
│   │   ├── models/           # Mongoose Schemas (User, Project)
│   │   ├── routes/           # API Endpoints
│   │   └── middleware/       # Auth & Error handling
│   └── scripts/              # Seed & Setup scripts
└── student-showcase/         # React Frontend
    ├── src/
    │   ├── context/          # Auth & Data Global State
    │   ├── pages/            # Home, Profile, Dashboard
    │   └── components/       # Reusable UI Blocks
```

## 🎨 Design System

The platform follows a **Premium Monochromatic** theme:
- **Primary**: Slate 900 (`#0f172a`) & Slate 800 (`#1e293b`)
- **Accents**: Pure White (`#FFFFFF`) & Electric Blue (`#3B82F6`)
- **Typography**: Inter / System Sans
- **Visuals**: Glassmorphism, subtle gradients, and soft shadows.

---
Developed with ❤️ for the student community.