import { NotFoundException } from '@power-cms/common/domain';

export class CredentialsNotFoundException extends NotFoundException {
  public static withGivenPassword(): CredentialsNotFoundException {
    return new CredentialsNotFoundException('Credentials with given password cannot be found.');
  }
}
