import { Injectable } from '@angular/core';

import { NgPlugin } from '../data/plugin';
import { NgPluginBundle, NgPluginRegisterBundle } from '../data/plugin-bundle';
import { NgPluginBundleRegister } from '../store/plugin-bundle.register';
import { NgPluginSystemJSLoader } from '../static/plugin-loader';
import { NgPluginPresets } from '../data/plugin-preset';
import { NgPluginPresetStore } from '../store/plugin-preset.store';
import { prelogger } from '../util/prelogger';

import { NgPluginLoggerService } from './plugin-logger.service';

@Injectable()
export class NgPluginBundleInstaller {
  constructor(
    private register: NgPluginBundleRegister,
    private presetStore: NgPluginPresetStore,
    private logger: NgPluginLoggerService
  ) {}

  install(bundle: NgPluginBundle): Promise<NgPluginPresets> {
    return NgPluginSystemJSLoader.fetch(bundle)
      .then((module: NgPlugin) => {
        console.log(prelogger(`will install plugin bundle '${module.name}'`));

        this.logger.startFlag(`bundle|${module.name}`);

        const presets: NgPluginPresets = {};

        module.plugins.forEach(plugin => {
          console.log(prelogger(`scan plugin '${plugin.name}'`));

          presets[plugin.name] = this.presetStore.set(plugin.name, plugin);
        });

        const _bundle: NgPluginRegisterBundle = this.register.get(bundle.name);
        _bundle.installed = true;

        return Promise.resolve(presets).finally(() =>
          this.logger.stopFlag(`bundle|${module.name}`)
        );
      })
      .catch(err => {
        throw new Error(
          prelogger(
            `failed to fetch plugin '${bundle.name}' from '${bundle.src}: ${err}'`
          )
        );
      });
  }
}
