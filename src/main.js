import Schema from 'schemastery';
import md5 from 'md5';
import semver from 'semver';
import EventEmitter from "events";
import { createConfigPage } from '../lib/createUI.js';
import { inputHolder } from "../lib/inputHolder.js";
import sdk from '../lib/iirose-universal-sdk/index.ts';
import { getInsideDoc } from '../lib/tools.js';

Schema.button = () => {
    let description=''
    let funcName =''

    const includeFun = {
        type: "button",
        click: funcName,
        meta:{description:description},
        link: (funcName) => {
            includeFun.click = funcName
            return includeFun;
        },
        description:(str)=>{
            includeFun.meta.description = str
            return includeFun;
        }
    };

    return includeFun
};

window.Schema = Schema;

/**
 * 生成16位随机英文+数字 
 * @returns 
 */
// TODO:优化唯一性生成
function generateRandomString() {
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
// class EventEmitter {
//     constructor() {
//         this.events = {};
//     }

//     /** @method on 仿event的on */
//     on(eventName, listener) {
//         if (!this.events[eventName])
//         {
//             this.events[eventName] = [];
//         }

//         this.events[eventName].push(listener);
//     }

//     /** @method emit 仿event的emit */
//     emit(eventName, ...args) {
//         const eventListeners = this.events[eventName];

//         if (eventListeners)
//         {
//             eventListeners.forEach(listener => listener.apply(null, args));
//         }
//     }
// }

const eventEmitter = new EventEmitter();
const corxList = {};

/** @class */
export class REIFUU_Plugin {
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
    ctx = {
        schema: Schema,
        event: eventEmitter,
        inputHolder: inputHolder,
        sdk: sdk.iirose
    };

    // 插件共享空间
    corx = {};

    /** 插件配置构型的数据 */
    value = {};

    /** @type { 'start' | 'stop' | 'reload' | 'error' | 'remove' } */
    status = 'stop';

    /** @type { REIFUU_Plugin } 当前子类*/
    /** @private */
    plugin;

    /** @type {string} 插件id */
    pluginID;

    /** @method constructor*/
    constructor() {
        this.corx = corxList;
    }

    /** @method start 启动主要子插件 */
    async pluginStart() {
        if (!this.plugin) { return; }

        this.plugin.status = 'start';

        nowREIFUUPluginList[this.plugin.name] = this.plugin.versions;

        if (!REIFUUPluginListTemp[this.plugin.name]) { REIFUUPluginListTemp[this.plugin.name] = []; }

        REIFUUPluginListTemp[this.plugin.name].push(this.plugin.pluginID);

        if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
        if (typeof this.plugin.server !== "undefined") { this.corx[this.plugin.serverName] = this.plugin.server; }
        this.pluginConfigSave();
    }

    /** @method start 停止主要子插件 */
    async pluginStop() {
        if (!this.plugin) { return; }

        this.plugin.status = 'stop';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.server !== "undefined") { delete this.corx[this.plugin.serverName]; delete corxList[this.plugin.serverName]; }
        if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
        this.pluginConfigSave();

    }

    async pluginRemove() {
        if (!this.plugin) { return; }
        this.plugin.status = 'remove';
        delete nowREIFUUPluginList[this.plugin.name];

        const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
        if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

        if (typeof this.plugin.server !== "undefined") { delete this.corx[this.plugin.serverName]; delete corxList[this.plugin.serverName]; }
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

    async pluginReload() {
        if (!this.plugin) { return; }
        this.plugin.status = 'reload';
        if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
        if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
    }

    pluginConfigSave() {
        // 存储插件配置缓存
        const key = `reifuuTemp.${this.plugin.name}`;
        let data = JSON.parse(localStorage.getItem(key));

        data[this.plugin.pluginID] = this.plugin.value;
        data[this.plugin.pluginID].ReifuuPluginStatus = this.plugin.status;

        localStorage.setItem(key, JSON.stringify(data));
    }

    async plugInit(plugin) {
        if (!plugin) { return; }
        this.plugin = plugin;

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
                eventEmitter.on(plugin.pluginID, (status) => {
                    if (status == 'stop')
                    {
                        this.pluginStop();
                    } else if (status == 'start')
                    {
                        this.pluginStart();
                    }
                });
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
                this.plugin = null;
                return;
            }
        } else
        {
            plugin.pluginID = generateRandomString();

            const text = `插件【${plugin.name}】启动成功！`;
            console.log(text);// 这句
            // 配置构型生成
            pageContent.append(createConfigPage.createConfigElement(text));

            this.pluginStart();
        }

        // setInterval(()=>{
        //     console.log('b', this.plugin.value)
        // },10000)

        // window.onunload = function () {
        //     this.pluginConfigSave();
        // };
        this.pluginConfigSave();
    }
}


