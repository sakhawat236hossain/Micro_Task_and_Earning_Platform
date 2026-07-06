# Micro Task & Earning Platform

A responsive MERN stack platform where buyers post micro-tasks, workers complete them for coins, and admins manage the system.

## Project Goal
This project will be built in small, manageable steps so that the core business flow is completed first and advanced features are added only when the base app is stable.

## Website Name
TaskEarn Hub

## Admin Credentials
- Admin Email: admin@taskearnhub.com
- Admin Password: Admin@12345

## Live Links
- Frontend: https://your-live-site-link.netlify.app
- Backend: https://your-backend-url.render.com

## Client Repository
- https://github.com/your-username/taskearn-client

## Server Repository
- https://github.com/your-username/taskearn-server

## Main Features
- Responsive landing page with animated hero section and sliders
- Role-based authentication for Buyer, Worker, and Admin
- Buyer dashboard for adding tasks, reviewing submissions, and managing payments
- Worker dashboard for browsing tasks, submitting work, and withdrawing coins
- Admin dashboard for managing users, tasks, withdrawals, and reports
- Notification system for task updates and payout actions
- Secure environment variable setup for Firebase and MongoDB credentials

## Implementation Plan (Step by Step)

### Phase 1: Project Setup
- Create the frontend and backend folders structure
- Initialize React + Vite frontend
- Initialize Node.js + Express backend
- Connect MongoDB database
- Add environment variable support
- Create base routes and folder structure

### Phase 2: Authentication and Role System
- Create user model with role, coin, and profile fields
- Implement registration with validation
- Implement login with validation
- Add Google sign-in option
- Store JWT in local storage
- Create protected routes for Buyer, Worker, and Admin
- Add middleware for role-based authorization

### Phase 3: Core UI and Layout
- Build the main navigation and footer
- Create the public home page with hero slider and extra sections
- Create responsive dashboard layout for each role
- Add reusable cards, tables, forms, and modals
- Ensure mobile, tablet, and desktop responsiveness

### Phase 4: Buyer Features
- Create task creation form
- Save tasks in the database
- Show buyer statistics on the dashboard
- Display pending submissions for review
- Approve or reject submissions
- Increase or decrease coins based on submission outcome
- Show payment history

### Phase 5: Worker Features
- Show available tasks where required workers are still needed
- Create task details page with submission form
- Save submissions to the database
- Show worker submission history with status highlights
- Add withdrawal form and coin-to-dollar calculation
- Prevent withdrawals when coins are insufficient

### Phase 6: Admin Features
- Show admin summary cards
- Manage withdrawal requests and approve payouts
- Manage users and update roles
- Delete users if required
- Manage tasks and remove tasks if needed

### Phase 7: Advanced Features
- Add notification creation and popup display
- Add pagination on worker submission page
- Add image upload support using imgBB
- Add Stripe or dummy payment flow for coin purchase
- Add search and filters if time allows

### Phase 8: Final Polish and Deployment
- Test all routes and dashboards
- Fix responsive issues
- Add meaningful content instead of placeholder text
- Deploy frontend and backend
- Verify protected routes after reload
- Prepare README, admin credentials, and live links

## Git Commit Strategy
To satisfy the assessment requirement, the work will be split into many small commits:
- 20+ frontend commits
- 12+ backend commits

Suggested commit pattern:
- Setup and structure
- Auth pages
- Protected routing
- Dashboard layout
- Buyer features
- Worker features
- Admin features
- Notifications
- Payment flow
- Final fixes and deployment

## Environment Variables Needed
- MongoDB connection string
- JWT secret
- Firebase config values
- imgBB API key
- Stripe secret key (optional for first version)

## Scope for the First Version
The first version will focus on the core business flow:
- Authentication
- Role-based dashboards
- Task posting and completion
- Coin management
- Submission review
- Withdrawal flow
- Admin management

Optional or later-stage features can be skipped if needed to keep the project stable and complete.
