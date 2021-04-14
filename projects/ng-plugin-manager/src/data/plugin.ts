import { Type } from '@angular/core';

import { NgPluginPreset } from './plugin-preset';

export interface NgPlugin {
  name: string;
  plugins: NgPluginPreset[];
}

export enum NgPluginType {
  APP = 'app',
  COMPONENT = 'component',
  SIMPLE = 'simple'
}

export class NgAppPlugin<T> {
  constructor(
    public name: string,
    public type: NgPluginType.APP,
    public moduleType: Type<T>
  ) {}
}

export class NgComponentPlugin<T, K> {
  constructor(
    public name: string,
    public type: NgPluginType.COMPONENT,
    public componentType: Type<T>,
    public moduleType: Type<K>
  ) {}
}

export class NgSimplePlugin<C> {
  constructor(
    public name: string,
    public type: NgPluginType.SIMPLE,
    public content: C
  ) {}
}
