import * as jwt from 'jsonwebtoken';

export class Token {
  public static createAccessToken(user: any): Token {
    const payload = { ...user };
    const token = jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '1h' });

    return new Token(token, payload);
  }

  public static createRefreshToken(login: string): Token {
    const token = jwt.sign({ login }, String(process.env.REFRESH_TOKEN_SECRET), { expiresIn: '30 days' });

    return new Token(token);
  }

  public static fromAccessTokenString(token: string): Token {
    const payload = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

    return new Token(token, payload);
  }

  public static fromRefreshTokenString(token: string): Token {
    const payload = jwt.verify(token, String(process.env.REFRESH_TOKEN_SECRET));

    return new Token(token, payload);
  }

  private constructor(private token: string, private payload: any = {}) {}

  public getToken(): string {
    return this.token;
  }

  public getPayload(): any {
    return this.payload;
  }
}
