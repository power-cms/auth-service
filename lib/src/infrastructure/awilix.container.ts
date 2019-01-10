import { IActionHandler, IContainer, ILogger, IRemoteProcedure, IService } from '@power-cms/common/application';
import { createDatabaseConnection, NullLogger, NullRemoteProcedure } from '@power-cms/common/infrastructure';
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

  container.register({
    logger: awilix.asValue<ILogger>(logger || new NullLogger()),
    remoteProcedure: awilix.asValue<IRemoteProcedure>(remoteProcedure || new NullRemoteProcedure()),

    db: awilix.asValue<Promise<Db>>(createDatabaseConnection()),

    credentialsRepository: awilix.asClass<ICredentialsRepository>(MongodbCredentials),
    credentialsQuery: awilix.asClass<ICredentialsQuery>(MongodbCredentials),

    refreshTokenRepository: awilix.asClass<IRefreshTokenRepository>(MongodbRefreshToken),
    refreshTokenQuery: awilix.asClass<IRefreshTokenQuery>(MongodbRefreshToken),

    createCredentialsHandler: awilix.asClass<CreateCredentialsCommandHandler>(CreateCredentialsCommandHandler),
    createRefreshTokenHandler: awilix.asClass<CreateRefreshTokenCommandHandler>(CreateRefreshTokenCommandHandler),
    deleteRefreshTokenHandler: awilix.asClass<DeleteRefreshTokenCommandHandler>(DeleteRefreshTokenCommandHandler),

    loginAction: awilix.asClass<LoginAction>(LoginAction),
    registerAction: awilix.asClass<RegisterAction>(RegisterAction),
    authenticateAction: awilix.asClass<AuthenticateAction>(AuthenticateAction),
    authorizeAction: awilix.asClass<AuthorizeAction>(AuthorizeAction),
    refreshTokenAction: awilix.asClass<RefreshTokenAction>(RefreshTokenAction),

    service: awilix.asClass<IService>(AuthService),
  });

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
