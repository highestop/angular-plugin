# CHANGELOG

## 0.0.3 #break-changes

- ADD: Angular Plugin first version

## 0.0.4

- FIX: dynamic routing config order

## 0.0.5

- FIX: plugin routes provided before app initialization

## 0.0.6

- MOD: support Angular AoT compile mode for app using `NgPluginManagerModule`
  - npm install `core-js@2.x`
  - import `core-js/es7/reflect` in `polyfills.ts`
  - enable `aot`, remove or disable `buildOptimizer` in `angular.json`
  - add `emitDecoratorMetadata` in `tsconfig.json`
- MOD: `NgPlugins` rename to `NgPluginStore`, distinguish from `NgPlugin`
- MOD: remove `NG_PLUGINS` token, use `NgPluginStore` insteadd
- MOD: remove unused providers `NgPluginInitializer`, `APP_INITIALIZER` and `NgPluginPreloadStrategy` in `NgPluginManagerModule`

## 0.0.7

- MOD: rename `NgPluginLoaderService` to `NgPluginDynamicLoader`, distinguish from `NgPluginLoader`
- MOD: rename `NgPluginDynamicResolver` to `NgPluginDynamicFactory`, distinguish from `NgPluginInstanceResolver`

## 0.0.8

- MOD: remove README in root
- MOD: merge CHANGELOG into README in library

## 0.1.0 #break-changes

- MOD: 封装路由配置
  - 不需要再配置 `NgPluginManagerModule` 和 `RouterModule`，统一为常规的配置方法，即插件化路由和非插件化路由可以写到一起
    - `NgPluginManagerModule` 重命名为 `NgPluginRouterModule`，表示其接管了路由模块的配置
      - `NgPluginRouterModule` 使用了 `RouterModule.forRoot([])` 并导出了 `RouterModule`
    - `forRoot` 方法的第二个参数定义改为 `NgPluginRoute[]`，每条路由配置定义为 `NgPluginRegularRoute` 或 `NgPluginExtendedRoute`
      - `NgPluginRegularRoute` 是插件体系特有的路由配置，将 `component` 或 `loadChildren` 改为 `plugin`，即原来的 `name` 插件名称
      - `NgPluginExtendedRoute` 是常规 `Route` 的扩展，重新定义了 `children` 中的每条定义是 `NgPluginRoute`
    - `forRoot` 新增了第三个可选参数，对应了 `RouterModule` 的 `ExtraOptions`
      - 封装了需要默认配置的 `initialNavigation: false`，外部无需再关心
- MOD: 全局的 `NG_PLUGIN_TARGETS` 依赖标识定义为 Token `NG_PLUGIN_TARGETS`
- MOD: 全局的 `NG_PLUGIN_APPS` 依赖标识更改为 Token `NG_PLUGIN_ROUTES`，因为其不再只包含插件化的 App

## 0.1.1-2 #break-changes

- MOD: 调整目录结构
- MOD: 插件包打包时，插件的名称必须以插件包名称为前缀，否则无法在运行时动态定位到
- MOD: 重命名 `NgPluginTarget` 为 `NgPluginBundle`，表示插件包
- MOD: 重命名 `NgPluginDynamicFactory` 为 `NgDynamicFactory`，表示并非与插件系统耦合
- MOD: 重命名 `NgPluginLoader` 为 `NgPluginSystemJSLoader`，明确是 SystemJS 的 Loader
- MOD: 重命名 `NgPluginStore` 为 `NgPluginInstanceStore`，明确是解析后插件实例的 Store
- ADD: 新增 `NgPluginBundles` 对应重命名为 `NG_PLUGIN_BUNDLES` 的 Token，其中每项结构在 `NgPluginBundle` 基础上扩展了 `installed` 字段，表示该插件包是否被注册过
- ADD: 新增 `NgPluginBundleRegister`，提供 `set`、`get`、`match` 方法，对插件包进行记录、提取和名称匹配。名称匹配是指匹配插件名称的前缀是否为一个插件包名，用途后面会说到
- MOD: 拆分 `NgPluginInstanceResolver`，只保留 `createComponent` 方法，将 App 类型的插件解析方法迁移到新的 `NgPluginBundleInstaller` 中
  - `NgPluginBundleInstaller` 提供 `install` 方法，即原来的 `load`，方法，用于安装解析一个插件包，功能没变
  - 提供 `NgPluginLoader` 服务及其 `load` 方法，用来提取一个插件名对应的 App 模块工厂
    - 先去找 `NgPluginInstanceStore` 是否有记录，有则直接返回工厂
    - 没有，会根据插件名称去 `NgPluginBundleRegister` 中调用 `match` 方法检查是否有格式匹配的插件包定义。没有符合要求的定义会报错，表示该插件定义有误
    - 有定义但没有被注册解析过，再去拉取该插件包文件，等待解析后再次从 `NgPluginInstanceStore` 里提取
    - 已经被解析过，表示该插件不再任何插件包中，也会报错
- MOD: 调整 `NgPluginRouterModule` 构造流程
  - 对于提供的每个 `NgPluginBundle`，先只调用 `NgPluginBundleRegister` 的 `set` 方法进行记录，并不进行注册解析，即不立即发送请求获取 JS 文件，避免首次载入并解析过多插件文件产生性能问题
  - 对于注册的每条插件化路由，不再写为 `loadChildren: () => instance.moduleFactory` 映射到模块工厂，而是映射到 `NgPluginLoader` 的 `load` 方法上，传入插件名称，更接近原生路由的写法
