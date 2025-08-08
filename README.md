# Kanban Board

A full-stack Kanban board application with authentication, built using React (Vite, TypeScript, Tailwind) for the frontend and Node.js (Express, TypeScript, MongoDB) for the backend.

---

## Features

- User authentication (signup, login, JWT-based)
- Kanban board with tasks and lists
- Responsive UI with Tailwind CSS
- RESTful API with MongoDB

---

## Project Structure

```
visual-task-vista-main/
│
├── frontend/   # React + Vite + Tailwind (client)
│
└── backend/    # Node.js + Express + MongoDB (server)
```

---

## Getting Started

### 1. Clone the Repository


---

### 2. Setup the Backend

```sh
cd backend
npm install
```

- Create a `.env` file in `/backend` (see `.env.example` if present):

  ```
  MONGODB_URI=your_mongodb_connection_string
  PORT=5000
  ```

- Start the backend (dev mode):

  ```sh
  npm run dev
  ```

---

### 3. Setup the Frontend

```sh
cd ../frontend
npm install
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

### 4. API Endpoints

- **POST** `/api/auth/signup` — Register a new user
- **POST** `/api/auth/signin` — Login
- **GET** `/api/auth/profile` — Get current user (JWT required)

---

## Deployment

To deploy both frontend and backend on a single service (e.g., Render):

1. Build the frontend:
    ```sh
    cd frontend
    npm install
    npm run build
    ```
2. Serve the frontend static files from the backend in production (see backend `app.ts`).
3. Deploy the backend as a web service. The backend will serve the frontend from `/frontend/dist`.

---

## Environment Variables

Backend `.env` example:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## Scripts

### Backend

- `npm run dev` — Start backend in development (with nodemon)
- `npm run build` — Compile TypeScript
- `npm start` — Start backend in production

### Frontend

- `npm run dev` — Start frontend in development
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## License

MIT

---

## Author