import type { Logger } from '../models/types';
import task = require('azure-pipelines-task-lib');


export function getLogger(): Logger {
  return {
    debug: task.debug,
    error: console.error,
    info: console.info,
    warn: task.warning,
  }
}
