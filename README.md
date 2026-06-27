# SFR Digital Systems & Client Portal

A high-performance, responsive corporate showcase and integrated Client Operations Portal for **SFR Digital Systems**. This platform features real-time support ticket synchronization, interactive service status dashboards, and comprehensive project tracking.

---

## 🚀 Core Features

### 1. Corporate Solutions Showcase
- **Modern IT Catalog**: Highlighting specialized enterprise capabilities in Cloud Architecture, Cybersecurity, and AI/ML integrations.
- **Product Spotlight**: Showcasing cutting-edge proprietary tools like *SFR Shield Cybersecurity* with interactive metrics.

### 2. Live Client Portal
- **Simulated Role Switching**: Real-time perspective swapping between **Client User** and **Operations Manager/Engineer** to demonstrate end-to-end workflows.
- **Interactive Metrics Dashboard**: High-level views of contracted values, active sprints, and outstanding ticket backlogs.

### 3. Real-Time Ticketing Engine
- **Firestore Synchronization**: Support tickets update instantly across client and operations views using live database listeners.
- **Ticket Lifecycle Management**: Features for creating, responding to, and resolving technical support tickets.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Firebase (Firestore & Authentication)](https://firebase.google.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler/Build Tool**: [Vite](https://vite.dev/)

---

## 📦 Directory Structure

```text
├── assets/                       # Static media and graphic assets
├── src/
│   ├── components/
│   │   ├── ClientPortal.tsx      # Core operations dashboard & ticket desk
│   │   ├── HomeShowcase.tsx      # Main corporate solution panels
│   │   ├── Header.tsx            # Navigation header component
│   │   ├── Footer.tsx            # Application footer component
│   │   └── Icon.tsx              # Dynamic SVG icon component
│   ├── App.tsx                   # Core layout wrapper & route managers
│   ├── data.ts                   # Solution listings and initial seed structures
│   ├── dbService.ts              # Real-time Firestore transaction hooks
│   ├── firebase.ts               # Database and authentication initializers
│   ├── index.css                 # Global CSS and Tailwind definitions
│   ├── main.tsx                  # Client entry point
│   └── types.ts                  # Shared TypeScript models and interfaces
├── firebase-applet-config.json   # Connection credentials for the cloud backend
├── firestore.rules               # Production-grade database access controls
├── index.html                    # Application viewport entry
├── package.json                  # Dependencies and execution commands
└── tsconfig.json                 # TypeScript compiler configurations
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) (v9.x or higher)

### Installation
1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd sfr-digital
   ```

2. Install the necessary project dependencies:
   ```bash
   npm install
   ```

### Running the Application in Development
Boot the fast Vite-powered development server locally:
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Building for Production
Create an optimized production bundle of the application:
```bash
npm run build
```
The compiled assets will be generated in the `dist/` directory, ready for deployment to any static hosting provider.

---

## 🔒 Security & Data Isolation
The database is secured via custom Firebase Security Rules defined in `firestore.rules`. These rules guarantee:
- Absolute data separation between distinct corporate entities.
- Read/write path permissions restricted only to verified service accounts and authenticated clients.
- Schema verification for incoming telemetry logs and ticket responses.

---

## 📄 License
Licensed under the [MIT License](LICENSE). &copy; 2026 SFR Digital Systems Inc. All rights reserved.
