new class REIFUU_Plugin_demo extends REIFUU_Plugin {
  name = '测试';
  versions = '0.0.1';
  depend = {
    core: '0.0.1'
  };

  // 配置方式1
  config = {
    '主要配置': {
      a: {/*西格玛的配置构型*/ },
      b: {/*西格玛的配置构型*/ }
    },
    '次要配置': {
      c: {/*西格玛的配置构型*/ },
      d: {/*西格玛的配置构型*/ }
    }
  };
  
  // 配置方式2
  config = {
    a: {/*西格玛的配置构型*/ },
    b: {/*西格玛的配置构型*/ }
  };

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
