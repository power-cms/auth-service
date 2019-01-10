import { IContainer } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/src/domain';
import { Collection, Db } from 'mongodb';
import { createContainer } from './awilix.container';
import { Credentials } from '../domain/credentials';
import { ICredentialsRepository } from '../domain/credentials.repository';
import { ICredentialsQuery } from '../application/query/credentials.query';
import { CredentialsNotFoundException } from '../domain/exception/credentials-not-found.exception';

const MockCollection = jest.fn<Collection>(() => ({
  insertOne: jest.fn(() => {
    throw new Error();
  }),
  findOne: jest.fn(() => null),
}));

const properData = new Credentials(Id.generate(), Id.generate().toString(), 'P@$$word');

describe('Mongodb credentials', () => {
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

    const mongoHandler: ICredentialsRepository = container.resolve<ICredentialsRepository>('credentialsRepository');

    await expect(mongoHandler.create(properData)).rejects.toThrowError(PersistanceException);
  });

  it("Throws error if credentials doesn't exist", async () => {
    const mongoHandler: ICredentialsQuery = container.resolve<ICredentialsQuery>('credentialsRepository');

    await expect(mongoHandler.getByUserId('not-existing-id')).rejects.toThrowError(CredentialsNotFoundException);
  });
});
