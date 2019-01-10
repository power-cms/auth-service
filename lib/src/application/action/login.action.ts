import { ActionType, IActionData, IActionHandler, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { JoiObject } from 'joi';
import { Credentials } from '../../domain/credentials';
import { Token } from '../../domain/token';
import { CreateRefreshTokenCommandHandler } from '../command/create-refresh-token.command-handler';
import { ICredentialsQuery } from '../query/credentials.query';
import { TokensView } from '../query/tokens.view';
import { IUserView } from '../query/user.view';
import { validator } from '../validator/login.validator';

interface ILoginData {
  login: string;
  password: string;
}

export class LoginAction implements IActionHandler {
  public name: string = 'login';
  public type: ActionType = ActionType.CREATE;
  public validator: JoiObject = validator;

  constructor(
    private credentialsQuery: ICredentialsQuery,
    private remoteProcedure: IRemoteProcedure,
    private createRefreshTokenHandler: CreateRefreshTokenCommandHandler
  ) {}

  public async handle(action: IActionData): Promise<TokensView> {
    try {
      const user = await this.remoteProcedure.call<IUserView>('user', 'getByLogin', action);
      const credentials = await this.credentialsQuery.getByUserId(user.id);

      const actionData: ILoginData = action.data;

      Credentials.assertPasswordMatch(actionData.password, credentials.password);

      const refreshToken = Token.createRefreshToken(actionData.login).getToken();

      await this.createRefreshTokenHandler.handle({
        id: Id.generate().toString(),
        userId: user.id,
        token: refreshToken,
      });

      return new TokensView(Token.createAccessToken(user).getToken(), refreshToken);
    } catch (e) {
      // todo: throw proper exception
      throw e;
    }
  }
}
