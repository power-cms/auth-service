import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { TokensView } from '../query/tokens.view';
import { RefreshTokenAction } from './refresh-token.action';
import { Token } from '../../domain/token';
import { CreateRefreshTokenCommandHandler } from '../command/create-refresh-token.command-handler';

const login = 'User';

const userData = {
  id: Id.generate().toString(),
  username: login,
  email: 'test@test.com',
};

const properData = {
  refreshToken: Token.createRefreshToken(login).getToken(),
};

const RemoteProcedureMock = jest.fn<IRemoteProcedure>(() => ({
  call: () => Promise.resolve(userData),
}));

describe('Refresh token action', () => {
  let container: IContainer;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await container.resolve<CreateRefreshTokenCommandHandler>('createRefreshTokenHandler').handle({
      id: Id.generate().toString(),
      userId: userData.id,
      token: properData.refreshToken,
    });
  });

  it('Refreshes token successfully', async () => {
    const action = container.resolve<RefreshTokenAction>('refreshTokenAction');
    const tokens: TokensView = await action.execute({ data: properData });

    const accessTokenPayload = Token.fromAccessTokenString(tokens.accessToken).getPayload();
    const refreshTokenPayload = Token.fromRefreshTokenString(tokens.refreshToken).getPayload();

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(accessTokenPayload.exp < refreshTokenPayload.exp).toBeTruthy();
  });
});
