// Session type definitions for Express
declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    username?: string;
    role?: 'admin' | 'superadmin';
  }
}