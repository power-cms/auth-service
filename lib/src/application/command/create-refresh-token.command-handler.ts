import { BaseCreateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { RefreshToken } from '../../domain/refresh-token';
import { IRefreshTokenRepository } from '../../domain/refresh-token.repository';
import { ICreateRefreshTokenCommand } from './create-refresh-token.command';

export class CreateRefreshTokenCommandHandler extends BaseCreateCommandHandler<
  RefreshToken,
  ICreateRefreshTokenCommand
> {
  constructor(refreshTokenRepository: IRefreshTokenRepository) {
    super(refreshTokenRepository);
  }

  protected transform(command: ICreateRefreshTokenCommand): RefreshToken {
    return new RefreshToken(Id.fromString(command.id), command.userId, command.token);
  }
}
