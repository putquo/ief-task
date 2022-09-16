import type { ClientCredentials, Key, Pkcs12Cert, Secret } from '../models/types';
import task = require('azure-pipelines-task-lib/task');
import { PolicyAction, Command, KeysetAction, KeyType, KeyUsage, TaskInput } from '../models/enums';
import { env, exit } from 'process';
import { getLogger } from './log';
import { resolve } from 'path';
import { addMonthsToNow, toUnixTimestamp } from './date';


export function getClientCredentials(): ClientCredentials {
  const tenantId = task.getInput(TaskInput.TenantId, /* required */ true)!;
  if (isPipelineContext()) {
    const id = task.getInput(TaskInput.ServiceConnection, /* required */ true)!;
    const serviceConnection = task.getEndpointAuthorization(id, /* optional */ false)!;
    const clientId = serviceConnection.parameters['username'];
    const clientSecret = serviceConnection.parameters['password'];
    if (!clientId)
      panic(`Username parameter for '${id}' is not set`);
    else if (!clientSecret)
      panic(`Password parameter for '${id}' is not set`);
    return { clientId, clientSecret, tenantId };
  } else {
    const idEnvName = 'SERVICECONNECTION_CLIENTID';
    const secretEnvName = 'SERVICECONNECTION_CLIENTSECRET';
    const clientId = env[idEnvName];
    const clientSecret = env[secretEnvName];
    if (!clientId)
      panic(`Environment variable '${idEnvName}' is not set`);
    else if (!clientSecret)
      panic(`Environment variable '${secretEnvName}' is not set`);
    return { 
      clientId: clientId!, 
      clientSecret: clientSecret!,
      tenantId
    };
  }
}

export function panic(message: string): void {
    task.setResult(task.TaskResult.Failed, message, /* done */ true);
    exit(1);
}

export function getCommand(): Command {
  const command = (task.getInput(TaskInput.Command, /* require */ true)!.toLowerCase()) as Command;
  validateEnumInput(Command, TaskInput.Command, command);
  return command;
}

export function getAction(command: Command): KeysetAction | PolicyAction {
  const action = task.getInput(TaskInput.Action, /* required */ true)!.toLowerCase();
  validateAction(action, command);
  if (command === Command.Keyset)
    return action as KeysetAction;
  else
    return action as PolicyAction;
}

function validateAction(action: string, command: Command): void {
  if (command === Command.Keyset)
    validateEnumInput(KeysetAction, TaskInput.Action, action);
  if (command === Command.Policy)
    validateEnumInput(PolicyAction, TaskInput.Action, action);
}

function isPipelineContext(): boolean {
  return task.getVariable('System.AccessToken') !== undefined ? true : false;
}

export function getKeysetName(): string {
  return task.getInput(TaskInput.KeysetName, /* required */ true)!;
}

export function getCertificate(): string {
  return task.getInput(TaskInput.Certificate, /* required */ true)!;
}

export function getPkcs12(): Pkcs12Cert {
  const key = task.getInput(TaskInput.PfxContent, /* required */ true)!;
  const password = task.getInput(TaskInput.PfxPassword, /* required */ true)!;
  return { key, password };
}

export function getSecret(): Secret {
  const use = task.getInput(TaskInput.KeyUsage, /* required */ true)! as KeyUsage;
  validateEnumInput(KeyUsage, TaskInput.KeyUsage, use);
  const k = task.getInput(TaskInput.Secret, /* required */ true)!;
  const months = +task.getInput(TaskInput.ExpireAfter, /* required */ true)!;
  const exp = addMonthsToNow(months);
  const nbf = toUnixTimestamp(Date.now());
  return { use, k, exp, nbf };
}

export function getPoliciesFolder(): string {
  return task.getPathInput(TaskInput.Policies, /* required */ true, /* check path */ true)!;
}

export function getPoliciesToDelete(folder: string): string[] {
  const input = task.getDelimitedInput(TaskInput.Files, ' ', /* required */ true)!;
  const paths = input.map(p => resolve(folder, p));
  paths.forEach(p => task.checkPath(p, p));
  return paths;
}

export function getKey(): Key {
  const use = task.getInput(TaskInput.KeyUsage, /* required */ true)! as KeyUsage;
  validateEnumInput(KeyUsage, TaskInput.KeyUsage, use);
  const kty = task.getInput(TaskInput.KeyType, /* required */ true)! as KeyType;
  validateEnumInput(KeyType, TaskInput.KeyType, kty);
  const months = +task.getInput(TaskInput.ExpireAfter, /* required */ true)!;
  const exp = addMonthsToNow(months);
  const nbf = toUnixTimestamp(Date.now());
  return { exp, nbf, kty, use };
}

type EnumObject = {[key: string]: number | string};
type EnumObjectEnum<E extends EnumObject> = E extends {[key: string]: infer ET | string} ? ET : never;

function getEnumValues<E extends EnumObject>(enumObject: E): string {
  return Object.keys(enumObject)
    .filter(i => Number.isNaN(Number(i)))
    .map(i => enumObject[i] as EnumObjectEnum<E>)
    .map(i => `'${i}'`)
    .join(', ');
}

function validateEnumInput<E extends EnumObject>(enumbObject: E, inputType: string, inputValue: string): void {
  if (!Object.values(enumbObject).includes(inputValue)) {
    const message = 
      `Invalid ${inputType} '${inputValue}'. Valid inputs include: ${getEnumValues(enumbObject)}`;
    panic(message)
  }
}

export function displayTaskHeader(): void {
  const log = getLogger();
  log.info(`
==============================================================================
                          Trust Framework Task
==============================================================================
  `);
}
