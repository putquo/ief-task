import { ClientSecretCredential } from '@azure/identity';
import "isomorphic-fetch";
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import type { ClientCredentials } from '../models/types';
import config from '../shared/config';


export function createGraphClient(credentials: ClientCredentials): Client {
  const credential = new ClientSecretCredential(
    credentials.tenantId,
    credentials.clientId,
    credentials.clientSecret
  );
  const provider = new TokenCredentialAuthenticationProvider(credential, { scopes: [ config.graphApi.scope ] });
  return Client.initWithMiddleware({
    debugLogging: false,
    authProvider: provider,
  });
}
