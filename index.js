/**
 * 生成16位随机英文+数字
 * @returns 
 */
function generateRandomString() {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 16; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * 比对版本
 * @param {string} target 目标版本
 * @param {string} current 当前版本
 */
function versionComparison(target, current) {
  const targetArr = target.split('.');
  const currentArr = current.split('.');

  if (target.startsWith('^')) {

    if (currentArr[0] == targetArr[0].replace('^', '') && (currentArr[1] >= targetArr[1] || currentArr[2] >= targetArr[2])) {
      return true;
    } else { return false; }
  } else {
    if (currentArr[0] == targetArr[0] && currentArr[1] == targetArr[1] && currentArr[2] == targetArr[2]) {
      return true;
    } else { return false; }
  }
}

/** @class */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /** @method on 仿event的on */
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);
  }

  /** @method emit 仿event的emit */
  emit(eventName, ...args) {
    const eventListeners = this.events[eventName];

    if (eventListeners) {
      eventListeners.forEach(listener => listener.apply(null, args));
    }
  }
}
const eventEmitter = new EventEmitter();

const nowREIFUUPluginList = {
  core: '0.0.1'
};

// 缓存
const REIFUUPluginListTemp = {

};

/** @class */
class REIFUU_Plugin {
  /** @type { string } name - 插件名称 */
  name;
  /** @type { string } versions -  插件版本 */
  versions;
  /** @type { JSON } 插件依赖 */
  depend;

  /** @type { 'start' | 'stop' | 'reload' | 'error' | 'remove' } */
  status;

  /** @type { REIFUU_Plugin } 当前子类*/
  /** @private */
  plugin;

  /** @type {string} 插件id */
  pluginID;

  /** @method constructor 设置主要子插件 */
  constructor() {
  }

  /** @method start 启动主要子插件 */
  async pluginStart() {
    this.plugin.status = 'start';

    nowREIFUUPluginList[this.plugin.name] = this.plugin.versions;

    if (!REIFUUPluginListTemp[this.plugin.name]) { REIFUUPluginListTemp[this.plugin.name] = []; }

    REIFUUPluginListTemp[this.plugin.name].push(this.plugin.pluginID);

    if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
  }


  /** @method start 停止主要子插件 */
  async pluginStop() {
    if (!this.plugin) { return; }
    this.plugin.status = 'stop';
    delete nowREIFUUPluginList[this.plugin.name];

    const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
    if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
  }

  async pluginRemove() {
    if (!this.plugin) { return; }
    this.plugin.status = 'remove';
    delete nowREIFUUPluginList[this.plugin.name];

    const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
    if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
    this.plugin = null;
  }

  async pluginReload() {
    if (!this.plugin) { return; }
    this.plugin.status = 'reload';
    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
    if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
  }

  async plugInit(plugin) {
    if (!plugin) { return; }
    nowREIFUUPluginList[plugin.name] = [plugin.versions];

    if (plugin.depend) {
      /** @type { number } 0:通过依赖，1:缺少依赖*/
      let dependStatus = 0;

      for (let key in plugin.depend) {
        const dependName = key;
        const dependVersion = plugin.depend[dependName];

        if (nowREIFUUPluginList[dependName]) {
          const temp = versionComparison(dependVersion, nowREIFUUPluginList[dependName]);

          if (!temp) {
            dependStatus = 1;
            console.log(`插件【${plugin.name}】依赖的 【${key}】，版本【${nowREIFUUPluginList[dependName]}】验证失败，需要版本：【${dependVersion}】`);
          }
        } else {
          dependStatus = 1;
          console.log(`插件【${plugin.name}】缺少依赖 【${key}】，版本：【${dependVersion}】`);
        }
      }
      if (dependStatus === 0) {
        plugin.pluginID = generateRandomString();
        eventEmitter.on(plugin.pluginID, (status) => {
          if (status == 'stop') {
            this.pluginStop();
          } else if (status == 'start') {
            this.pluginStart();
          }
        });
        this.plugin = plugin;
        this.pluginStart();

      } else {
        return console.log(`插件【${plugin.name}】启动失败！`);
      }
    } else {
      plugin.pluginID = generateRandomString();
      this.plugin = plugin;
      this.pluginStart();
    }
  }
}



