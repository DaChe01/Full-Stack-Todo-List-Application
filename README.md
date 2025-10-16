# SPCL Task Manager

SPCL Task Manager is a full-stack web application that allows users to efficiently manage their tasks with a modern, responsive, and user-friendly interface. Built with **React** for the frontend, **Node.js/Express** for the backend, and **PostgreSQL** as the database, it includes features like task creation, editing, priority management, due dates, filtering, sorting, and more.

---

## Features

* User authentication with JWT (register and login)
* Create, update, and delete tasks
* Mark tasks as completed
* Set task priority (High, Medium, Low) with color-coded badges
* Add due dates to tasks
* Filter tasks by All, Active, Completed
* Sort tasks by Date, Priority, or Alphabetically
* Search tasks by title
* Clear all completed tasks
* Responsive and modern UI with smooth animations and hover effects
* Welcome and motivational message on dashboard

---

## Tech Stack

* **Frontend:** React, CSS/Tailwind
* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **Authentication:** JWT

---

## Installation

### Backend

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following environment variables:

```env
PORT=5000
DATABASE_URL=<your_postgres_connection_string>
JWT_SECRET=<your_jwt_secret>
```

4. Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Update the API base URL in `src/api/axios.js` if needed:

```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

4. Start the frontend:

```bash
npm start
```

The app will run on `http://localhost:3000`.

---

## Usage

1. Open the app in your browser at `http://localhost:3000`.
2. Register a new account or log in with existing credentials.
3. Add new tasks using the input form with optional description, priority, and due date.
4. Use the search bar, filters, and sort options to organize your tasks.
5. Mark tasks as completed by checking the checkbox next to the task.
6. Edit or delete tasks using the corresponding buttons.
7. Clear all completed tasks with the "Clear Completed Tasks" button.
8. Logout when done.

---

## Deployment

The frontend can be deployed on **Vercel** or **Netlify**, and the backend can be deployed on **Render**, **Railway**, or any other cloud service. Make sure the frontend API base URL points to your deployed backend.

---

## Screenshots

### Homepage

![Homepage](frontend/public/images/homepage.png)

### Login Page

![Login Page](frontend/public/images/loginpage.png)

### Register Page

![Register Page](frontend/public/images/registerpage.png)

### Tasks Dashboard

![Tasks Page](frontend/public/images/taskspage.png)
