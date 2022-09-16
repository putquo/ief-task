import { taskRunner } from './operations/runner';
import { createGraphClient } from './utilities/graph';
import { getClientCredentials } from './utilities/task';


async function runAsync() {
    const credentials = getClientCredentials();
    const client = createGraphClient(credentials);
    await taskRunner(client);
}

(async () => await runAsync())();
