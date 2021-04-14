import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

import { NgPluginBundle } from '../data/plugin-bundle';
import { NgPluginBundleRegister } from '../store/plugin-bundle.register';
import { interfaceTo, NgPluginRoute } from '../data/plugin-route';
import { prelogger } from '../util/prelogger';

import { NgPluginLoggerService } from './plugin-logger.service';
import { NgPluginLoader } from './plugin.loader';

@Injectable()
export class NgPluginRouteProvider {
  constructor(
    private router: Router,
    private register: NgPluginBundleRegister,
    private loader: NgPluginLoader,
    private logger: NgPluginLoggerService
  ) {}

  resolveRoutes(bundles: NgPluginBundle[], routes: NgPluginRoute[]): Route[] {
    if (!bundles || !bundles.length) {
      console.warn(prelogger('WARNING: no plugin bundle provided, skipping..'));
      return this.returnRoutes([]);
    }

    bundles.forEach((bundle) => this.register.set(bundle));

    if (!routes || !routes.length) {
      console.warn(
        prelogger(
          'WARNING: no plugin route will be registered for initialization, skipping..'
        )
      );
      return this.returnRoutes([]);
    }

    const _routes: Route[] = this.provideChildrenForPlugin(routes);

    this.logger.stopFlag('plugin-module-initing');
    return this.returnRoutes(_routes);
  }

  private returnRoutes(routes: Route[]) {
    this.router.initialNavigation();
    return routes;
  }

  private provideChildrenForPlugin(
    routes: NgPluginRoute | NgPluginRoute[]
  ): Route[] {
    if (!Array.isArray(routes)) {
      routes = [routes];
    }

    routes.forEach((route) => this.provideChild(route));

    this.router.resetConfig([...routes, ...this.router.config]);

    return routes;
  }

  private provideChild(route: NgPluginRoute): void {
    if (route && interfaceTo(route)) {
      route['loadChildren'] = () => this.loader.load(route.plugin);
    }

    if (route.children && route.children.length) {
      route.children.forEach((child: any) => this.provideChild(child));
    }
  }
}
