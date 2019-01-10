import { RefreshTokenView } from './refresh-token.view';

export interface IRefreshTokenQuery {
  getByToken: (token: string) => Promise<RefreshTokenView>;
}
