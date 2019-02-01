import { ActionType, BaseAction, IActionData, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { JoiObject } from 'joi';
import { CreateCredentialsCommandHandler } from '../command/create-credentials.command-handler';
import { IUserView } from '../query/user.view';
import { validator } from '../validator/register.validator';

export class RegisterAction extends BaseAction {
  public name: string = 'register';
  public type: ActionType = ActionType.CREATE;
  public validator: JoiObject = validator;

  constructor(
    private createCredentialsHandler: CreateCredentialsCommandHandler,
    private remoteProcedure: IRemoteProcedure
  ) {
    super();
  }

  public async perform(action: IActionData): Promise<IUserView> {
    try {
      const user = await this.remoteProcedure.call<IUserView>('user', 'create', action);
      const id = Id.generate();
      await this.createCredentialsHandler.handle({ ...action.data, userId: user.id, id: id.toString() });

      return user;
    } catch (e) {
      // todo: throw proper exception
      throw e;
    }
  }
}
