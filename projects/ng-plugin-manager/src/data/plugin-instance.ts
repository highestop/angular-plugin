import { Injector, NgModuleFactory, Type } from '@angular/core';

import { NgPluginType, NgSimplePlugin } from './plugin';

export interface NgPluginInstances {
  [name: string]: NgPluginInstance;
}

export type NgPluginInstance =
  | NgAppPluginWithModuleFactory<any>
  | NgComponentPluginWithModuleFactory<any, any>
  | NgSimplePlugin<any>;

export interface NgAppPluginWithModuleFactory<T> {
  name: string;
  type: NgPluginType.APP;
  moduleFactory: NgModuleFactory<T>;
}

export interface NgComponentPluginWithModuleFactory<T, K> {
  name: string;
  type: NgPluginType.COMPONENT;
  componentType: Type<T>;
  moduleFactory: NgModuleFactory<K>;
  injector: Injector;
}
