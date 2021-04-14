export interface NgPluginEvent<T> {
  type: T;
  data?: any;
}

export enum NG_PLUGIN_EVENT {
  PLUGIN_MODULE_INIT
}
