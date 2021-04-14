import { Injectable } from '@angular/core';

import { prelogger } from '../util/prelogger';

/**
 * @deprecated
 */
@Injectable()
export class NgPluginInitializer {
  init: () => Promise<void> = () => {
    console.info(prelogger('initializer provided'));
    return Promise.resolve();
  };
}
