import { ActionType, IActionData, IActionHandler } from '@power-cms/common/application';
import { Token } from '../../domain/token';

export class AuthenticateAction implements IActionHandler {
  public name: string = 'authenticate';
  public type: ActionType = ActionType.CREATE;
  public private: boolean = true;

  public async handle(action: IActionData): Promise<any> {
    try {
      return Token.fromAccessTokenString(String(action.data.token)).getPayload();
    } catch (e) {
      // todo: throw proper exception
      throw e;
    }
  }
}
