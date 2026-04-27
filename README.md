# SiPeKa — HR Management System (DeepThought Assignment)

## HRMS Choice
I chose [SiPeKa (mern-employee-salary-management)](https://github.com/berthutapea/mern-employee-salary-management) because it has a clean React + Node/Express + Sequelize structure with payroll functionality built-in, making it a natural fit for the construction HR use case.

## AI Tools Used
- **Claude (Anthropic)** — Used for understanding the existing codebase structure, generating boilerplate for new features (Overtime model, controller, frontend form), and debugging validation logic. All generated code was manually reviewed and adapted to fit the existing patterns in the codebase.

## Setup Instructions

### Prerequisites
- Node.js v16+
- PostgreSQL
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Om2407/deep-th.git
cd deep-th
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:
```
APP_PORT=5000
SESS_SECRET=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sipeka_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Create the database in PostgreSQL:
```sql
CREATE DATABASE sipeka_db;
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```

### 4. Access the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Features Implemented

### Part 1 — Overtime Entry & Approval
- Site managers can log overtime for workers
- Worker selected from existing employee list
- Frontend validations:
  - All fields required
  - Overtime hours: 1–6 only
  - Date cannot be in the future
  - Date cannot be more than 7 days in the past
  - Reason minimum 10 characters
- Backend validations:
  - All same rules duplicated server-side
  - No duplicate entry for same worker + same date
  - Worker must exist in the system
  - Monthly cap of 60 hours enforced

### Part 2 — Ticket Fixes
| Ticket | Description | Status |
|--------|-------------|--------|
| LF-101 | Date format changed to DD/MM/YYYY | ✅ Done |
| LF-102 | Negative salary values rejected on frontend + backend | ✅ Done |
| LF-103 | Designation dropdown added to employee form and list | ✅ Done |
| LF-104 | CSV export button added on employee list page | ✅ Done |
| LF-105 | Employee list table made responsive on mobile | ✅ Done |

---

## Notes on Implementation

- **LF-101**: Used `toLocaleDateString('en-GB')` which natively outputs DD/MM/YYYY — no extra library needed.
- **LF-102**: Both `min="0"` and `onKeyDown` prevention added on frontend; backend rejects negative values with a 400 error.
- **LF-103**: Designation is a dropdown (not free text) with values: Mason, Electrician, Plumber, Supervisor, Helper. Persisted in DB and shown in employee list.
- **LF-104**: Pure JavaScript CSV generation — no external library used.
- **LF-105**: Added `minWidth: 700px` on the table inside an already-existing `overflow-x-auto` wrapper.