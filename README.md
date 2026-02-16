
# ES GISHOMA Management System

A premium school representation platform with a fully functional public portal and administrative dashboard.

## Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Icons:** Lucide-React
- **Charts:** Recharts
- **State Management:** LocalStorage based Mock Database (simulating a full Node/Mongo backend)

## Key Features
- 🚀 **Public Portal:** Home, About, News, Gallery, Staff, and Contact pages.
- 🔐 **Admin Authentication:** Secure portal for staff and management.
- 📢 **Announcement System:** Full CRUD with category filtering and home-page featuring.
- 👨‍🏫 **Staff Management:** Interactive faculty profiles.
- 🖼️ **Asset Gallery:** Dynamic photo grid with category filtering and light-box.
- 📊 **Analytics Dashboard:** Real-time stats and traffic visualizations.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Access Admin Portal:**
   - **URL:** `/#/login`
   - **Email:** `admin@esgishoma.edu`
   - **Password:** `school2026`

## Production Notes
The current version uses a `MockDB` service to provide immediate functionality without a live MongoDB instance. For a production deployment, replace the `MockDB` logic with API calls to the provided Node.js/Express backend code.