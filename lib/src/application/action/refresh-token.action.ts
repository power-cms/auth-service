import { ActionType, BaseAction, IActionData, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { JoiObject } from 'joi';
import { Token } from '../../domain/token';
import { CreateRefreshTokenCommandHandler } from '../command/create-refresh-token.command-handler';
import { DeleteRefreshTokenCommandHandler } from '../command/delete-refresh-token.command-handler';
import { IRefreshTokenQuery } from '../query/refresh-token.query';
import { TokensView } from '../query/tokens.view';
import { IUserView } from '../query/user.view';
import { validator } from '../validator/refresh-token.validator';

interface IRefreshTokenData {
  refreshToken: string;
}

export class RefreshTokenAction extends BaseAction {
  public name: string = 'refresh_token';
  public type: ActionType = ActionType.CREATE;
  public validator: JoiObject = validator;

  constructor(
    private refreshTokenQuery: IRefreshTokenQuery,
    private createRefreshTokenHandler: CreateRefreshTokenCommandHandler,
    private deleteRefreshTokenHandler: DeleteRefreshTokenCommandHandler,
    private remoteProcedure: IRemoteProcedure
  ) {
    super();
  }

  public async perform(action: IActionData): Promise<TokensView> {
    const actionData: IRefreshTokenData = action.data;
    const token = await this.refreshTokenQuery.getByToken(actionData.refreshToken);

    const { login } = Token.fromRefreshTokenString(token.token).getPayload();
    const user = await this.remoteProcedure.call<IUserView>('user', 'getByLogin', { data: { login } });

    await this.deleteRefreshTokenHandler.handle({ id: token.id });

    const refreshToken = Token.createRefreshToken(login).getToken();

    await this.createRefreshTokenHandler.handle({
      id: Id.generate().toString(),
      userId: user.id,
      token: refreshToken,
    });

    return new TokensView(Token.createAccessToken(user).getToken(), refreshToken);
  }
}
