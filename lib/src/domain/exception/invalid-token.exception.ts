import { ForbiddenException } from '@power-cms/common/domain';

export class InvalidTokenException extends ForbiddenException {
  public static withGivenToken(): InvalidTokenException {
    return new InvalidTokenException('The given token is invalid');
  }
}
