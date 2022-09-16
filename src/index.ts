import { taskRunner } from './operations/runner';
import { createGraphClient } from './utilities/graph';
import { displayTaskHeader, getClientCredentials } from './utilities/task';


async function runAsync() {
    displayTaskHeader();
    const credentials = getClientCredentials();
    const client = createGraphClient(credentials);
    await taskRunner(client);
}

(async () => await runAsync())();
