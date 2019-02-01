import { ActionType, BaseAction, IActionData } from '@power-cms/common/application';

interface IRules {
  roles?: string[];
  isAuthenticated?: boolean;
  isOwner?: boolean;
}

export class AuthorizeAction extends BaseAction {
  public name: string = 'authorize';
  public type: ActionType = ActionType.CREATE;
  public private: boolean = true;

  public async perform(action: IActionData): Promise<boolean> {
    const rules: IRules = action.data.rules;

    if (rules.isAuthenticated && !this.isAuthenticated(action)) {
      return false;
    }

    if (rules.isOwner && !this.isOwner(action)) {
      return false;
    }

    if (rules.roles && !this.hasRoles(action)) {
      return false;
    }

    return true;
  }

  private isAuthenticated(action: IActionData): boolean {
    const auth = action.auth;

    return auth && auth.id;
  }

  private isOwner(action: IActionData): boolean {
    if (!this.isAuthenticated(action)) {
      return false;
    }

    const resource: any = action.data.resource;
    const auth = action.auth;

    return resource && resource.ownerId && resource.ownerId === auth.id;
  }

  private hasRoles(action: IActionData): boolean {
    if (!this.isAuthenticated(action)) {
      return false;
    }

    const roles = action.data.rules.roles;
    const auth = action.auth;

    return (
      roles &&
      auth.roles &&
      auth.roles.reduce((hasRole: boolean, role: string) => {
        return hasRole || auth.roles.indexOf(role) !== -1;
      }, false)
    );
  }
}
