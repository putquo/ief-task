import type { Client } from '@microsoft/microsoft-graph-client';
import { parseStringPromise } from 'xml2js';
import { FileExtensions, MimeTypes } from '../models/enums';
import type { Policy } from '../models/types';
import config from '../shared/config';
import { readFileAsync, traverseDirectoryAsync } from './io';
import { extname } from 'path';
import { getLogger } from './log';
import { panic } from './task';


const log = getLogger();

async function getPolicyDetailsAsync(path: string): Promise<Policy> {
  try {
    log.debug(`parse file : ${path}`);
    const content = await readFileAsync(path);
    const data = await parseStringPromise(content);
    const id: string = data.TrustFrameworkPolicy.$.PolicyId;
    const basePolicy: any | undefined = data.TrustFrameworkPolicy.BasePolicy;
    const parentId: string | undefined = basePolicy ? basePolicy[0].PolicyId[0] : undefined;
    return { children: [], content, id,  parentId, path, };
  } catch (error: any) {
    log.debug(error.message);
    const message = `An error occurred when reading '${path}'`;
    panic(message);
    throw new Error(message)
  }
}

export async function getPoliciesAsync(dir: string, files: string[] | undefined = undefined): Promise<Policy[]> {
  log.debug(`load policies from : ${dir}`);
  const policies: Policy[] = [];
  await traverseDirectoryAsync(dir, async path => {
    if (extname(path) === FileExtensions.Xml) {
      if (files === undefined || files!.includes(path)) {
        const policy = await getPolicyDetailsAsync(path);
        policies.push(policy);
      }
    }
  });
  log.info(`Loaded all policies`)
  return policies
}

export function createPolicyTree(policies: Policy[]): Policy[] {
  log.debug(`find dependencies : ${policies.map(p => p.id).join(', ')}`)
  const roots = policies.filter(p => p.parentId === undefined);
  const q: Policy[] = [];
  q.push(...roots);
  while (q.length !== 0) {
    const current = q.pop()!;
    current.children = current.children.concat(policies.filter(p => p.parentId === current.id));
    q.push(...current.children);
  }
  return roots;
}

export function batchPolicies(currentDepth: Policy[], batches: Policy[][] = []): Policy[][] {
  const batch = [ ...currentDepth ];
  batches.push(batch);
  const nextDepth: Policy[] = [];
  currentDepth.forEach(p => {
    if (p.children.length > 0)
      nextDepth.push(...p.children);
  });
  if (nextDepth.length !== 0)
    batchPolicies(nextDepth, batches);
  return batches;
}

export async function deletePoliciesAsync(graphClient: Client, policies: Policy[]): Promise<void> {
  try {
    const promises: any[] = [];
    for (const policy of policies) {
      promises.push(
        graphClient.api(`${config.graphApi.policiesEndpoint}/${policy.id}`)
          .version('beta')
          .delete()
      )
    }
    log.info(`Deleting: ${policies.map(p => p.id).join(', ')}`);
    await Promise.all(promises);
    log.info('Successfully deleted policies');
  } catch (error: any) {
    log.debug(error.message);
    panic('An error occurred when attempting to delete policies');
  }
}

export async function uploadPoliciesAsync(graphClient: Client, batches: Policy[][]): Promise<void> {
  try {
    for (const batch of batches) {
      const ids = batch.map(p => p.id);
      const requests = batch.map(({ content, id }) => ({ content, id }));
      const promises: any[] = [];
      log.info(`Uploading: ${ids.join(', ')}`);
      requests.forEach(r => {
        promises.push(
          graphClient.api(`${config.graphApi.policiesEndpoint}/${r.id}/$value`)
            .version('beta')
            .header('Content-Type', MimeTypes.ApplicationXml)
            .put(r.content)
        );
      });
      await Promise.all(promises);
    }
    log.info('Successfully uploaded policies');
  } catch (error: any) {
    log.debug(error.message);
    panic('An error occurred when attempting to upload policies');
  }
}
