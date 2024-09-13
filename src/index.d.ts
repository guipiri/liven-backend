declare namespace Express {
  export interface Request {
    user?: { sub: string; iat: number; exp: number; email: string };
  }
}
