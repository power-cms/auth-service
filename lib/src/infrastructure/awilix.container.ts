import {
  CommandHandlerLogger,
  IActionHandler,
  IContainer,
  ILogger,
  IRemoteProcedure,
  IService,
} from '@power-cms/common/application';
import {
  createDatabaseConnection,
  getDecorator,
  NullLogger,
  NullRemoteProcedure,
} from '@power-cms/common/infrastructure';
import * as awilix from 'awilix';
import { Db } from 'mongodb';
import { AuthenticateAction } from '../application/action/authenticate.action';
import { AuthorizeAction } from '../application/action/authorize.action';
import { LoginAction } from '../application/action/login.action';
import { RefreshTokenAction } from '../application/action/refresh-token.action';
import { RegisterAction } from '../application/action/register.action';
import { CreateCredentialsCommandHandler } from '../application/command/create-credentials.command-handler';
import { CreateRefreshTokenCommandHandler } from '../application/command/create-refresh-token.command-handler';
import { DeleteRefreshTokenCommandHandler } from '../application/command/delete-refresh-token.command-handler';
import { ICredentialsQuery } from '../application/query/credentials.query';
import { IRefreshTokenQuery } from '../application/query/refresh-token.query';
import { AuthService } from '../application/service/service';
import { ICredentialsRepository } from '../domain/credentials.repository';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository';
import { MongodbCredentials } from './mongodb.credentials';
import { MongodbRefreshToken } from './mongodb.refresh-token';

export const createContainer = (logger?: ILogger, remoteProcedure?: IRemoteProcedure): IContainer => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
  });

  const decorator = getDecorator(container);

  container.register({
    logger: awilix.asValue<ILogger>(logger || new NullLogger()),
    remoteProcedure: awilix.asValue<IRemoteProcedure>(remoteProcedure || new NullRemoteProcedure()),

    db: awilix.asValue<Promise<Db>>(createDatabaseConnection()),

    credentialsRepository: awilix.asClass<ICredentialsRepository>(MongodbCredentials).singleton(),
    credentialsQuery: awilix.asClass<ICredentialsQuery>(MongodbCredentials).singleton(),

    refreshTokenRepository: awilix.asClass<IRefreshTokenRepository>(MongodbRefreshToken).singleton(),
    refreshTokenQuery: awilix.asClass<IRefreshTokenQuery>(MongodbRefreshToken).singleton(),

    loginAction: awilix.asClass<LoginAction>(LoginAction).singleton(),
    registerAction: awilix.asClass<RegisterAction>(RegisterAction).singleton(),
    authenticateAction: awilix.asClass<AuthenticateAction>(AuthenticateAction).singleton(),
    authorizeAction: awilix.asClass<AuthorizeAction>(AuthorizeAction).singleton(),
    refreshTokenAction: awilix.asClass<RefreshTokenAction>(RefreshTokenAction).singleton(),

    service: awilix.asClass<IService>(AuthService).singleton(),
  });

  decorator.decorate('createCredentialsHandler', CreateCredentialsCommandHandler, CommandHandlerLogger);
  decorator.decorate('createRefreshTokenHandler', CreateRefreshTokenCommandHandler, CommandHandlerLogger);
  decorator.decorate('deleteRefreshTokenHandler', DeleteRefreshTokenCommandHandler, CommandHandlerLogger);

  container.register({
    actions: awilix.asValue<IActionHandler[]>([
      container.resolve<LoginAction>('loginAction'),
      container.resolve<RegisterAction>('registerAction'),
      container.resolve<AuthenticateAction>('authenticateAction'),
      container.resolve<AuthorizeAction>('authorizeAction'),
      container.resolve<RefreshTokenAction>('refreshTokenAction'),
    ]),
  });

  return container;
};
