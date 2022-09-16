import type { Client } from '@microsoft/microsoft-graph-client';
import type { Runner } from '../models/types';
import { getLogger } from '../utilities/log';
import { getAction, getCommand } from '../utilities/task';
import { actionExecutors } from './executor';


const log = getLogger();

export const taskRunner: Runner = async (client: Client) => {
    const command = getCommand();
    const action = getAction(command);
    const actionExecutor = actionExecutors.get(command)!.get(action)!;
    const start = Date.now();
    log.info(`Executing command '${command} ${action}'`);
    await actionExecutor({ action, client });
    log.info(`Command '${command} ${action}' finished in ${(Date.now() - start) / 1000} seconds`);
}
