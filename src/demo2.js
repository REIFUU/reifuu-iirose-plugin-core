new class REIFUU_Plugin_demo2 extends window.reifuuPluginCore.REIFUU_Plugin {
  name = '测试2';
  versions = '0.0.1';
  depend = {
    core: '0.0.1'
  };

  // 配置方式2
  // config = {
  //   a: this.server.schemastery.number().default(10).max(20).min(10),
  //   b: this.server.schemastery.string().default('嗨嗨嗨')
  // };

  constructor() {
    super();
    this.plugInit(this);
    // 配置方式2
    // this.config = {
    //   a: this.server.schemastery.number().default(10).max(20).min(10),
    //   b: this.server.schemastery.string().default('嗨嗨嗨')
    // };
    this.config = {
      a: this.server.schemastery.number().default(10).max(20).min(10),
      b: this.server.schemastery.string().default('嗨嗨嗨')
    };

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
