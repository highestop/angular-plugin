import { NgAppPlugin, NgComponentPlugin, NgSimplePlugin } from './plugin';

export interface NgPluginPresets {
  [name: string]: NgPluginPreset;
}

export type NgPluginPreset =
  | NgAppPlugin<any>
  | NgComponentPlugin<any, any>
  | NgSimplePlugin<any>;
