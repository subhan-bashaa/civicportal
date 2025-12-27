    # CivicReport – Demo Civic Issue Reporting System

CivicReport is a **hackathon demo web application** designed to help citizens report local civic issues and track their resolution transparently.

The system focuses on **speed, accountability, and public visibility** rather than production-scale complexity.

---

## 🚀 Problem Statement
Existing civic cleanliness and issue-reporting platforms lack:
- Clear response timelines (SLA visibility)
- Public accountability at ward level
- Easy re-open mechanisms when issues are not properly resolved

---

## 💡 Solution
CivicReport provides:
- Simple complaint submission by citizens
- Visual SLA timers for each complaint
- Re-open complaints with proof
- Ward-wise public dashboard for accountability

This project is built **only for demonstration purposes** during a hackathon.

---

## 👥 User Roles

### Citizen
- Submit civic complaints
- Track complaint status
- View SLA timer
- Re-open resolved complaints with new proof

### Ward Officer
- View complaints for assigned ward
- Update complaint status (Open → In Progress → Resolved)

### Admin
- View ward-wise public dashboard
- Monitor resolution performance and re-open counts

---

## ✨ Key Features
- Complaint submission with image & category
- Status tracking with SLA visual timer
- Re-open complaint functionality
- Ward-wise public dashboard
- Map-based visualization (demo)

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Python Flask (REST APIs)
- PostgreSQL

---

## 🧪 Demo Credentials

| Role | Email | Password |
|-----|------|---------|
| Citizen | citizen@test.com | password123 |
| Ward Officer | officer@test.com | password123 |
| Admin | admin@test.com | password123 |

---

## 📂 Project Structure
This repository contains a Vite + React frontend under `src/` and a demo backend under `server/`. Key folders:

- `src/` — React app and components
- `src/pages/` — Page routes (Dashboard, Complaints, NewComplaint, etc.)
- `src/components/` — UI components and shared widgets
- `server/` — Demo backend (Flask) and seed scripts
- `public/` — Static assets

---

## Local development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev



---


