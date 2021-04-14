import { Injectable, NgModuleFactory } from '@angular/core';

import { NgPluginType } from '../data/plugin';
import { NgPluginInstance } from '../data/plugin-instance';
import { NgPluginInstanceStore } from '../store/plugin-instance.store';
import { prelogger } from '../util/prelogger';

import { NgPluginLoggerService } from './plugin-logger.service';
import { NgPluginPresetResolver } from './plugin-preset.resolver';

@Injectable()
export class NgPluginLoader {
  private quenePromise: {
    name: string;
    promise: Promise<NgModuleFactory<any>>;
  } | null = null;

  constructor(
    private plugins: NgPluginInstanceStore,
    private presetResolver: NgPluginPresetResolver,
    private logger: NgPluginLoggerService
  ) {}

  load(name: string): Promise<NgModuleFactory<any>> {
    console.log(prelogger(`prepare to load plugin '${name}'`));

    this.logger.startFlag(`loader|${name}`);

    if (this.quenePromise) {
      console.log(
        prelogger(
          `waiting for processing plugin '${this.quenePromise.name}' in quene`
        )
      );

      return this.quenePromise.promise.then(() => this.concatQuene(name));
    }

    return this.concatQuene(name);
  }

  private concatQuene(name: string): Promise<NgModuleFactory<any>> {
    console.log(prelogger(`ready to load plugin '${name}'`));

    this.quenePromise = {
      name,
      promise: this.rsyncLoad(name)
    };

    return this.quenePromise.promise.finally(() => this.processed());
  }

  private processed(): void {
    if (this.quenePromise) {
      console.log(
        prelogger(`processed loading plugin '${this.quenePromise.name}'`)
      );
    }

    this.quenePromise = null;
  }

  private rsyncLoad(name: string): Promise<NgModuleFactory<any>> {
    console.log(prelogger(`try to load plugin '${name}'`));

    const instance: NgPluginInstance | undefined = this.plugins.find(name);

    if (instance) {
      if (instance.type !== NgPluginType.APP) {
        throw new Error(
          prelogger(`plugin '${name}' is not typed of 'NgAppPlugin'`)
        );
      }

      return Promise.resolve(instance.moduleFactory).finally(() =>
        this.logger.stopFlag(`loader|${name}`)
      );
    }

    return this.presetResolver.resolve(name).then(() => this.rsyncLoad(name));
  }
}
