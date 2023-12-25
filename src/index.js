import Schema from 'schemastery';;

window.Schema = Schema;
/**
 * 
 * @typedef {object} modifyFaceHolder
 * @property {function} addPageItem 添加faceHolder子页面
 * @property {function} hiddenPageType 隐藏faceHolderType项 
 * @property {function} hiddenPageItem 隐藏hiddenPageItem项 
 */
/**
 * 修改faceHolder相关方法
 * @type {modifyFaceHolder}
 */
const modifyFaceHolder = (() =>
{
    const faceHolder = document.getElementById("faceHolder");
    const faceHolderType = faceHolder.querySelector(".faceHolderType");
    const pageList = faceHolder.querySelector("div:nth-child(2)");
    const initAddPageItem = {};

    const pageDisplayBlock = "display: block; opacity: 1;";
    const pageDisplayNoneLeft = "opacity: 1; transform: translateX(10%); display: none;";
    const pageDisplayNoneRight = "opacity: 1; transform: translateX(-10%); display: none;";
    const pageTransitionON = "opacity: 1; display: block; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s;z-index:1;";
    const pageTransitionOFFLeft = "opacity: 0; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s; transform: translateX(10%);z-index:999;";
    const pageTransitionOFFRight = "opacity: 0; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s; transform: translateX(-10%);z-index:999;";


    const pageListObserver = new MutationObserver(mutationsList =>
    {
        // @ts-ignore
        const /**@type {Element} */ isPage = mutationsList[0].addedNodes[0];
        const className = isPage.className;
        if (className === "emojiContentBox")
        {
            const index = isPage.getAttribute("index");
            if (initAddPageItem[index])
            {
                initCreatePage(index, isPage);
            }
        }
    });
    pageListObserver.observe(pageList, { characterData: true, childList: true, subtree: true });

    /**
     * 
     * @param {number} index - 被添加页面的序号 
     * @param {string} title - 添加子页面标题
     * @param {Element|string} [content] - 添加子页面内容
     */
    function addPageItem(index, title, content)
    {
        // @ts-ignore
        if (!(content && content.nodeType === 1))
        {
            const /**@type {Element} */ addElement = document.createElement("div");
            addElement.setAttribute("style", "height: 100%;width: 100%;");
            // @ts-ignore
            addElement.innerHTML = content;
            content = addElement;
        }

        const isPage = pageList.querySelector(`div[index="${index}"]`);
        if (isPage)
        {
            // @ts-ignore
            createPage(index, isPage, title, content);
        } else
        {
            if (!initAddPageItem[index])
            {
                initAddPageItem[index] = [];
            }
            initAddPageItem[index].push([title, content]);
        }
    }

    /**
     * 初始化创建相关element以及事件
     * @param {string} index 
     * @param {*} page 
     */
    function initCreatePage(index, page)
    {
        const emojiPage = page.querySelector(".emojiPage");
        const emojiContent = page.querySelector(".emojiContent");
        const emojiPageItem = emojiPage.querySelectorAll("span");

        // 获取当前主题emojiPageItem选中颜色
        let electStyle = emojiPage.querySelector("span[style]").getAttribute("style");

        // emojiPageItem切换
        emojiPage.addEventListener("click", event =>
        {
            if (event.target.classList.contains("faceHolderPageItem"))
            {
                emojiPage.querySelectorAll("span").forEach(item =>
                {
                    item.setAttribute("style", "");
                });
                event.target.setAttribute("style", electStyle);

                emojiContent.querySelectorAll(":scope > div").forEach(item =>
                {
                    const targetP = event.target.getAttribute("p");
                    const nowIndex = item.getAttribute("index");
                    if (targetP == nowIndex)
                    {
                        item.setAttribute("style", pageTransitionON);
                        setTimeout(() =>
                        {
                            item.setAttribute("style", pageDisplayBlock);
                        }, 250);
                    } else if (targetP > nowIndex)
                    {
                        item.setAttribute("style", pageTransitionOFFRight);
                        setTimeout(() =>
                        {
                            item.setAttribute("style", pageDisplayNoneRight);
                        }, 250);
                    } else if (targetP < nowIndex)
                    {
                        item.setAttribute("style", pageTransitionOFFLeft);
                        setTimeout(() =>
                        {
                            item.setAttribute("style", pageDisplayNoneLeft);
                        }, 250);
                    }
                });
            }
        });

        // 添加emojiPage
        initAddPageItem[index].forEach((item, index) =>
        {
            // item
            const newItem = document.createElement("span");
            newItem.className = "faceHolderPageItem";
            newItem.textContent = item[0];
            newItem.setAttribute("p", emojiPageItem.length + index);
            emojiPage.appendChild(newItem);

            // content
            const newContent = document.createElement("div");
            newContent.className = "faceHolderBoxChild textColor panelHolderItem";
            newContent.setAttribute("index", emojiPageItem.length + index);
            newContent.setAttribute("style", pageDisplayNoneLeft);
            newContent.appendChild(item[1]);
            emojiContent.appendChild(newContent);
        });
    }

    /**
     * 创建pageItem
     * @param {number} index 
     * @param {*} page 
     * @param {string} title 
     * @param {Element} content 
     */
    function createPage(index, page, title, content)
    {
        const emojiPage = page.querySelector(".emojiPage");
        const emojiContent = page.querySelector(".emojiContent");
        const emojiPageItem = emojiPage.querySelectorAll("span");

        // item
        const newItem = document.createElement("span");
        newItem.className = "faceHolderPageItem";
        newItem.textContent = title;
        newItem.setAttribute("p", emojiPageItem.length + index);
        emojiPage.appendChild(newItem);

        // content
        const newContent = document.createElement("div");
        newContent.className = "faceHolderBoxChild textColor panelHolderItem";
        newContent.setAttribute("index", emojiPageItem.length + index);
        newContent.setAttribute("style", pageDisplayNoneLeft);
        newContent.appendChild(content);
        emojiContent.appendChild(newContent);
    }

    /**
     * 隐藏faceHolderType项
     * @param {number} eq faceHolderType项的行内eq值
     * @returns 
     */
    function hiddenPageType(eq)
    {
        const /**@type {HTMLElement} */ targetType = faceHolderType.querySelector(`span[eq="${eq}"]`);
        if (targetType)
        {
            targetType.style.display = "none";
            return true;
        } else
        {
            return null;
        }
    }

    /**
     * 隐藏faceHolderPageItem项
     * @param {number} index faceHolderType项的行内index值
     * @param {number} p faceHolderPageItem项的行内p值
     * @returns 
     */
    function hiddenPageItem(index, p)
    {
        const /**@type {HTMLElement} */ targetPage = pageList.querySelector(`div[index="${index}"]`);
        if (targetPage)
        {
            const /**@type {HTMLElement} */ targetItem = targetPage.querySelector(`.emojiPage>span[p="${p}"]`);
            if (targetItem)
            {
                targetItem.style.display = "none";
                return true;
            } else
            {
                return null;
            }
        } else
        {
            return null;
        }
    }

    return {
        addPageItem,
        hiddenPageType,
        hiddenPageItem
    };
})();

