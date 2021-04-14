import { Injectable } from '@angular/core';

import { prelogger } from '../util/prelogger';

@Injectable()
export class NgPluginLoggerService {
  private loggerMap: Map<string, number> = new Map<string, number>([]);

  startFlag(key: string): void {
    const checkLogger = this.loggerMap.get(key);

    if (!checkLogger) {
      this.loggerMap.set(key, Date.now());
      console.warn(prelogger(`>> + '${key}'`));
    }
  }

  stopFlag(key: string): void {
    const checkLogger = this.loggerMap.get(key);

    if (checkLogger) {
      const timer: number = Date.now() - checkLogger;
      console.warn(prelogger(`>> - '${key}'`), timer);
      this.loggerMap.delete(key);
    }
  }
}
