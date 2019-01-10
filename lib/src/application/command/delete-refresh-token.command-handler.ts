import { BaseDeleteCommandHandler } from '@power-cms/common/application';
import { IRefreshTokenRepository } from '../../domain/refresh-token.repository';
import { IDeleteRefreshTokenCommand } from './delete-refresh-token.command';

export class DeleteRefreshTokenCommandHandler extends BaseDeleteCommandHandler<IDeleteRefreshTokenCommand> {
  constructor(refreshTokenRepository: IRefreshTokenRepository) {
    super(refreshTokenRepository);
  }

  protected getId(command: IDeleteRefreshTokenCommand): string {
    return command.id;
  }
}
