import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Optional,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewRef
} from '@angular/core';

import { prelogger } from '../util/prelogger';

/**
 * this service helps factory or destroy custom component or template to any place with ease
 *
 * to destroy the component, you need to get a componentRef after factorying it
 * to remove the template, you need to get a viewRef after embedding it
 */
@Injectable()
export class NgPluginDynamicFactory {
  /**
   * calculate viewRefs attached to appRef directly (maintained manually, stored as ViewRefs)
   */
  private static rootRefs: (ComponentRef<any> | ViewRef)[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private applicationRef?: ApplicationRef
  ) {}

  /**
   * insert a component/template with context into a viewContainerRef
   */
  factoryComponent<T>(
    containerRef: ViewContainerRef,
    componentType: Type<T>,
    componentInstance?: Partial<T>
  ): ComponentRef<T> {
    const factory: ComponentFactory<T> = this.componentFactoryResolver.resolveComponentFactory<
      T
    >(componentType);
    const componentRef: ComponentRef<T> = containerRef.createComponent<T>(
      factory
    );

    Object.assign(componentRef.instance, componentInstance);

    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  factoryTemplate<T>(
    containerRef: ViewContainerRef,
    template: TemplateRef<T>,
    context?: T
  ): ViewRef {
    const ref: ViewRef = containerRef.createEmbeddedView(template, context);

    ref.detectChanges();

    return ref;
  }

  /**
   * insert a component/template with context into body
   */
  factoryComponentForRoot<T>(
    componentType: Type<T>,
    componentInstance?: Partial<T>
  ): ComponentRef<T> {
    if (!this.applicationRef) {
      throw new ReferenceError(
        prelogger(
          `cannot find 'ApplicationRef' when dynamically resolving component`
        )
      );
    }

    const componentRef: ComponentRef<T> = this.componentFactoryResolver
      .resolveComponentFactory<T>(componentType)
      .create(this.injector);
    const element: HTMLElement = (componentRef.hostView as EmbeddedViewRef<T>)
      .rootNodes[0];

    this.applicationRef.attachView(componentRef.hostView);
    document.body.appendChild(element);

    Object.assign(componentRef.instance, componentInstance);
    componentRef.changeDetectorRef.detectChanges();

    NgPluginDynamicFactory.rootRefs.push(componentRef);

    return componentRef;
  }

  factoryTemplateForRoot<T>(template: TemplateRef<T>, context: T): ViewRef {
    if (!this.applicationRef) {
      throw new ReferenceError(
        prelogger(
          `cannot find 'ApplicationRef' when dynamically resolving template`
        )
      );
    }

    const viewRef: EmbeddedViewRef<T> = template.createEmbeddedView(context);
    const element = viewRef.rootNodes[0];

    this.applicationRef.attachView(viewRef);
    document.body.appendChild(element);

    NgPluginDynamicFactory.rootRefs.push(viewRef);

    return viewRef;
  }

  /**
   * destroy a component/template from a viewContainerRef
   */
  destroyComponent<T>(
    containerRef: ViewContainerRef,
    componentRef: ComponentRef<T>
  ): void {
    const viewIndex: number = containerRef.indexOf(componentRef.hostView);

    containerRef.detach(viewIndex);
    componentRef.destroy();
  }

  destroyTemplate(containerRef: ViewContainerRef, viewRef: ViewRef): void {
    const viewIndex: number = containerRef.indexOf(viewRef);

    containerRef.detach(viewIndex);
    containerRef.remove(viewIndex);
  }

  /**
   * destroy a component/template from body
   */
  destroyComponentForRoot<T>(componentRef: ComponentRef<T>): void {
    if (!this.applicationRef) {
      throw new ReferenceError(
        prelogger(
          `cannot find 'ApplicationRef' when dynamically resolving component`
        )
      );
    }

    this.applicationRef.detachView(componentRef.hostView);

    if (NgPluginDynamicFactory.rootRefs.indexOf(componentRef) > -1) {
      NgPluginDynamicFactory.rootRefs.splice(
        NgPluginDynamicFactory.rootRefs.indexOf(componentRef),
        1
      );
    }

    componentRef.destroy();
  }

  destroyTemplateForRoot(viewRef: ViewRef): void {
    if (!this.applicationRef) {
      throw new ReferenceError(
        prelogger(
          `cannot find 'ApplicationRef' when dynamically resolving template`
        )
      );
    }

    this.applicationRef.detachView(viewRef);
    const element = (viewRef as EmbeddedViewRef<any>).rootNodes[0];

    if (NgPluginDynamicFactory.rootRefs.indexOf(viewRef) > -1) {
      NgPluginDynamicFactory.rootRefs.splice(
        NgPluginDynamicFactory.rootRefs.indexOf(viewRef),
        1
      );
    }

    document.body.removeChild(element);
  }
}
