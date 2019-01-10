import { IContainer, IRemoteProcedure, IActionData } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { LoginAction } from './login.action';
import { TokensView } from '../query/tokens.view';
import { RegisterAction } from './register.action';
import { CredentialsNotFoundException } from '../../domain/exception/credentials-not-found.exception';
import { Token } from '../../domain/token';

const login = 'User';

const userData = {
  id: Id.generate().toString(),
  username: login,
  email: 'test@test.com',
};

const properData = {
  login,
  password: 'P@$$word',
};

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: (serviceName: string, actionName: string, action: IActionData) => {
    if (action.data.login === login) {
      return Promise.resolve(userData);
    }

    return Promise.reject(new Error('User not found'));
  },
}));

describe('Login action', () => {
  let container: IContainer;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await container.resolve<RegisterAction>('registerAction').handle({ data: { ...userData, ...properData } });
  });

  it('Loggs in successfully', async () => {
    const action = container.resolve<LoginAction>('loginAction');
    const tokens: TokensView = await action.handle({ data: properData });

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(Token.fromRefreshTokenString(tokens.refreshToken).getPayload().login).toBe(login);
  });

  it('Catches bad credentials', async () => {
    const action = container.resolve<LoginAction>('loginAction');
    const handler = action.handle({ data: { ...properData, password: 'Wrong password' } });

    expect.assertions(1);

    await expect(handler).rejects.toThrowError(CredentialsNotFoundException);
  });

  it('Validates login data', async () => {
    const action = container.resolve<LoginAction>('loginAction');

    expect.assertions(2);

    expect(() => {
      validate({}, action.validator);
    }).toThrowError(ValidationException);

    try {
      validate({}, action.validator);
    } catch (e) {
      const messageRequired = 'any.required';

      expect(e.details).toEqual([
        { path: 'login', message: messageRequired },
        { path: 'password', message: messageRequired },
      ]);
    }
  });

  it('Catches not found user', async () => {
    const action = container.resolve<LoginAction>('loginAction');
    const handler = action.handle({ data: { ...properData, login: 'NotExistingUser' } });

    expect.assertions(1);

    await expect(handler).rejects.toThrowError();
  });
});
