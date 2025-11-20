# Student Showcase Platform

This is a full-stack web application designed to showcase student projects. It features a robust backend for user authentication, event management, leaderboards, and notifications, coupled with a dynamic and interactive React frontend.

## Features

*   **User Authentication:** Secure user registration, login, and profile management.
*   **Project Showcase:** Allows students to upload and display their projects.
*   **Event Management:** Create and manage events related to project showcases or student activities.
*   **Leaderboard:** Track and display top-performing projects or active users.
*   **Notifications:** Real-time notifications for important updates or activities.
*   **Profile Management:** Users can manage their personal information and project listings.

## Technologies Used

### Frontend

*   **React.js:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for the browser and node.js.
*   **Framer Motion:** A production-ready motion library for React.
*   **React Icons:** Popular icon packs as React components.
*   **CSS:** For styling the application.

### Backend

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** NoSQL database for storing application data.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **JWT (JSON Web Tokens):** For secure authentication and authorization.
*   **Bcryptjs:** For hashing passwords securely.
*   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
*   **Dotenv:** Loads environment variables from a .env file.
*   **Nodemon:** A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn
*   MongoDB (locally installed or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/student-showcase.git
    cd student-showcase
    ```

2.  **Backend Setup:**
    ```bash
    cd project-root/backend
    npm install
    ```
    Create a `.env` file in the `project-root/backend` directory and add your environment variables. Example:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd project-root/backend
    npm run server # or npm start for production
    ```
    The backend server will run on `http://localhost:5000` (or the port specified in your .env).

2.  **Start the Frontend Development Server:**
    ```bash
    cd project-root/frontend
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173` (or another port as indicated by Vite).

## Folder Structure

```
project-root/
├── backend/                  # Backend application (Node.js, Express, MongoDB)
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server file
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose schemas
│   └── routes/               # API routes
└── frontend/                 # Frontend application (React, Vite)
    ├── .gitignore
    ├── package.json          # Frontend dependencies
    ├── index.html            # Main HTML file
    ├── vite.config.js        # Vite configuration
    ├── public/               # Static assets
    └── src/                  # React source code
        ├── api.js            # API client
        ├── App.css           # Global CSS for App component
        ├── App.jsx           # Main App component
        ├── index.css         # Global CSS
        ├── main.jsx          # Entry point for React app
        ├── assets/           # Images and other assets
        └── utils/            # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the ISC License.

## Color Palette

The application uses a "Light Dashboard with Vibrant Accents" theme, inspired by a modern tech startup vibe.

### Palette Details:
*   **Background:** Pure White (`#FFFFFF`)
*   **Primary Text/Elements:** Dark Navy (`#0F172A`)
*   **Accent 1 (Electric Blue):** `#3B82F6` (used for general accents, links, primary buttons)
*   **Accent 2 (Lime Green):** `#84CC16` (used for progress indicators, secondary buttons)
*   **Accent 3 (Purple):** `#A855F7` (used for badges and specific highlight elements)

**Rationale:** The design emphasizes clean light backgrounds with carefully chosen vibrant accents to highlight specific interactive elements and data, avoiding an overwhelming color scheme.