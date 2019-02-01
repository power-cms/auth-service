import { PersistanceException } from '@power-cms/common/domain';
import { ObjectIDFactory } from '@power-cms/common/infrastructure';
import { Collection, Db } from 'mongodb';
import { IRefreshTokenQuery } from '../application/query/refresh-token.query';
import { RefreshTokenView } from '../application/query/refresh-token.view';
import { RefreshTokenNotFoundException } from '../domain/exception/refresh-token-not-found.exception';
import { RefreshToken } from '../domain/refresh-token';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository';

export class MongodbRefreshToken implements IRefreshTokenRepository, IRefreshTokenQuery {
  private static COLLECTION_NAME = 'refresh_token';

  constructor(private readonly db: Promise<Db>) {}

  public async getByToken(token: string): Promise<RefreshTokenView> {
    const collection = await this.getCollection();
    const refreshToken = await collection.findOne({ token });

    if (refreshToken === null) {
      throw RefreshTokenNotFoundException.withGivenToken();
    }

    return new RefreshTokenView(refreshToken._id.toString(), refreshToken.userId, refreshToken.token);
  }

  public async create(refreshToken: RefreshToken): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.insertOne({
        _id: ObjectIDFactory.fromDomainId(refreshToken.getId()),
        userId: refreshToken.getUserId(),
        token: refreshToken.getToken(),
      });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.deleteOne({ _id: ObjectIDFactory.fromString(id) });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  private async getCollection(): Promise<Collection> {
    const db = await this.db;

    return db.collection(MongodbRefreshToken.COLLECTION_NAME);
  }
}
