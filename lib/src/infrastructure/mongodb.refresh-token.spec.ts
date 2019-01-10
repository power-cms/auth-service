import { IContainer } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/src/domain';
import { Collection, Db } from 'mongodb';
import { createContainer } from './awilix.container';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository';
import { RefreshToken } from '../domain/refresh-token';
import { Token } from '../domain/token';
import { IRefreshTokenQuery } from '../application/query/refresh-token.query';
import { RefreshTokenNotFoundException } from '../domain/exception/refresh-token-not-found.exception';

const MockCollection = jest.fn<Collection>(() => ({
  insertOne: jest.fn(() => {
    throw new Error();
  }),
  findOne: jest.fn(() => null),
}));

const properData = new RefreshToken(
  Id.generate(),
  Id.generate().toString(),
  Token.createRefreshToken('Test').getToken()
);

describe('Mongodb refresh token', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Throws persistance exception', async () => {
    const db = await container.resolve<Db>('db');
    db.collection = MockCollection;

    const mongoHandler: IRefreshTokenRepository = container.resolve<IRefreshTokenRepository>('refreshTokenRepository');

    await expect(mongoHandler.create(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.delete('test')).rejects.toThrowError(PersistanceException);
  });

  it("Throws error if refresh token doesn't exist", async () => {
    const mongoHandler: IRefreshTokenQuery = container.resolve<IRefreshTokenQuery>('refreshTokenRepository');

    await expect(mongoHandler.getByToken('fake-token')).rejects.toThrowError(RefreshTokenNotFoundException);
  });
});
