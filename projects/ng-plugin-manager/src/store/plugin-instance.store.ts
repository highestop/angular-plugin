import { Injectable } from '@angular/core';

import { NgPluginInstance, NgPluginInstances } from '../data/plugin-instance';
import { prelogger } from '../util/prelogger';

/**
 * 插件缓存单例
 */
@Injectable()
export class NgPluginInstanceStore {
  private readonly instances: NgPluginInstances = {};

  set(name: string, instance: NgPluginInstance): NgPluginInstance {
    if (this.instances.hasOwnProperty(name)) {
      throw new Error(prelogger(`plugin '${name}' already exist`));
    }

    return (this.instances[name] = instance);
  }

  get(name: string): NgPluginInstance {
    const instance: NgPluginInstance | undefined = this.find(name);

    if (!instance) {
      throw new Error(prelogger(`cannot find plugin '${name}'`));
    }

    // todo: readonly, return a clone of the plugin instance
    return instance;
  }

  find(name: string): NgPluginInstance | undefined {
    return this.instances[name];
  }
}
