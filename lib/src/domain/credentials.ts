import { Id } from '@power-cms/common/domain';
import { compareSync, hashSync } from 'bcrypt';
import { CredentialsNotFoundException } from './exception/credentials-not-found.exception';

export class Credentials {
  public static assertPasswordMatch(plainPassword: string, encryptedPassword: string): void {
    if (!compareSync(plainPassword, encryptedPassword)) {
      throw CredentialsNotFoundException.withGivenPassword();
    }
  }

  private readonly password: string;

  constructor(private id: Id, private userId: string, password: string) {
    this.password = hashSync(password, 10);
  }

  public getId(): Id {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPassword(): string {
    return this.password;
  }
}
