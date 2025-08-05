# Temple Donation Management System

## 📁 Clean Project Structure

```
📂 Temple Donation Management System
├── 📂 frontend/          # ✨ All Frontend Files
│   ├── 📂 client/        # React application
│   │   ├── 📂 src/       # Components, pages, hooks, contexts
│   │   └── index.html    # Main HTML file
│   └── 📂 public/        # Static assets (icons, images)
│
├── 📂 backend/           # ⚙️ All Backend Files
│   ├── 📂 server/        # Express server code
│   │   ├── index.ts      # Main server entry point
│   │   ├── routes.ts     # API endpoints
│   │   ├── storage.ts    # Database operations
│   │   └── models/       # MongoDB data models
│   └── 📂 shared/        # Shared schemas and types
│
├── 📂 config/            # 🔧 Configuration Files
│   ├── package.json      # Dependencies and scripts
│   ├── vite.config.ts    # Build configuration
│   ├── tailwind.config.ts # Styling configuration
│   └── components.json   # UI components config
│
└── 📄 Documentation     # 📚 Project Documentation
    ├── README.md         # Project overview
    └── replit.md         # Technical documentation
```

## 🔧 Technology Stack

### Frontend (frontend/ folder)
- **React 18** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend (backend/ folder)
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **PostgreSQL** with Drizzle ORM (fallback)
- **TypeScript** for type safety

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 📋 Features

- ✅ Bilingual support (English/Tamil)
- ✅ Donation management with receipt generation
- ✅ Donor lookup and history tracking
- ✅ Admin panel with authentication
- ✅ Dashboard analytics and reports
- ✅ CSV/Excel import functionality
- ✅ Google Forms integration
- ✅ Mobile-responsive design

---
**Temple Donation Management System** - Organized folder structure for better development experience