import { IContainer } from '@power-cms/common/application';
import MongoMemoryServer from 'mongodb-memory-server';
import { createContainer } from '../../infrastructure/awilix.container';
import { AuthService } from './service';

describe('Service', () => {
  let container: IContainer;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = String(await mongo.getPort());
    process.env.DB_DATABASE = await mongo.getDbName();

    container = await createContainer();
  });

  it('Creates service', async () => {
    const service = container.resolve<AuthService>('service');

    expect(service.name).toBe('auth');
    expect(Array.isArray(service.actions)).toBeTruthy();
  });
});
