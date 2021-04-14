import { Injectable, Injector, NgModuleFactory, Type } from '@angular/core';

import { NgAppPlugin, NgComponentPlugin } from '../data/plugin';
import { NgPluginRegisterBundle } from '../data/plugin-bundle';
import { NgPluginBundleRegister } from '../store/plugin-bundle.register';
import {
  NgAppPluginWithModuleFactory,
  NgComponentPluginWithModuleFactory,
  NgPluginInstance
} from '../data/plugin-instance';
import { NgPluginInstanceStore } from '../store/plugin-instance.store';
import { NgPluginPreset } from '../data/plugin-preset';
import { NgPluginPresetStore } from '../store/plugin-preset.store';
import { prelogger } from '../util/prelogger';

import { NgPluginBundleInstaller } from './plugin-bundle.installer';
import { NgPluginCompiler } from './plugin-compiler';
import { NgPluginLoggerService } from './plugin-logger.service';

@Injectable()
export class NgPluginPresetResolver {
  constructor(
    private presetStore: NgPluginPresetStore,
    private instanceStore: NgPluginInstanceStore,
    private register: NgPluginBundleRegister,
    private installer: NgPluginBundleInstaller,
    private compiler: NgPluginCompiler,
    private injector: Injector,
    private logger: NgPluginLoggerService
  ) {}

  resolve(name: string): Promise<NgPluginInstance> {
    console.log(prelogger(`try to find plugin preset '${name}'`));

    this.logger.startFlag(`preset|${name}`);

    const preset: NgPluginPreset | undefined = this.presetStore.find(name);

    if (preset) {
      return this.resolving(preset)
        .then((instance: NgPluginInstance) => {
          this.logger.stopFlag(`preset|${name}`);
          return this.instanceStore.set(name, instance);
        })
        .catch(() => {
          throw new Error(
            prelogger(`failed to resolve plugin preset '${preset.name}'`)
          );
        });
    }

    console.log(
      prelogger(
        `try to match registered plugin bundle related to plugin preset '${name}'`
      )
    );

    const bundle: NgPluginRegisterBundle | undefined = this.register.match(
      name
    );

    if (!bundle) {
      throw new Error(
        prelogger(`cannot find a plugin bundle possibly contains '${name}'`)
      );
    }

    if (bundle.installed) {
      throw new Error(
        prelogger(
          `no plugin preset '${name}' found in plugin bundle '${bundle.name}'`
        )
      );
    }

    return this.installer.install(bundle).then(() => this.resolve(name));
  }

  private resolving(preset: NgPluginPreset): Promise<NgPluginInstance> {
    console.log(prelogger(`resolving plugin preset '${preset.name}'`));

    if (preset instanceof NgAppPlugin) {
      return this.factoryModule(preset.moduleType).then(
        (moduleFactory: NgModuleFactory<any>) => {
          return {
            name: preset.name,
            type: preset.type,
            moduleFactory
          } as NgAppPluginWithModuleFactory<any>;
        }
      );
    }

    if (preset instanceof NgComponentPlugin) {
      return this.factoryModule(preset.moduleType).then(
        (moduleFactory: NgModuleFactory<any>) => {
          return {
            name: preset.name,
            type: preset.type,
            componentType: preset.componentType,
            moduleFactory,
            injector: this.injector
          } as NgComponentPluginWithModuleFactory<any, any>;
        }
      );
    }

    return Promise.reject();
  }

  private factoryModule(moduleType: Type<any>): Promise<NgModuleFactory<any>> {
    return this.compiler.compileModuleAsync(moduleType);
  }
}
