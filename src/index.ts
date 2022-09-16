import { taskRunner } from './operations/runner';
import { createGraphClient } from './utilities/graph';
import { getLogger } from './utilities/log';
import { getClientCredentials } from './utilities/task';


const log = getLogger();

async function runAsync() {
    log.warn('This task is currently using Microsoft Graph Beta Endpoints. Please use with caution.');
    const credentials = getClientCredentials();
    const client = createGraphClient(credentials);
    await taskRunner(client);
}

(async () => await runAsync())();
