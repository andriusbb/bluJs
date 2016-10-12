import Blu = require("../index");
import { PluginFunction, PluginObject } from "../index";

class Option {
  prefix: string;
  suffix: string;
}

const plugin: PluginObject<Option> = {
  install(Blu, option) {
    if (typeof option !== "undefined") {
      const {prefix, suffix} = option;
    }
  }
}
const installer: PluginFunction<Option> = function(Blu, option) { }

Blu.use(plugin, new Option);
Blu.use(installer, new Option);
