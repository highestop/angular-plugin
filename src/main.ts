import * as animation from '@angular/animations';
import * as cdk from '@angular/cdk';
import * as common from '@angular/common';
import * as core from '@angular/core';
import { enableProdMode } from '@angular/core';
import * as forms from '@angular/forms';
import * as browser from '@angular/platform-browser';
import * as dynamicBrowser from '@angular/platform-browser-dynamic';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as router from '@angular/router';
import { NgPluginFactory } from 'ng-plugin-manager';
import * as rxjs from 'rxjs';

import { AppModule } from './app/app.module';
import { environment } from './environment/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    NgPluginFactory.definePluginDeps({
      '@angular/platform-browser': browser,
      '@angular/platform-browser-dynamic': dynamicBrowser,
      '@angular/animations': animation,
      '@angular/cdk': cdk,
      '@angular/common': common,
      '@angular/core': core,
      '@angular/forms': forms,
      '@angular/router': router,
      rxjs
    });
  });
