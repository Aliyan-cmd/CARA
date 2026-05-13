# CARA - Premium Fashion Brand

CARA is a high-end, full-stack e-commerce platform for a luxury clothing brand. It features a modern, responsive design with glassmorphism aesthetics and a robust backend.

## Features

- **Premium UI/UX**: Built with React and Vanilla CSS, featuring glassmorphism, fluid animations, and a champagne-gold luxury theme.
- **Dynamic Shop**: Paginated product grid with category filtering.
- **Full Checkout Flow**: Integrated multi-step checkout process.
- **Toast Notifications**: Interactive feedback for user actions.
- **Backend API**: Node.js & Express server with SQLite database.
- **Database Schema**: Comprehensive schema including products, categories, users, and orders.

## Tech Stack

- **Frontend**: React, Vite, Lucide React (Icons), React Router.
- **Backend**: Node.js, Express, SQLite3.
- **Database**: SQLite.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aliyan-cmd/CARA.git
   cd CARA
   ```

2. Install Backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install Frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the Backend server:
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`.

2. Start the Frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to **Vercel**.
2. Vercel will automatically detect the `vercel.json` configuration in the root.
3. In the Vercel Dashboard:
   - Ensure the **Build Command** is set to `npm run build` (detected automatically).
   - The backend is served via Vercel Functions in the `api/` directory.
4. **Note on SQLite**: This project uses SQLite for demonstration. On Vercel, the database is stored in `/tmp` and will reset when the serverless function restarts. For production, consider migrating to a hosted database like PostgreSQL or MongoDB.

## License

ISC
