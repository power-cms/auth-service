import { ICreateRepository, IDeleteRepository } from '@power-cms/common/domain';
import { RefreshToken } from './refresh-token';

export interface IRefreshTokenRepository extends ICreateRepository<RefreshToken>, IDeleteRepository {}
