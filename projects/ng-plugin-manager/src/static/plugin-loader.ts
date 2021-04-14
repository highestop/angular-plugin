import { NgPlugin } from '../data/plugin';
import { NgPluginBundle } from '../data/plugin-bundle';
import { prelogger } from '../util/prelogger';

const SystemJs = (window as any).System;

/**
 * 静态类载入插件，返回插件构造类实体
 */
export class NgPluginSystemJSLoader {
  static fetch(bundle: NgPluginBundle): Promise<NgPlugin> {
    if (!SystemJs) {
      throw new ReferenceError(prelogger('no systemjs found'));
    }

    return SystemJs.import(bundle.src).then(() => SystemJs.import(bundle.name));
  }
}
