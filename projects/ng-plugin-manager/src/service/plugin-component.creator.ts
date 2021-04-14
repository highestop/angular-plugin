import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  NgModuleRef,
  ViewContainerRef
} from '@angular/core';

import { NgPluginType } from '../data/plugin';
import { NgPluginInstance } from '../data/plugin-instance';
import { NgPluginInstanceStore } from '../store/plugin-instance.store';
import { prelogger } from '../util/prelogger';

import { NgPluginDynamicFactory } from './plugin-dynamic-factory.service';

export interface NgComponentPluginCreator {
  create: (context: any, container: ViewContainerRef) => ComponentRef<any>;
  destory: (component: ComponentRef<any>, container: ViewContainerRef) => void;
  createForRoot: (context: any) => ComponentRef<any>;
  destoryForRoot: (component: ComponentRef<any>) => void;
}

@Injectable()
export class NgPluginComponentCreator {
  constructor(private plugins: NgPluginInstanceStore) {}

  createComponent(name: string): NgComponentPluginCreator {
    const instance: NgPluginInstance = this.plugins.get(name);

    if (instance.type !== NgPluginType.COMPONENT) {
      throw new Error(
        prelogger(`plugin '${name}' is not typed of 'NgComponentPlugin'`)
      );
    }

    const moduleRef: NgModuleRef<any> = instance.moduleFactory.create(
      instance.injector
    );
    const componentFactoryResolver: ComponentFactoryResolver =
      moduleRef.componentFactoryResolver;
    const dynamicResolver = new NgPluginDynamicFactory(
      componentFactoryResolver,
      instance.injector
    );

    return {
      create: (context: any, container: ViewContainerRef) =>
        dynamicResolver.factoryComponent(
          container,
          instance.componentType,
          context
        ),
      destory: (component: ComponentRef<any>, container: ViewContainerRef) =>
        dynamicResolver.destroyComponent(container, component),
      createForRoot: (context: any) =>
        dynamicResolver.factoryComponentForRoot(
          instance.componentType,
          context
        ),
      destoryForRoot: (component: ComponentRef<any>) =>
        dynamicResolver.destroyComponentForRoot(component)
    };
  }
}
