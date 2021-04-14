import { Type } from '@angular/core';

import {
  NgAppPlugin,
  NgComponentPlugin,
  NgPluginType,
  NgSimplePlugin
} from '../data/plugin';
import { NgPluginDeps } from '../data/plugin-deps';

/**
 * 创建插件时的构造工厂
 * 不同类型插件使用不同的工厂生产插件构造类实体
 */
export class NgPluginFactory {
  static createAppPlugin<T>(config: {
    name: string;
    moduleType: Type<T>;
  }): NgAppPlugin<T> {
    return new NgAppPlugin(config.name, NgPluginType.APP, config.moduleType);
  }

  static createComponentPlugin<T, K>(config: {
    name: string;
    componentType: Type<T>;
    moduleType: Type<K>;
  }): NgComponentPlugin<T, K> {
    return new NgComponentPlugin(
      config.name,
      NgPluginType.COMPONENT,
      config.componentType,
      config.moduleType
    );
  }

  static createSimplePlugin<T>(config: {
    name: string;
    content: T;
  }): NgSimplePlugin<T> {
    return new NgSimplePlugin(config.name, NgPluginType.SIMPLE, config.content);
  }

  /**
   * 全局定义需要映射到的第三方依赖包
   * @param deps 包描述
   */
  static definePluginDeps(deps: NgPluginDeps): void {
    deps = {
      ...deps,
      'ng-plugin-manager': { NgPluginFactory }
    };

    if (!(window as any).hasOwnProperty('define')) {
      throw new ReferenceError('window.define is not defined');
    }

    Object.keys(deps).forEach((externalKey) => {
      (<(key: string, options: any[], fn: () => any) => void>(
        (window as any).define
      ))(externalKey, [], () => deps[externalKey]);
    });
  }
}
