import { BaseCreateCommandHandler } from '@power-cms/common/application';
import { Id } from '@power-cms/common/domain';
import { Credentials } from '../../domain/credentials';
import { ICredentialsRepository } from '../../domain/credentials.repository';
import { ICreateCredentialsCommand } from './create-credentials.command';

export class CreateCredentialsCommandHandler extends BaseCreateCommandHandler<Credentials, ICreateCredentialsCommand> {
  constructor(credentialsRepository: ICredentialsRepository) {
    super(credentialsRepository);
  }

  protected transform(command: ICreateCredentialsCommand): Credentials {
    return new Credentials(Id.fromString(command.id), command.userId, command.password);
  }
}
