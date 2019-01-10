import { PersistanceException } from '@power-cms/common/domain';
import { ObjectIDFactory } from '@power-cms/common/infrastructure';
import { Collection, Db } from 'mongodb';
import { ICredentialsQuery } from '../application/query/credentials.query';
import { CredentialsView } from '../application/query/credentials.view';
import { Credentials } from '../domain/credentials';
import { ICredentialsRepository } from '../domain/credentials.repository';
import { CredentialsNotFoundException } from '../domain/exception/credentials-not-found.exception';

export class MongodbCredentials implements ICredentialsRepository, ICredentialsQuery {
  private static COLLECTION_NAME = 'credentials';

  constructor(private readonly db: Promise<Db>) {}

  public async getByUserId(userId: string): Promise<CredentialsView> {
    const collection = await this.getCollection();
    const credentials = await collection.findOne({ userId });

    if (credentials === null) {
      throw CredentialsNotFoundException.withGivenPassword();
    }

    return new CredentialsView(credentials._id, credentials.userId, credentials.password);
  }

  public async create(credentials: Credentials): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.insertOne({
        _id: ObjectIDFactory.fromDomainId(credentials.getId()),
        userId: credentials.getUserId(),
        password: credentials.getPassword(),
      });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  private async getCollection(): Promise<Collection> {
    const db = await this.db;

    return db.collection(MongodbCredentials.COLLECTION_NAME);
  }
}
