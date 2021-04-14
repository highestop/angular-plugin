import { Injectable } from '@angular/core';

import {
  NgPluginBundle,
  NgPluginBundles,
  NgPluginRegisterBundle
} from '../data/plugin-bundle';
import { prelogger } from '../util/prelogger';

@Injectable()
export class NgPluginBundleRegister {
  private readonly packages: NgPluginBundles = {};

  set(plugin: NgPluginBundle): NgPluginRegisterBundle {
    if (this.packages[plugin.name]) {
      throw new Error(
        prelogger(`plugin bundle '${plugin.name}' has already been registered`)
      );
    }

    this.packages[plugin.name] = {
      ...plugin,
      installed: false
    };

    return this.get(plugin.name);
  }

  get(name: string): NgPluginRegisterBundle {
    const plugin: NgPluginRegisterBundle | undefined = this.packages[name];

    if (!plugin) {
      throw new Error(prelogger(`cannot find plugin bundle '${name}'`));
    }

    return plugin;
  }

  match(name: string): NgPluginRegisterBundle | undefined {
    const names: string[] = Object.keys(this.packages).filter(_name =>
      this.get(_name)
    );
    const matched: string | undefined = names.find(_name =>
      name.startsWith(_name)
    );
    return matched ? this.get(matched) : undefined;
  }
}
