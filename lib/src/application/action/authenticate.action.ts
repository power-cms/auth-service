import { ActionType, BaseAction, IActionData } from '@power-cms/common/application';
import { Token } from '../../domain/token';

export class AuthenticateAction extends BaseAction {
  public name: string = 'authenticate';
  public type: ActionType = ActionType.CREATE;
  public private: boolean = true;

  public async perform(action: IActionData): Promise<any> {
    return Token.fromAccessTokenString(String(action.data.token)).getPayload();
  }
}
