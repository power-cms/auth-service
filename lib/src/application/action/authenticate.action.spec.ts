import { IContainer } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { createContainer } from '../../infrastructure/awilix.container';
import { AuthenticateAction } from './authenticate.action';
import { Token } from '../../domain/token';

const userData = {
  id: Id.generate().toString(),
  username: 'User',
  email: 'test@test.com',
};

describe('Authenticate action', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Authenticates successfully', async () => {
    const token = Token.createAccessToken(userData).getToken();

    const action = container.resolve<AuthenticateAction>('authenticateAction');
    const { iat, exp, ...user } = await action.handle({ data: { token } });

    expect(user).toEqual(userData);
  });

  // it('Catches invalid sign', async () => {
  //   process.env.ACCESS_TOKEN_SECRET = 'FAKE SECRET';
  //   const token = Token.createAccessToken(userData).getToken();

  //   const action = container.resolve<AuthenticateAction>('authenticateAction');
  //   const handler = action.handle({data: {token}});

  //   expect(handler).rejects.toThrowError();
  // });
});
