import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject, NgModule, NgModuleRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, Router, RouterModule } from '@angular/router';
import {
  NgPluginBundleRegister,
  NgPluginInstanceStore,
  NgPluginPresetStore,
  NgPluginRoute,
  NgPluginRouterModule,
  NG_PLUGIN_ROUTES,
  NG_PLUGIN_ROUTING
} from 'ng-plugin-manager';

import { DemoComponent } from '../components/demo.component';
import { DemoModule } from '../components/demo.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: '**',
          redirectTo: 'demo/plugin-app-1'
        }
      ],
      {
        useHash: true,
        initialNavigation: false,
        enableTracing: false
      }
    ),
    NgPluginRouterModule.forRoot(
      [
        {
          src: './assets/plugins/ng-plugin-demo.umd.min.js',
          name: 'ng-plugin-demo'
        }
      ],
      [
        {
          path: 'demo',
          children: [
            {
              path: 'plugin-app-1',
              plugin: 'ng-plugin-demo/plugin-app-1'
            },
            {
              path: 'plugin-app-2',
              plugin: 'ng-plugin-demo/plugin-app-2'
            }
          ]
        },
        {
          path: 'plugin-demo',
          component: DemoComponent
        }
      ],
      {
        preserveWhitespaces: true
      }
    ),
    DemoModule
  ],
  declarations: [AppComponent],
  providers: [{ provide: 'APP_PAGE', useValue: '哈哈' }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    plugins: NgPluginInstanceStore,
    presets: NgPluginPresetStore,
    register: NgPluginBundleRegister,
    router: Router,
    ref: NgModuleRef<AppModule>,
    @Inject(NG_PLUGIN_ROUTES) routes: NgPluginRoute[],
    @Inject(NG_PLUGIN_ROUTING) routing: Route[]
  ) {
    console.warn('[ app ] app-module constructed!');
    console.warn('[ app ] into AppModuleRef', ref);
    console.warn('[ app ] routes for plugin mode', routes);
    console.warn('[ app ] routes after resolve plugin routes', routing);
    console.warn('[ app ] final routes in routerConfig', router.config);
    console.warn('[ app ] installed plugin bundles', register);
    console.warn('[ app ] preset plugins', presets);
    console.warn('[ app ] resolved plugins', plugins);
  }
}
