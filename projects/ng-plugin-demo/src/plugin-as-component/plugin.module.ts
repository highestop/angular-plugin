import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PluginPageComponent } from './plugin-page.component';

/**
 * 导出组件插件
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PluginPageComponent],
  entryComponents: [PluginPageComponent],
  exports: [PluginPageComponent]
})
export class PluginModule {
  constructor() {
    console.warn(
      '[ plugin-component ] plugin module constructed for component!'
    );
  }
}
