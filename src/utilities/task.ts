import type { ClientCredentials, GenericServiceConnection, Key, Pkcs12Cert, Secret } from '../models/types';
import task = require('azure-pipelines-task-lib/task');
import { PolicyAction, Command, KeysetAction, KeyType, KeyUsage, TaskInput, EnvironmentVariables } from '../models/enums';
import { env, exit } from 'process';
import { resolve } from 'path';
import { addMonthsToNow, toUnixTimestamp } from './date';


export function getClientCredentials(): ClientCredentials {
    const tenantId = getInput(TaskInput.TenantId);
    if (isPipelineContext()) {
        const id = getInput(TaskInput.ServiceConnection);
        const { username, password } = getGenericServiceConnection(id);
        return { clientId: username, clientSecret: password, tenantId };
    } else {
        const clientId = getEnvironmentVariable(EnvironmentVariables.ClientId);
        const clientSecret = getEnvironmentVariable(EnvironmentVariables.ClientSecret);
        return { clientId, clientSecret, tenantId };
    }
}

export function panic(message: string, code = 1): void {
    task.setResult(task.TaskResult.Failed, message, /* done */ true);
    exit(code);
}

function getInput(name: string): string {
    const input = task.getInput(name, false);
    if (!input)
        panic(`The input '${name}' is required`);
    return input!;
}

function getDelimitedInput(name: string, delimeter: string): string[] {
    const input = task.getDelimitedInput(name, delimeter, false);
    if (input.length === 0)
        panic(`The input '${name}' is required and cannot be empty`);
    return input!;
}

function getPathInput(name: string): string {
    const input = task.getPathInput(name, false);
    if (!input)
        panic(`The path input '${name}' is required`)
    checkPath(input!);
    return input!;
}

function checkPath(path: string): void {
    try {
        task.checkPath(path, path);
    } catch {
        panic(`The path '${path}' does not exist`);
    }
}

function getGenericServiceConnection(key: string): GenericServiceConnection {
    const input = task.getEndpointAuthorization(key, false);
    if (!input)
        panic(`The endpoint authorization '${key}' is required`);
    const username = input!.parameters['username'];
    const password = input!.parameters['password'];
    if (!username)
        panic(`Parameter 'username' for '${key}' is not set`);
    if (!password)
        panic(`Parameter 'password' for '${key}' is not set`);
    return { username, password };
}

function getEnvironmentVariable(key: string): string {
    const value = env[key];
    if (value === '' || !value)
        panic(`Environment variable '${key}' is not set`);
    return value!;
}

export function getCommand(): Command {
    const command = (getInput(TaskInput.Command).toLowerCase()) as Command;
    validateEnumInput(Command, TaskInput.Command, command);
    return command;
}

export function getAction(command: Command): KeysetAction | PolicyAction {
    const action = getInput(TaskInput.Action).toLowerCase();
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
    return getInput(TaskInput.KeysetName);
}

export function getCertificate(): string {
    return getInput(TaskInput.Certificate);
}

export function getPkcs12(): Pkcs12Cert {
    const key = getInput(TaskInput.PfxContent);
    const password = getInput(TaskInput.PfxPassword);
    return { key, password };
}

export function getSecret(): Secret {
    const use = getInput(TaskInput.KeyUsage) as KeyUsage;
    validateEnumInput(KeyUsage, TaskInput.KeyUsage, use);
    const k = getInput(TaskInput.Secret);
    const months = +getInput(TaskInput.ExpireAfter);
    const exp = addMonthsToNow(months);
    const nbf = toUnixTimestamp(Date.now());
    return { use, k, exp, nbf };
}

export function getPoliciesFolder(): string {
    return getPathInput(TaskInput.Policies);
}

export function getPoliciesToDelete(folder: string): string[] {
    const input = getDelimitedInput(TaskInput.Files, ' ');
    const paths = input.map(p => resolve(folder, p));
    paths.forEach(p => checkPath(p));
    return paths;
}

export function getKey(): Key {
    const use = getInput(TaskInput.KeyUsage) as KeyUsage;
    validateEnumInput(KeyUsage, TaskInput.KeyUsage, use);
    const kty = getInput(TaskInput.KeyType) as KeyType;
    validateEnumInput(KeyType, TaskInput.KeyType, kty);
    const months = +getInput(TaskInput.ExpireAfter);
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
