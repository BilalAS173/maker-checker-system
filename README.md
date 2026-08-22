# Maker-Checker Request Management System

A full-stack workflow application enforcing segregation of duties between request
initiators ("Makers") and approvers ("Checkers") — a control principle where no single
individual can both submit and approve the same request. Built as part of an internship
project at Meezan Bank's IT Development department.

## Features

- Role-based dashboards: Makers submit and track their own requests; Checkers review,
  approve, or reject requests across categorized tabs (Pending, Approved, Rejected)
- JWT-based authentication with role-based authorization enforced at the backend/database
  level, not just hidden in the UI
- Server-side pagination and search for efficient data retrieval as request volume scales
- Secure password storage using bcrypt hashing
- Rate-limiting and progressive request-throttling on login to mitigate brute-force attempts
- Centralized application state management via Redux Toolkit
- Reusable, generic `TableDisplay` component shared across Maker and Checker views
- Ongoing incremental migration of the frontend from JavaScript to TypeScript

## Tech Stack

**Frontend:** React, TypeScript (partial), Redux Toolkit, React Router, Material UI
**Backend:** Node.js, Express.js
**Database:** MySQL
**Auth & Security:** JSON Web Tokens (JWT), bcrypt, express-rate-limit, express-slow-down

## Project Structure
maker-checker-system/
├── frontend/ # React application
└── backend/ # Express REST API


## Getting Started

### Backend
cd backend
npm install

npm start
### Frontend
cd frontend
npm install
npm run dev


## Architecture Notes

The API follows REST conventions (GET, POST, PATCH) with resource-based endpoints.
Authentication is handled via JWT issued at login and verified via Express middleware
on every protected route. Role-based authorization middleware further restricts actions
(e.g., approving a request) to users holding the appropriate role on the specific
project in question.
