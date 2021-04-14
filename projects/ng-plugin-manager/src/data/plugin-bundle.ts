import { InjectionToken } from '@angular/core';

export const NG_PLUGIN_BUNDLES = new InjectionToken<NgPluginBundle[]>(
  'NG_PLUGIN_BUNDLES'
);

export interface NgPluginBundle {
  src: string;
  name: string;
}

export interface NgPluginBundles {
  [name: string]: NgPluginRegisterBundle;
}

export interface NgPluginRegisterBundle extends NgPluginBundle {
  installed: boolean;
}