- MOD: 移除 `NgPluginRouterModule` 对 `RouterModule` 的配置收拢，即 `0.1.0` 更新之前的方式
  - 需要在主应用模块内自行定义 `RouterModule.forRoot()` 的配置，且必须开启 `initialNavigation: false`
  - `RouterModule` 的路由定义和 `NgPluginRouterModule` 的路由定义同时有效，有冲突时后者将会覆盖前者的设置

## 0.1.3

- REVERT: MOD: 重命名 `NgDynamicFactory` 为 `NgPluginDynamicFactory`，使小范围内职责清晰
- MOD: 更新 `NgPluginRouterModule` 构造实现，不再在构造函数中进行插件路由解析，而是使用 `NG_PLUGIN_ROUTING` 的依赖构造完成
- README: 补充说明，上个版本将 `NgPluginRouterModule` 和 `RouterModule` 的配置区分开，有两个原因：
  - 第一：`ExtraOptions` 路由配置在自定义模块提供方中，连接 `ROUTE_CONFIGURATION` 依然无效，还未研究其中的原因（ 否则封装好 `initialNavigation: false` 无疑对用户更友好 ）
  - 第二：在自定义的路由配置中通过 `component` 注册常规路由，运行时会报错 `cannot find component factory`，原因我们没有使用 Angular 的 `RouterModule` 来定义路由，而 `RouterModule` 源码中使用了 `provideRoutes` 方法来定义路由，它返回了 `ROUTES` 和 `ANALYZE_FOR_ENTRY_COMPONENTS` 两项依赖，其中 `ANALYZE_FOR_ENTRY_COMPONENTS` 将解析路由配置对象中的类名，自动注册到 ModuleFactory 的 `entryComponents` 中。这个方法在 `RouterModule.forChild` 和 `router.resetConfig` 中都被复用了，但我们没有使用这个方法
    - 解决这个问题的最简单途径，是约束路由的写法；或者需要手动在主应用模块中将全部非懒加载的组件写入 `entryComponents` 数组
    - 实际上，在 Angular 中渲染一个组件分为静态和动态，动态是指运行时根据工厂生成实例，而静态是指 DOM 直接引用。静态渲染的条件是所属模块的 `declarations` 中存在定义，动态的条件是 `entryComponents` 中存在定义。路由属于动态定义，即使是 EagerLoad 模式
    - Angular 有个隐藏的机制保证了良好的开发体验，会将下面这两部分类名自动加入 `entryComponents` 数组中
      - 写到 `@NgModule.bootstrap` 里的类，是启动 Angular App 的载体
      - 路由中使用 `provideRoutes` 方法提供的 `ANALYZE_FOR_ENTRY_COMPONENTS` 依赖
    - 因此为了彻底解决这个问题，需要将插件化路由转换得到的路由配置，提供给 `ANALYZE_FOR_ENTRY_COMPONENTS`。但问题是 Angular 还做了一些检查
      - `provideRoutes` 方法接受的 `Routes` 数组，每一项必须含有 `component`、`loadChildren` 等之一，而插件路由中没有，是后来转换出来的
      - 提供 `ANALYZE_FOR_ENTRY_COMPONENTS` 时只能使用 `useValue` 而不能经过 `useFactory` 的处理，即 `forRoot` 传参进来后不能先处理再赋值给依赖
    - 总之就还没解决..
    - 官方文档参考：<https://angular.io/guide/ngmodule-faq#when-do-i-add-components-to-entrycomponents>

## 0.1.4

- MOD: add a param for `NgPluginRouterModule.forRoot`, interfaced as `CompilerOptions`, which enables customizing `SystemJSCompiler` options for plugin loader, like `preserveWhitespaces`.

## 0.1.5

- MOD: add some logs and warnings, which helps observe runtime process.

## 0.1.6

- MOD: temporarily remove error-throw for setting existed plugin. Need further information for this phenomenon.

## 0.1.7

- REVERT: 0.1.6 中修改的报错移除
- FIX: 一个因并发路由引起的错误
  - 问题复现：一个 Navigation 动作已经开始，就执行了另一个 Navigation，两个路由还同时指向了同一个插件包的解析
    - 并发的 Navigation 可以通过调用 Router 的手动跳转来配合完成，另一方可以是一个默认的 `redirect` 配置，也可以是一个 `resolve` 路由守卫的服务
  - 问题原因：路由配置中同一个 `LoadChildrenCallback` 回调函数可能会被执行多次，导致解析插件包的过程在第一次没有结束时就执行了第二遍
  - 问题解决：不能依赖于外部 Router Navigation 的调用情况，需要内部保证 `LoadChildrenCallback` 的串行（ 这一点是否在原生 Angular 路由策略中被包容有待考察 ）
    - 在执行 `LoadChildrenCallback` 回调时，先进入一个 Promise 串行队列。后进入的路由处理事件被挂起，必须等待前一个 Promise 完成后再执行，依次串联。直到最后一个事件处理完成，这次路由回调才算结束，页面路由做出响应

## 8.214.0

- maintain package version identical with Angular Main

## 8.214.1

解决了一个可能因为插件包过大导致一开始解析整个插件包耗时过长的性能问题

- MOD: 新增 `NgPluginPreset` 元素，用于缓存从 `NgPluginBundle` 中列出的插件包源元素。这些元素会在名称被命中时按需解析并生成 `NgPluginInstance` 最终被构造
  - `NgPluginPresetStore` 用于储存被安装过的插件包的源元素
  - `NgPluginPresetResolver` 代替安装器接管插件包解析的职责
- MOD: 重命名 `NgPluginInstanceResolver` 为 `NgPluginComponentCreator`，区别于 Instance 的定义

## 8.214.2

新增了一个 `NgPluginLogger` 服务来统计各个环节的性能耗时
