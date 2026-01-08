# AP Constructions – Frontend

AP Constructions is a construction management web application designed to manage workers, attendance, payroll, expenses, and worksites efficiently.  
This repository contains the **frontend** built using React.

The frontend communicates with a Django REST API and provides a clean, responsive user interface for daily operational use.

---

## Tech Stack

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Axios
- React Router DOM
- JWT Authentication

---

## Features

- Secure login with JWT authentication
- Throttling-aware login handling
- Dashboard overview
- Worker management
- Client management
- Worksite management
- Attendance management with pagination
- Payroll management
- Worker salary ledger
- Expense tracking
- Protected routes for authenticated users
- Responsive UI for desktop and tablet

---

## Project Structure

src/
├── components/
│ ├── Navbar.jsx
│ ├── LoginModal.jsx
│ ├── ProtectedRoute.jsx
│
├── pages/
│ ├── Home.jsx
│ ├── Dashboard.jsx
│ ├── Workers.jsx
│ ├── Clients.jsx
│ ├── Worksites.jsx
│ ├── AttendanceList.jsx
│ ├── Payroll.jsx
│ ├── WorkerPayrollHistory.jsx
│ ├── Expenses.jsx
│
├── services/
│ ├── authService.js
│ ├── attendanceService.js
│ ├── payrollService.js
│
├── App.jsx
├── main.jsx



---

## Authentication Flow

- Login uses JWT access and refresh tokens
- Tokens are stored in localStorage
- Protected routes redirect unauthenticated users
- API throttling feedback is handled gracefully on the UI

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```


### 2. Run Development Server
```bash
npm run dev
```