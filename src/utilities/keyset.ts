import type { Client } from '@microsoft/microsoft-graph-client';
import type { Key, Pkcs12Cert, Secret } from '../models/types';
import config from '../shared/config';
import { getLogger } from './log';
import { panic } from './task';


const log = getLogger();

export async function createKeysetAsync(graphClient: Client, keysetName: string): Promise<void> {
    try {
        log.info(`Creating: ${keysetName}`);
        await graphClient.api(config.graphApi.keysetsEndpoint)
            .version('beta')
            .post({ id: keysetName });
        log.info('Successfully created keyset');
    } catch (error: any) {
        panic(error.message);
    }
}

export async function deleteKeysetAsync(graphClient: Client, keysetName: string): Promise<void> {
    try {
        log.info(`Deleting: ${keysetName}`);
        await graphClient.api(`${config.graphApi.keysetsEndpoint}/${keysetName}`)
            .version('beta')
            .delete();
        log.info('Successfully deleted keyset');
    } catch (error: any) {
        panic(error.message);
    }
}

export async function generateKeyAsync(graphClient: Client, keysetName: string, key: Key): Promise<void> {
    try {
        log.info(`Generating key: ${keysetName}`);
        await graphClient.api(`${config.graphApi.keysetsEndpoint}/${keysetName}/generateKey`)
            .version('beta')
            .post(key);
        log.info('Successfully generated key');
    } catch (error: any) {
        panic(error.message);
    }
}

export async function uploadCertAsync(graphClient: Client, keysetName: string, cert: string): Promise<void> {
    try {
        log.info(`Uploading certificate: ${keysetName}`);
        await graphClient.api(`${config.graphApi.keysetsEndpoint}/${keysetName}/uploadCertificate`)
            .version('beta')
            .post({ key: cert });
        log.info('Successfully uploaded certificate');
    } catch (error: any) {
        panic(error.message);
    }
}

export async function uploadPkcs12CertAsync(graphClient: Client, keysetName: string, cert: Pkcs12Cert): Promise<void> {
    try {
        log.info(`Uploading PKCS12 certificate: ${keysetName}`);
        await graphClient.api(`${config.graphApi.keysetsEndpoint}/${keysetName}/uploadPkcs12`)
            .version('beta')
            .post(cert);
        log.info('Successfully uploaded PKCS12 certificate');
    } catch (error: any) {
        panic(error.message);
    }
}

export async function uploadSecretAsync(graphClient: Client, keysetName: string, secret: Secret): Promise<void> {
    try {
        log.info(`Uploading secret: ${keysetName}`);
        await graphClient.api(`${config.graphApi.keysetsEndpoint}/${keysetName}/uploadSecret`)
            .version('beta')
            .post(secret);
        log.info('Successfully uploaded secret');
    } catch (error: any) {
        panic(error.message);
    }
}
