import { IActionHandler, IService } from '@power-cms/common/application';

export class AuthService implements IService {
  public name: string = 'auth';

  constructor(public actions: IActionHandler[]) {}
}
