import { CommonModule } from '@angular/common';
import { Inject, NgModule, Optional } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PluginAppPageComponent } from './plugin-app-page.component';

/**
 * 导出根模块插件
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        component: PluginAppPageComponent,
        path: '',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [PluginAppPageComponent]
})
export class PluginAppModule {
  constructor(@Optional() @Inject('APP_PAGE') APP_PAGE: any) {
    console.log(APP_PAGE);
    console.warn('[ plugin-app ] plugin module constructed for app!');
  }
}
