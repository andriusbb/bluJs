import {
  Component,
  AsyncComponent,
  ComponentOptions,
  FunctionalComponentOptions,
  WatchOptions,
  WatchHandler,
  DirectiveOptions,
  DirectiveFunction
} from "./options.d";
import { VNode, VNodeData, VNodeChildren } from "./vnode";
import { PluginFunction, PluginObject } from "./plugin";

export type CreateElement = {
  // empty node
  (): VNode;

  // element or component name
  (tag: string, children: VNodeChildren): VNode;
  (tag: string, data?: VNodeData, children?: VNodeChildren): VNode;

  // component constructor or options
  (tag: Component, children: VNodeChildren): VNode;
  (tag: Component, data?: VNodeData, children?: VNodeChildren): VNode;

  // async component
  (tag: AsyncComponent, children: VNodeChildren): VNode;
  (tag: AsyncComponent, data?: VNodeData, children?: VNodeChildren): VNode;
}

export declare class Blu {

  constructor(options?: ComponentOptions<Blu>);

  $data: Object;
  readonly $el: HTMLElement;
  readonly $options: ComponentOptions<this>;
  readonly $parent: Blu;
  readonly $root: Blu;
  readonly $children: Blu[];
  readonly $refs: { [key: string]: Blu | Element | Blu[] | Element[]};
  readonly $slots: { [key: string]: VNode[] };
  readonly $isServer: boolean;

  $mount(elementOrSelector?: Element | String, hydrating?: boolean): this;
  $forceUpdate(): void;
  $destroy(): void;
  $set: typeof Blu.set;
  $delete: typeof Blu.delete;
  $watch(
    expOrFn: string | Function,
    callback: WatchHandler<this>,
    options?: WatchOptions
  ): (() => void);
  $on(event: string, callback: Function): this;
  $once(event: string, callback: Function): this;
  $off(event?: string, callback?: Function): this;
  $emit(event: string, ...args: any[]): this;
  $nextTick(callback?: (this: this) => void): void;
  $createElement: CreateElement;

  static config: {
    silent: boolean;
    optionMergeStrategies: any;
    devtools: boolean;
    errorHandler(err: Error, vm: Blu): void;
    keyCodes: { [key: string]: number };
  }

  static extend(options: ComponentOptions<Blu> | FunctionalComponentOptions): typeof Blu;
  static nextTick(callback: () => void, context?: any[]): void;
  static set<T>(object: Object, key: string, value: T): T;
  static set<T>(array: T[], key: number, value: T): T;
  static delete(object: Object, key: string): void;

  static directive(
    id: string,
    definition?: DirectiveOptions | DirectiveFunction
  ): DirectiveOptions;
  static filter(id: string, definition?: Function): Function;
  static component(id: string, definition?: Component | AsyncComponent): typeof Blu;

  static use<T>(plugin: PluginObject<T> | PluginFunction<T>, options?: T): void;
  static mixin(mixin: typeof Blu | ComponentOptions<Blu>): void;
  static compile(template: string): {
    render(createElement: typeof Blu.prototype.$createElement): VNode;
    staticRenderFns: (() => VNode)[];
  };
}
