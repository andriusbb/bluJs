import Blu = require("../index");

declare module "../blu" {
  // add instance property and method
  interface Blu {
    $instanceProperty: string;
    $instanceMethod(): void;
  }

  // add static property and method
  namespace Blu {
    const staticProperty: string;
    function staticMethod(): void;
  }
}

// augment ComponentOptions
declare module "../options" {
  interface ComponentOptions<V extends Blu> {
    foo?: string;
  }
}

const vm = new Blu({
  data: {
    a: true
  },
  foo: "foo"
});

vm.$instanceProperty;
vm.$instanceMethod();

Blu.staticProperty;
Blu.staticMethod();
