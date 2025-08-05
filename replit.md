# Temple Donation Management System

## Overview
A comprehensive bilingual (English/Tamil) web application for managing temple donations. It focuses on efficient tracking, phone-based donor identification, real-time analytics, and seamless Google Forms integration. The system empowers temple administrators to manage donations, generate receipts, track donor history, and maintain detailed records via a standard web interface, aiming to streamline operations and enhance transparency.

## User Preferences
- Preferred communication style: Simple, everyday language (Tamil/English mix)
- User confirmed app functionality working correctly (August 2, 2025)
- Language preference: Both JavaScript and TypeScript available, user can choose either (August 5, 2025)
- Codebase cleanup: Removed all unused JavaScript and TypeScript files (August 5, 2025)

## Current Status (August 5, 2025)
- **Issue Resolved**: App is successfully running on localhost:5000
- **Build Status**: All build processes working successfully (frontend & backend)
- **Server Configuration**: Using server/index.ts with simplified static file serving (removed complex vite middleware)
- **Database**: PostgreSQL 16.9 connected and working perfectly
- **Static Files**: Serving from dist/public with proper asset loading (69KB CSS, 883KB JS)
- **API Endpoints**: All core functionality tested and working
- **Performance**: Fast response times (1-2ms for API calls)
- **TypeScript**: All compilation errors fixed, no LSP diagnostics found
- **Local Windows Setup**: Successfully configured with Neon database connection, environment variables properly loaded via PowerShell, application running on localhost:5000
- **Dashboard Filtering**: All date range options fully functional (All Time, This Year, Last Year, This Month, Last Month, Custom Range) - confirmed working by user
- **Windows Production**: Created Windows-compatible production startup scripts (start-production.js, start-production.bat) and comprehensive documentation (WINDOWS_PRODUCTION_START.md)
- **Windows Local Development**: Successfully resolved NODE_ENV environment variable issues for Windows users, created .bat file for easy startup, fixed database connection string format (removed channel_binding parameter), confirmed application running locally on Windows with tsx server/index.ts command

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: Custom language context for English and Tamil.
- **UI/UX**: Touch-friendly interface, mobile responsive design, print-ready receipts, password visibility toggles, optimized scrolling for tables, enhanced required field indicators.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database ORM**: Drizzle ORM (initially), transitioned to MongoDB-style API with PostgreSQL for Replit compatibility.
- **Validation**: Zod schemas for API request/response.
- **Session Management**: Express session middleware for authentication.
- **Security**: Admin credential management, role-based access (Admin, Superadmin), session timeouts, secure cookies, protected API endpoints.
- **Performance**: Compression, caching (2-minute dashboard cache, 24-hour static asset caching), fast query hooks, loading spinners, memoized components, optimized API response times.

### Database Design
- **Primary Database**: PostgreSQL (Neon serverless configuration) supporting MongoDB-style operations.
- **Schema Strategy**: Phone number as primary donor identifier.
- **Receipt System**: Sequential numbering (YYYY-NNNN) with yearly reset.
- **Migration Support**: Drizzle Kit for automated database migrations.

### Key Features
- **Donation Management**: Form-based entry, automatic receipt generation, multi-mode payments (cash, card, UPI, bank transfer, cheque), phone-based donor lookup with history.
- **Dashboard Analytics**: Real-time statistics, customizable filters (date range, community, payment mode, amount), CSV export.
- **User Management**: Secure admin login, role-based access, credential management, bilingual login form.
- **Integration Features**: Google Forms integration (template and webhook setup), bilingual English/Tamil interface, mobile responsiveness, print-ready receipt formatting.
- **Data Import**: CSV and Excel (.xlsx, .xls) import with flexible header mapping, comprehensive validation, error handling, and date parsing (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, Excel serial numbers). Duplicate receipt number prevention.
- **Core Functionality**: Delete All with confirmation, single-click button optimization, improved error handling.

## External Dependencies

### Core
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver.
- **drizzle-orm**: Type-safe database ORM (used for PostgreSQL).
- **@tanstack/react-query**: Server state management and caching.
- **@radix-ui/***: Accessible UI components foundation.
- **wouter**: Lightweight routing for React applications.

### Development & Deployment
- **Vite**: Fast build tool.
- **TypeScript**: Type checking and compilation (though partial migration to JavaScript occurred).
- **Tailwind CSS**: Utility-first CSS framework.
- **ESBuild**: Fast JavaScript bundler.
- **Neon Database**: Serverless PostgreSQL hosting.
- **Google Forms**: Used for remote donation collection.
- **Replit**: Development and deployment platform.
```