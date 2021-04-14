import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';

export const NG_PLUGIN_ROUTES = new InjectionToken<NgPluginRoute[]>(
  'NG_PLUGIN_ROUTES'
);

export const NG_PLUGIN_ROUTING = new InjectionToken<Route[]>(
  'NG_PLUGIN_ROUTING'
);

export type NgPluginRoute = NgPluginRegularRoute | NgPluginExtendedRoute;

export interface NgPluginRegularRoute extends NgPluginRouteOptions {
  plugin: string;
  children?: NgPluginRoute[];
}

export interface NgPluginExtendedRoute extends Route {
  children?: NgPluginRoute[];
}

export type NgPluginRouteOptions = Omit<Route, 'component' | 'loadChildren'>;

export function interfaceTo(route: any): route is NgPluginRegularRoute {
  return 'plugin' in route;
}
