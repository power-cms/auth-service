import { CredentialsView } from './credentials.view';

export interface ICredentialsQuery {
  getByUserId: (userId: string) => Promise<CredentialsView>;
}
