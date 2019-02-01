import { IContainer } from '@power-cms/common/application';
import { createContainer } from '../../infrastructure/awilix.container';
import { AuthorizeAction } from './authorize.action';

describe('Authorize action', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Authorizes sucessfully with all options', async () => {
    const data = {
      rules: {
        isAuthenticated: true,
        isOwner: true,
        roles: ['Admin'],
      },
      resource: {
        ownerId: 'dummy-id',
      },
    };

    const auth = {
      id: 'dummy-id',
      roles: ['Users', 'Admin', 'SomeGroup'],
    };

    const action = container.resolve<AuthorizeAction>('authorizeAction');
    const result = await action.execute({ auth, data });

    expect(result).toBe(true);
  });

  it('Handles unauthorized', async () => {
    const data = {
      rules: {
        isAuthenticated: true,
      },
    };

    const action = container.resolve<AuthorizeAction>('authorizeAction');
    const result = await action.execute({ data });

    expect(result).toBe(false);
  });

  it('Handles not owner user', async () => {
    const data = {
      rules: {
        isOwner: true,
      },
      resource: {
        ownerId: 'dummy-id',
      },
    };

    const auth = {
      id: 'another-id',
    };

    const action = container.resolve<AuthorizeAction>('authorizeAction');
    const result = await action.execute({ auth, data });

    expect(result).toBe(false);
  });

  it('Handles not owner user when unauthenticated', async () => {
    const data = {
      rules: {
        isOwner: true,
      },
      resource: {
        ownerId: 'dummy-id',
      },
    };

    const action = container.resolve<AuthorizeAction>('authorizeAction');
    const result = await action.execute({ data });

    expect(result).toBe(false);
  });

  it('Handles wrong role user', async () => {
    const data = {
      rules: {
        roles: ['Admin'],
      },
    };

    const auth = {
      roles: ['Users', 'SomeGroup'],
    };

    const action = container.resolve<AuthorizeAction>('authorizeAction');
    const result = await action.execute({ auth, data });

    expect(result).toBe(false);
  });
});
