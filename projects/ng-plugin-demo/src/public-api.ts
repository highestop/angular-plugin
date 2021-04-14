import { NgPluginFactory } from 'ng-plugin-manager';

import { PluginAppModule } from './plugin-as-app/plugin-app.module';
import { PluginPageComponent } from './plugin-as-component/plugin-page.component';
import { PluginModule } from './plugin-as-component/plugin.module';
import { debug } from './plugin.util';

export default {
  name: 'ng-plugin-demo',
  plugins: [
    NgPluginFactory.createComponentPlugin({
      name: 'ng-plugin-demo/plugin-component',
      moduleType: PluginModule,
      componentType: PluginPageComponent
    }),
    NgPluginFactory.createAppPlugin({
      name: 'ng-plugin-demo/plugin-app-1',
      moduleType: PluginAppModule
    }),
    NgPluginFactory.createAppPlugin({
      name: 'ng-plugin-demo/plugin-app-2',
      moduleType: PluginAppModule
    }),
    NgPluginFactory.createSimplePlugin({
      name: 'ng-plugin-demo/plugin-simple',
      content: debug
    })
  ]
};
