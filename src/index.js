import Schema from 'schemastery';
import md5 from 'md5';
import { createConfigPage, modifyFaceHolder } from '../lib/createUI.js';

window.Schema = Schema;



/**
 * 生成16位随机英文+数字 
 * @returns 
 */
// TODO:优化唯一性生成
function generateRandomString()
{
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 16; i++)
    {
        let randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    const now = Date.now();
    result += md5(now);;
    return result;
}

/**
 * 比对版本
 * @param {string} target 目标版本
 * @param {string} current 当前版本
 */
function versionComparison(target, current)
{
    const targetArr = target.split('.');
    const currentArr = current.split('.');

    if (target.startsWith('^'))
    {

        if (currentArr[0] == targetArr[0].replace('^', '') && (currentArr[1] >= targetArr[1] || currentArr[2] >= targetArr[2]))
        {
            return true;
        } else { return false; }
    } else
    {
        if (currentArr[0] == targetArr[0] && currentArr[1] == targetArr[1] && currentArr[2] == targetArr[2])
        {
            return true;
        } else { return false; }
    }
}

/** @class */
class EventEmitter
{
    constructor()
    {
        this.events = {};
    }

    /** @method on 仿event的on */
    on(eventName, listener)
    {
        if (!this.events[eventName])
        {
            this.events[eventName] = [];
        }

        this.events[eventName].push(listener);
    }

    /** @method emit 仿event的emit */
    emit(eventName, ...args)
    {
        const eventListeners = this.events[eventName];

        if (eventListeners)
        {
            eventListeners.forEach(listener => listener.apply(null, args));
        }
    }
}

/** @class */
export class REIFUU_Plugin
{
    /** @type { string } name - 插件名称 */
    name;
    /** @type { string } versions -  插件版本 */
    versions;
    /** @type { JSON } 插件依赖 */
    depend;
    /** @type { JSON } 插件配置构型 */
    config;

    /** 插件服务 */
    server = {
        schemastery: Schema
    };

    /** @type { 'start' | 'stop' | 'reload' | 'error' | 'remove' } */
    status;

    /** @type { REIFUU_Plugin } 当前子类*/
    /** @private */
    plugin;

    /** @type {string} 插件id */
    pluginID;

    /** @method constructor*/
    constructor()
    {
        this.createConfigPage = createConfigPage;
        this.server.schemastery = Schema;
    }

    /** @method start 启动主要子插件 */
    async pluginStart()
    {
        this.plugin.status = 'start';

        nowREIFUUPluginList[this.plugin.name] = this.plugin.versions;

        if (!REIFUUPluginListTemp[this.plugin.name]) { REIFUUPluginListTemp[this.plugin.name] = []; }

        REIFUUPluginListTemp[this.plugin.name].push(this.plugin.pluginID);

        if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
    }

    /** @method start 停止主要子插件 */
    async pluginStop()
    {
        if (!this.plugin) { return; }
        this.plugin.status = 'stop';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
    }

    async pluginRemove()
    {
        if (!this.plugin) { return; }
        this.plugin.status = 'remove';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
        this.plugin = null;
    }

    async pluginReload()
    {
        if (!this.plugin) { return; }
        this.plugin.status = 'reload';
        if (typeof this.plugin.stop !== "undefined") { await this.plugin.stop(); }
        if (typeof this.plugin.start !== "undefined") { await this.plugin.start(); }
    }

    async plugInit(plugin)
    {
        if (!plugin) { return; }
        nowREIFUUPluginList[plugin.name] = [plugin.versions];

        const addPage = createConfigPage.createPlugContent(plugin);
        const pageContent = addPage.querySelector("#pageContent");
        createConfigPage.addPage(plugin, addPage);



        if (plugin.depend)
        {
            /** @type { number } 0:通过依赖，1:缺少依赖*/
            let dependStatus = 0;

            for (let key in plugin.depend)
            {
                const dependName = key;
                const dependVersion = plugin.depend[dependName];

                if (nowREIFUUPluginList[dependName])
                {
                    const temp = versionComparison(dependVersion, nowREIFUUPluginList[dependName]);

                    if (!temp)
                    {
                        dependStatus = 1;
                        const text = `依赖项 【${key}】，版本【${nowREIFUUPluginList[dependName]}】验证失败，需要版本：【${dependVersion}】`;
                        // 这边是依赖的插件版本不对
                        pageContent.append(createConfigPage.createTipsElement(text, 2));
                    }
                } else
                {
                    dependStatus = 1;
                    const text = `插件【${plugin.name}】缺少依赖 【${key}】，版本：【${dependVersion}】`;
                    pageContent.append(createConfigPage.createTipsElement(text, 2));
                    // 这边是缺少依赖
                }
            }
            if (dependStatus === 0)
            {
                plugin.pluginID = generateRandomString();
                eventEmitter.on(plugin.pluginID, (status) =>
                {
                    if (status == 'stop')
                    {
                        this.pluginStop();
                    } else if (status == 'start')
                    {
                        this.pluginStart();
                    }
                });
                this.plugin = plugin;
                const text = `插件【${plugin.name}】启动成功！`;
                pageContent.append(createConfigPage.createTipsElement(text, 0));
                pageContent.append(createConfigPage.createConfigElement(plugin))
                this.pluginStart();

            } else
            {
                const text = `插件【${plugin.name}】启动失败！`;
                console.log(text);
                pageContent.append(createConfigPage.createTipsElement(text, 2));
                return;
            }
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
