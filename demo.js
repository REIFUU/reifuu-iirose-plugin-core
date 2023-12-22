new class REIFUU_Plugin_demo1 extends REIFUU_Plugin {
  name = '测试';
  versions = '0.0.1';
  depend = {
    core: '0.0.1'
  };

  配置方式1
  config = {
    '主要配置': {
      a: this.server.schemastery.number().default(10).max(20).min(10),
      b: this.server.schemastery.string().default('嗨嗨嗨')
    },
    '次要配置': {
      c: this.server.schemastery.array(),
      d: this.server.schemastery.number().default(10).description('描述'),
    }
  };
  
  // // 配置方式2
  // config = {
    //   a: this.server.schemastery.number().default(10).max(20).min(10),
    //   b: this.server.schemastery.string().default('嗨嗨嗨')
    // };

  constructor() {
    super();
    this.plugInit(this);

    // 插件进行初始化代码
    // 理论上插件允许多开，只要把变量定义在这个类里面就好了

    /* code */
  }

  start() {
    // 插件主代码
    /* code */
  }

  stop() {
    // 插件消除影响代码
    /* code */
  }
};