/**
 * 创建插件配置页面及方法
 */
const createConfigPage = (() =>
{
    // 基础UI
    const pageBox = document.createElement("div");
    pageBox.setAttribute("style", "height: 100%;width: 100%;display: flex;flex-direction: row;background-color: rgb(49, 49, 54);color: rgba(255, 255, 245, 0.86);");

    const plugList = document.createElement("div");
    pageBox.append(plugList);
    plugList.setAttribute("style", "background-color: rgb(37, 37, 41);border-right: 1px solid rgba(82, 82, 89, 0.5);min-width: 16%;height: 100%;overflow-x: hidden;padding: 8px 0 0 24px;");

    const plugConfigBox = document.createElement("div");
    const plugConfigPageArr = {};
    pageBox.append(plugConfigBox);
    plugConfigBox.setAttribute("style", "height: 100%;flex-grow: 1;display: flex;flex-direction: column;");

    // 添加插件配置页面于faceHolder
    modifyFaceHolder.addPageItem(6, "插件配置", pageBox);

    // 添加插件配置主页内容并显示
    addPage({ name: "REIFUU" }, newElement("ff0000"));
    plugConfigBox.appendChild(plugConfigPageArr[0]);

    // devtest
    function newElement(str)
    {
        const ele = document.createElement("div");
        ele.setAttribute("style", `height: 90%;width: 90%;background:#${str};margin:12px`);
        ele.textContent = str;
        return ele;
    }

    /**
     * 添加插件页面
     * @param {*} plugin 
     * @param {Element} [Element] 
     */
    function addPage(plugin, Element)
    {
        const plugItem = document.createElement("div");
        const plugListArr = plugList.querySelectorAll("div");
        const itemIndex = plugListArr.length.toString();
        plugList.append(plugItem);
        plugItem.setAttribute("style", "width: 100%;padding: 8px 0px 8px 0px;cursor: pointer;");
        plugItem.setAttribute("index", itemIndex);
        Element.setAttribute("index", itemIndex);
        plugConfigPageArr[itemIndex] = Element;

        plugItem.addEventListener("click", () =>
        {
            switchConfigPage(itemIndex);
            console.log(plugin.name);
        });
        plugItem.textContent = plugin.name;
    }

    /**
     * 切换配置页面
     * @param {number} target
     */
    function switchConfigPage(target)
    {
        const controls = plugConfigBox.querySelector('div');
        const nowIndex = controls.getAttribute("index");
        if (nowIndex != target)
        {
            const targetDom = plugConfigPageArr[target];
            controls.remove();
            plugConfigPageArr[nowIndex] = controls;
            plugConfigBox.appendChild(targetDom);
        }
    }

    /**
     * 创建插件页面内容
     * @param {*} plugin 
     * @returns 
     */
    function createPlugContent(plugin)
    {
        const plugConfigBox = document.createElement("div");
        plugConfigBox.setAttribute("style", "height: 100%;flex-grow: 1;display: flex;flex-direction: column;");

        const plugConfigTop = document.createElement("div");
        plugConfigBox.append(plugConfigTop);
        plugConfigTop.setAttribute("style", "margin: 0 0 16px 0;position: relative;width: 100%;height: 56px;border-bottom: solid 1px rgba(82, 82, 89, 0.5);display: flex;flex-direction: row;align-items: center;");

        const plugConfigTitle = document.createElement("div");
        plugConfigTop.append(plugConfigTitle);
        plugConfigTitle.setAttribute("style", "font-size: 18px;font-weight: bolder;margin: 0 24px 0 30px;");
        plugConfigTitle.textContent = plugin.name;

        const plugConfigButton_Status = document.createElement("div");
        plugConfigTop.append(plugConfigButton_Status);
        plugConfigButton_Status.setAttribute("style", "position: absolute;right: 20px;font-size: 24px;margin: 0 20px 0 0;cursor: pointer;");
        plugConfigButton_Status.innerHTML += `<span class="mdi mdi-play-outline"></span>`;
        plugConfigButton_Status.innerHTML += `<span class="mdi mdi-pause"></span>`;

        const configView = document.createElement("div");
        plugConfigBox.append(configView);
        configView.setAttribute("style", "overflow: auto;position: relative;height: 100%;");

        const scrollbarView = document.createElement("div");
        configView.append(scrollbarView);
        scrollbarView.id = "pageContent";
        scrollbarView.setAttribute("style", "margin: 0 30px;");

        // const navBtn = document.createElement("div");
        // plugConfigTop.append(navBtn);
        // navBtn.setAttribute("style", "display: flex;flex-direction: row;margin: 0 0 16px 0;");


        const btn0 = document.createElement("div");
        const btn1 = document.createElement("div");
        const btn2 = document.createElement("div");
        plugConfigTop.append(btn0);
        plugConfigTop.append(btn1);
        plugConfigTop.append(btn2);
        btn0.setAttribute("style", "cursor: pointer;border: solid 1px rgba(82, 82, 89, 0.8);border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");
        btn1.setAttribute("style", "cursor: pointer;border: solid 1px rgba(82, 82, 89, 0.8);border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");
        btn2.setAttribute("style", "cursor: pointer;border: solid 1px rgba(82, 82, 89, 0.8);border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");
        btn0.textContent = `当前版本：${plugin.versions}`;
        btn1.textContent = "插件主页";
        btn2.textContent = "问题反馈";

        // scrollbarView.append(createTipsElement("true", 0));
        // scrollbarView.append(createTipsElement("info", 1));
        // scrollbarView.append(createTipsElement("warning", 2));
        // scrollbarView.append(createTipsElement("true", 0));
        // scrollbarView.append(createTipsElement("info", 1));
        // scrollbarView.append(createTipsElement("warning", 2));
        // scrollbarView.append(createTipsElement("true", 0));
        // scrollbarView.append(createTipsElement("info", 1));
        // scrollbarView.append(createTipsElement("warning", 2));
        // scrollbarView.append(createTipsElement("true", 0));
        // scrollbarView.append(createTipsElement("info", 1));
        // scrollbarView.append(createTipsElement("warning", 2));
        // scrollbarView.append(createTipsElement("true", 0));
        // scrollbarView.append(createTipsElement("info", 1));
        // scrollbarView.append(createTipsElement("warning", 2));



        return plugConfigBox;
    }

    /**
     * 创建tips控件
     * @param {string} text 提示文本
     * @param {number} type 类型 0：true  1：info 2：warning
     * @returns {Element}
     */
    function createTipsElement(text, type)
    {
        const tips = document.createElement("div");
        if (type === 0) {
            tips.setAttribute("style", "background: rgba(59, 165, 94, .1);border-left: #3ba55e 4px solid;padding: 6px 12px;margin: 0 0 12px 0;");

        } else if (type === 1) {
            tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(116, 89, 255, .1);border-left: #7459ff 4px solid;padding: 6px 12px;");
        } else if (type === 2) {
            tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(249, 175, 27, .1);border-left: #f9af1b 4px solid;padding: 6px 12px;");
        }
        else {
            return;
        }
        tips.textContent = text;
        return tips;
    }



    // // 生成
    // plugListArr.forEach(item =>
    // {
    //     const plugItem = document.createElement("div");
    //     plugList.append(plugItem);
    //     plugItem.setAttribute("style", "width: 100%;padding: 8px 0px 8px 0px;cursor: pointer;");
    //     plugItem.addEventListener("click", () =>
    //     {
    //         console.log(item);
    //         plugConfigTitle.textContent = item;
    //     });
    //     plugItem.textContent = item;
    // });

    return {
        addPage,
        newElement,
        createPlugContent,
        createTipsElement
    };
})();



/**
 * 生成16位随机英文+数字
 * @returns 
 */
function generateRandomString()
{
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 16; i++)
    {
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
                this.pluginStart();

            } else
            {
                return console.log(`插件【${plugin.name}】启动失败！`);
            }
        } else
        {
            plugin.pluginID = generateRandomString();
            this.plugin = plugin;
            this.pluginStart();
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
