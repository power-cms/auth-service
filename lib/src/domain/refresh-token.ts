import { Id } from '@power-cms/common/domain';

export class RefreshToken {
  constructor(private id: Id, private userId: string, private token: string) {}

  public getId(): Id {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getToken(): string {
    return this.token;
  }
}
