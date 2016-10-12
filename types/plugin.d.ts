import { Blu as _Blu } from "./blu";

export type PluginFunction<T> = (Blu: typeof _Blu, options?: T) => void;

export interface PluginObject<T> {
  install: PluginFunction<T>;
  [key: string]: any;
}
