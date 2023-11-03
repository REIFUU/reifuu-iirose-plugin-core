const nowREIFUUPluginList = {
  core: '0.0.1'
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

  /** @method constructor 设置主要子插件 */
  constructor() { }

  /** @method start 启动主要子插件 */
  async pluginStart() {
    this.plugin.status = 'start';
    if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
  }


  /** @method start 停止主要子插件 */
  async pluginStop() {
    this.plugin.status = 'stop';
    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
  }

  async pluginRemove() {
    this.plugin.status = 'remove';
    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
    this.plugin = null;
  }

  async pluginReload() {
    this.plugin.status = 'reload';
    if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
    if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
  }

  async plugInit(plugin) {
    if (!plugin) { return; }
    nowREIFUUPluginList[plugin.name] = [plugin.versions];

    if (plugin.depend) {
      for (let key in plugin.depend) {
        const dependName = key;
        const dependVersion = plugin.depend[dependName];

        if (nowREIFUUPluginList[dependName]) {
          if (versionComparison(dependVersion, nowREIFUUPluginList[dependName])) {
            this.plugin = plugin;
            this.pluginStart();
          } else {
            return `插件【${plugin.name}】依赖的 【${key}】，版本【${nowREIFUUPluginList[dependName]}】验证失败，需要版本：【${dependVersion}】`;
          }
        } else {
          return `插件【${plugin.name}】缺少依赖 【${key}】，版本：【${dependVersion}】`;
        }
      }
    }
  }
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