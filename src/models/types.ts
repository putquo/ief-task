import type { Client } from '@microsoft/microsoft-graph-client';
import type { Command, KeysetAction, KeyType, KeyUsage, PolicyAction } from './enums';


export interface RunnerInputs {
    client: Client;
    command: Command;
}

export interface ActionInputs {
    action: KeysetAction | PolicyAction;
    client: Client;
}

export interface Runner {
    (client: Client): Promise<void>
}

export interface Action {
    (inputs: ActionInputs): Promise<void>
}

export interface ClientCredentials {
    clientId: string;
    clientSecret: string;
    tenantId: string;
}

export interface GraphClientCredentialDetails {
    clientId: string;
    clientSecret: string;
    tenantId: string;
}

export interface Policy {
    id: string;
    children: Policy[];
    content: any;
    parentId: string | undefined;
    path: string;
}

export interface Pkcs12Cert {
    key: string;
    password: string;
}

export interface Secret {
    exp: number;
    k: string;
    nbf: number;
    use: KeyUsage;
}

export interface Node {
    policy: Policy;
    children: Node[];
}

export interface Key {
    exp: number;
    kty: KeyType;
    nbf: number;
    use: KeyUsage;
}

export interface GenericServiceConnection {
    username: string;
    password: string;
}

export interface Logger {
    debug(message?: any, ...parameters: any[]): void;
    error(message?: any, ...parameters: any[]): void;
    info(message?: any, ...parameters: any[]): void;
    warn(message?: any, ...parameters: any[]): void;
}
