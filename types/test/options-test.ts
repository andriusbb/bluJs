import Blu = require("../index");
import { ComponentOptions, FunctionalComponentOptions } from "../index";

interface Component extends Blu {
  a: number;
}

Blu.component('component', {
  data() {
    this.$mount
    this.a
    return {
      a: 1
    }
  },
  props: {
    size: Number,
    name: {
      type: String,
      default: 0,
      required: true,
      validator(value) {
        return value > 0;
      }
    }
  },
  propsData: {
    msg: "Hello"
  },
  computed: {
    aDouble(this: Component) {
      return this.a * 2;
    },
    aPlus: {
      get(this: Component) {
        return this.a + 1;
      },
      set(this: Component, v: number) {
        this.a = v - 1;
      },
      cache: false
    }
  },
  methods: {
    plus() {
      this.a++;
    }
  },
  watch: {
    'a': function(val: number, oldVal: number) {
      console.log(`new: ${val}, old: ${oldVal}`);
    },
    'b': 'someMethod',
    'c': {
      handler(val, oldVal) {
        this.a = val
      },
      deep: true
    }
  },
  el: "#app",
  template: "<div>{{ message }}</div>",
  render(createElement) {
    return createElement("div", {
      attrs: {
        id: "foo"
      },
      props: {
        myProp: "bar"
      },
      domProps: {
        innerHTML: "baz"
      },
      on: {
        click: new Function
      },
      nativeOn: {
        click: new Function
      },
      class: {
        foo: true,
        bar: false
      },
      style: {
        color: 'red',
        fontSize: '14px'
      },
      key: 'myKey',
      ref: 'myRef'
    }, [
      createElement(),
      createElement("div", "message"),
      createElement(Blu.component("component")),
      createElement({} as ComponentOptions<Blu>),
      createElement({ functional: true }),

      createElement(() => Blu.component("component")),
      createElement(() => ( {} as ComponentOptions<Blu> )),
      createElement(() => {
        return new Promise((resolve) => {
          resolve({} as ComponentOptions<Blu>);
        })
      }),
      createElement((resolve, reject) => {
        resolve({} as ComponentOptions<Blu>);
        reject();
      }),

      "message",

      [createElement("div", "message")]
    ]);
  },
  staticRenderFns: [],

  beforeCreate() {
    this.a = 1;
  },
  created() {},
  beforeDestroy() {},
  destroyed() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},

  directives: {
    a: {
      bind() {},
      inserted() {},
      update() {},
      componentMounted() {},
      unbind() {}
    },
    b(el, binding, vnode, oldVnode) {
      el.textContent;

      binding.name;
      binding.value;
      binding.oldValue;
      binding.expression;
      binding.arg;
      binding.modifiers["modifier"];
    }
  },
  components: {
    a: Blu.component(""),
    b: {} as ComponentOptions<Blu>
  },
  transitions: {},
  filters: {
    double(value: number) {
      return value * 2;
    }
  },
  parent: new Blu,
  mixins: [Blu.component(""), ({} as ComponentOptions<Blu>)],
  name: "Component",
  extends: {} as ComponentOptions<Blu>,
  delimiters: ["${", "}"]
} as ComponentOptions<Component>);

Blu.component('functional-component', {
  props: ['prop'],
  functional: true,
  render(createElement, context) {
    context.props;
    context.children;
    context.slots;
    context.data;
    context.parent;
    return createElement("div", {}, context.children);
  }
} as FunctionalComponentOptions);

Blu.component("async-component", (resolve, reject) => {
  setTimeout(() => {
    resolve(Blu.component("component"));
  }, 0);
  return new Promise((resolve) => {
    resolve({ functional: true } as FunctionalComponentOptions);
  })
});
