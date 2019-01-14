import { IContainer } from '@power-cms/common/application';
import { createContainer } from '../../infrastructure/awilix.container';
import { AuthService } from './service';

describe('Service', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Creates service', async () => {
    const service = container.resolve<AuthService>('service');

    expect(service.name).toBe('auth');
    expect(Array.isArray(service.actions)).toBeTruthy();
  });
});