const nowREIFUUPluginList = {
    core: '0.0.1'
};

// 缓存
const REIFUUPluginListTemp = {};

// 加载插件
new class loader extends REIFUU_Plugin {
    name = '插件加载器';
    versions = '0.0.1';
    depend = {
        core: '0.0.1'
    };

    config = {
        reload: this.ctx.schema.button().link("reload").description('重载按钮'),
        url: this.ctx.schema.array(String).description('js站点地址')
    };

    // url = "https://www.baidu.com";
    // feedback = "https://www.baidu.com";
    constructor() {
        super();
        this.plugInit(this);
    }

    jsUrlList = [];

    // 添加js
    addJs(url) {
        console.log(`正在安装【${url}】`);
        const insideDoc = getInsideDoc();
        const jsDoc = document.createElement('script');
        jsDoc.src = url;
        jsDoc.id = md5(url);

        insideDoc.head.append(jsDoc);
        console.log(`安装成功【${url}】`);
        _alert(`安装成功【${url}】`)
    };

    // 删除js
    delJs(url) {
        console.log(`正在卸载【${url}】`);
        const insideDoc = getInsideDoc();
        const rmDom = insideDoc.getElementById(md5(url));
        rmDom.remove();
        console.log(`卸载成功【${url}】`);

        _alert(`卸载成功【${url}】，请点击上方重载按钮应用修改`)
    }

    start() {
        const list = this.value.url;

        list.forEach(element => {
            this.addJs(element);
        });
        this.jsUrlList = list;
    }

    stop() {
        this.value.url.forEach((e) => {
            this.delJs(e);
        });

        this.pluginConfigSave();
    }

    arrayConfigChange(title, type) {
        const newlist = this.value.url;
        const oldList = this.jsUrlList;

        // arr1:old，arr2:new
        function compareArrays(arr1, arr2) {
            const changes = [];

            // 检查arr1中是否有被修改或删除的元素
            for (let i = 0; i < arr1.length; i++)
            {
                const indexInArr2 = arr2.indexOf(arr1[i]);

                if (indexInArr2 === -1)
                {
                    // 元素在arr1中存在但在arr2中不存在，即删除了
                    changes.push({ type: 'delete', value: arr1[i] });
                }
            }

            // 检查arr2中是否有新增的元素
            for (let i = 0; i < arr2.length; i++)
            {
                const indexInArr1 = arr1.indexOf(arr2[i]);

                if (indexInArr1 === -1)
                {
                    // 元素在arr2中存在但在arr1中不存在，即新增了
                    changes.push({ type: 'add', value: arr2[i] });
                }
            }

            return changes;
        }

        const differences = compareArrays(oldList, newlist);
        console.log(differences);
        differences.forEach((e) => {
            const { type, value } = e;
            if (type == 'delete') { this.delJs(value); }
            if (type == 'add') { this.addJs(value); }
        });

        this.jsUrlList = newlist;
    }

    reload() {
        return location.reload();
    }
};