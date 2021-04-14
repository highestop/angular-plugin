import {
  // APP_INITIALIZER,
  Compiler,
  CompilerFactory,
  CompilerOptions,
  COMPILER_OPTIONS,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { Route } from '@angular/router';

import { NgPluginBundle, NG_PLUGIN_BUNDLES } from './data/plugin-bundle';
import { NgPluginBundleInstaller } from './service/plugin-bundle.installer';
import { NgPluginBundleRegister } from './store/plugin-bundle.register';
import { NgPluginCompiler } from './service/plugin-compiler';
import { NgPluginComponentCreator } from './service/plugin-component.creator';
import { NgPluginDynamicFactory } from './service/plugin-dynamic-factory.service';
import { NgPluginInstanceStore } from './store/plugin-instance.store';
import { NgPluginLoggerService } from './service/plugin-logger.service';
import { NgPluginOutletDirective } from './directive/plugin-outlet.directive';
import { NgPluginPresetResolver } from './service/plugin-preset.resolver';
import { NgPluginPresetStore } from './store/plugin-preset.store';
import {
  NgPluginRoute,
  NG_PLUGIN_ROUTES,
  NG_PLUGIN_ROUTING
} from './data/plugin-route';
import { NgPluginRouteProvider } from './service/plugin-route.provider';
import { NgPluginLoader } from './service/plugin.loader';
// import { NgPluginInitializer } from './initializer/plugin-initializer';
// import { NgPluginPreloadStrategy } from './preloader/plugin-preload-strategy';

// export function initPluginFactory(initializer: NgPluginInitializer): () => Promise<void> {
//     return initializer.init;
// }

export function createCompiler(compilerFactory: CompilerFactory): Compiler {
  return compilerFactory.createCompiler();
}

export function formatRoutes(
  provider: NgPluginRouteProvider,
  bundles: NgPluginBundle[],
  routes: NgPluginRoute[]
): Route[] {
  return provider.resolveRoutes(bundles, routes);
}

// export function provideRoutes(routes: Routes): Provider[] {
//     return [
//         { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
//         { provide: ROUTES, multi: true, useValue: recursiveRoutes(routes, fakeCallbackForAngularCheck) }
//     ];
// }

@NgModule({
  declarations: [NgPluginOutletDirective],
  exports: [NgPluginOutletDirective]
})
export class NgPluginRouterModule {
  constructor(logger: NgPluginLoggerService) {
    logger.startFlag('plugin-module-initing');
  }

  static forRoot(
    plugins: NgPluginBundle[],
    pluginRouters?: NgPluginRoute[],
    compilerOptions?: CompilerOptions
  ): ModuleWithProviders {
    return {
      ngModule: NgPluginRouterModule,
      providers: [
        { provide: COMPILER_OPTIONS, useValue: compilerOptions, multi: true },
        // { provide: APP_INITIALIZER, useFactory: initPluginFactory, deps: [NgPluginInitializer], multi: true },
        // NgPluginInitializer,
        // NgPluginPreloadStrategy,
        {
          provide: CompilerFactory,
          useClass: JitCompilerFactory,
          deps: [COMPILER_OPTIONS]
        },
        {
          provide: NgPluginCompiler,
          useFactory: createCompiler,
          deps: [CompilerFactory]
        },
        NgPluginRouteProvider,
        NgPluginBundleRegister,
        NgPluginBundleInstaller,
        NgPluginLoader,
        NgPluginPresetResolver,
        NgPluginPresetStore,
        NgPluginInstanceStore,
        NgPluginComponentCreator,
        NgPluginDynamicFactory,
        { provide: NG_PLUGIN_BUNDLES, useValue: plugins },
        { provide: NG_PLUGIN_ROUTES, useValue: pluginRouters },
        {
          provide: NG_PLUGIN_ROUTING,
          useFactory: formatRoutes,
          deps: [NgPluginRouteProvider, NG_PLUGIN_BUNDLES, NG_PLUGIN_ROUTES]
        },
        NgPluginLoggerService
        // provideRoutes(routes || [])
        // {
        //     provide: ANALYZE_FOR_ENTRY_COMPONENTS,
        //     multi: true,
        //     useFactory: connectRoutes,
        //     deps: [NG_PLUGIN_ROUTING]
        // },
        // { provide: ROUTES, multi: true, useFactory: connectRoutes, deps: [NG_PLUGIN_ROUTING],  }
      ]
    };
  }
}
