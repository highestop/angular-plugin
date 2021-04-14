import { Injectable } from '@angular/core';

import { NgPluginPreset, NgPluginPresets } from '../data/plugin-preset';
import { prelogger } from '../util/prelogger';

@Injectable()
export class NgPluginPresetStore {
  private readonly presets: NgPluginPresets = {};

  set(name: string, preset: NgPluginPreset): NgPluginPreset {
    if (this.presets.hasOwnProperty(name)) {
      throw new Error(prelogger(`plugin preset '${name}' already exist`));
    }

    return (this.presets[name] = preset);
  }

  get(name: string): NgPluginPreset {
    const preset: NgPluginPreset | undefined = this.find(name);

    if (!preset) {
      throw new Error(prelogger(`cannot find plugin preset '${name}'`));
    }

    // todo: readonly, return a clone of the plugin instance
    return preset;
  }

  find(name: string): NgPluginPreset | undefined {
    return this.presets[name];
  }
}
