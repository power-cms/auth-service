import { IContainer, IRemoteProcedure, IActionData } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { RegisterAction } from './register.action';
import { IUserView } from '../query/user.view';

const username = 'User';

const properData = {
  id: Id.generate().toString(),
  username,
  email: 'test@test.com',
};

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: (serviceName: string, actionName: string, action: IActionData) => {
    if (action.data.username === username) {
      return Promise.resolve(properData);
    }

    Promise.reject(new Error('Validation error'));
  },
}));

describe('Register action', () => {
  let container: IContainer;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Registers successfully', async () => {
    const action = container.resolve<RegisterAction>('registerAction');
    const user: IUserView = await action.handle({ data: { ...properData, password: 'P@$$word' } });

    expect(user).toBeDefined();
    expect(user).not.toHaveProperty('password');
  });

  it('Catches invalid user', async () => {
    const action = container.resolve<RegisterAction>('registerAction');
    const handler = action.handle({ data: { ...properData, username: 'NotExistingUser', password: 'P@$$word' } });

    await expect(handler).rejects.toThrowError();
  });
});
