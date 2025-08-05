import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    username?: string;
    role?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: import('express-session').SessionData & Partial<import('express-session').Session>;
  }
}