import { NotFoundException } from '@power-cms/common/domain';

export class RefreshTokenNotFoundException extends NotFoundException {
  public static withGivenToken(): RefreshTokenNotFoundException {
    return new RefreshTokenNotFoundException('Refresh token cannot be found.');
  }
}
