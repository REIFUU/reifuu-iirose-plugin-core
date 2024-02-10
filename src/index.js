import Schema from 'schemastery';
import md5 from 'md5';
import semver from 'semver';
import { createConfigPage, modifyFaceHolder } from '../lib/createUI.js';

Schema.button = () =>
{
    return {
        type: "button",
        link: (funcName) =>
        {
            const includeFun = {
                type: "button",
                click: funcName
            };

            return includeFun;
        }
    };    
};

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

const eventEmitter = new EventEmitter();

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
    /** @type { String } 插件详情网站地址 */
    url;
    /** @type { String } 插件反馈网站地址 */
    feedback;

    /** 插件服务 */
    server = {
        schema: Schema,
        event: eventEmitter
    };

    /** 插件配置构型的数据 */
    value = {};

    /** @type { 'start' | 'stop' | 'reload' | 'error' | 'remove' } */
    status = 'stop';

    /** @type { REIFUU_Plugin } 当前子类*/
    /** @private */
    plugin;

    /** @type {string} 插件id */
    pluginID;

    createConfigPage = createConfigPage;

    /** @method constructor*/
    constructor() { }

    /** @method start 启动主要子插件 */
    async pluginStart()
    {
        if (!this.plugin) { return; }

        this.plugin.status = 'start';

        nowREIFUUPluginList[this.plugin.name] = this.plugin.versions;

        if (!REIFUUPluginListTemp[this.plugin.name]) { REIFUUPluginListTemp[this.plugin.name] = []; }

        REIFUUPluginListTemp[this.plugin.name].push(this.plugin.pluginID);
        if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
    }

    /** @method start 停止主要子插件 */
    async pluginStop()
    {
        if (!this.plugin) { return; }

        this.plugin.status = 'stop';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
        this.pluginConfigSave();
    }

    async pluginRemove()
    {
        if (!this.plugin) { return; }
        this.plugin.status = 'remove';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
        this.plugin = null;

        // 删除配置序列的最后一项
        // 也许这个也不用写
        // 不对，还是要的
        const key = `reifuuTemp.${this.plugin.name}`;
        const dataTemp = Array(localStorage.getItem(key));

        dataTemp.pop();
        localStorage.setItem(key, dataTemp.toString());
    }

    async pluginReload()
    {
        if (!this.plugin) { return; }
        this.plugin.status = 'reload';
        if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
        if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
    }

    pluginConfigSave()
    {
        // 存储插件配置缓存
        const key = `reifuuTemp.${this.plugin.name}`;
        let data = JSON.parse(localStorage.getItem(key));
        data[this.plugin.pluginID] = this.plugin.value;

        localStorage.setItem(key, JSON.stringify(data));
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
                    // 版本对比
                    const temp = semver.satisfies(nowREIFUUPluginList[dependName], dependVersion);

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
                console.log(text);
                pageContent.append(createConfigPage.createTipsElement(text, 0));
                pageContent.append(createConfigPage.createConfigElement(plugin));
                // this.pluginStart();

            } else
            {
                const text = `插件【${plugin.name}】启动失败！`;
                console.log(text);
                pageContent.append(createConfigPage.createTipsElement(text, 2));
                return;
            }
        } else
        {
            plugin.pluginID = generateRandomString();
            this.plugin = plugin;
            const text = `插件【${plugin.name}】启动成功！`;
            console.log(text);// 这句
            // 配置构型生成
            pageContent.append(createConfigPage.createConfigElement(text));

            // this.pluginStart();
        }
    }
}


const nowREIFUUPluginList = {
    core: '0.0.1'
};

// 缓存
const REIFUUPluginListTemp = {

};
