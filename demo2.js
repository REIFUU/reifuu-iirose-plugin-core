new class REIFUU_Plugin_demo extends REIFUU_Plugin {
  name = '测试2';
  versions = '0.0.1';
  depend = {
    core: '0.0.1'
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
    console.log('test2222222222')
  }

  stop() {
    // 插件消除影响代码
    /* code */
  }
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);
  }

  emit(eventName, ...args) {
    const eventListeners = this.events[eventName];

    if (eventListeners) {
      eventListeners.forEach(listener => listener.apply(null, args));
    }
  }
}

