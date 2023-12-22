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
        if (isPage.className === "emojiContentBox")
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
    pageBox.append(plugConfigBox);
    plugConfigBox.setAttribute("style", "height: 100%;flex-grow: 1;display: flex;flex-direction: column;");

    modifyFaceHolder.addPageItem(6, "插件配置", pageBox);

    function addPage(title, Element)
    {
        const plugItem = document.createElement("div");
        plugList.append(plugItem);
        plugItem.setAttribute("style", "width: 100%;padding: 8px 0px 8px 0px;cursor: pointer;");
        plugItem.addEventListener("click", () =>
        {
            console.log(item);
        });
        plugItem.textContent = title;
    }


    // const plugConfigTop = document.createElement("div");
    // plugConfigBox.append(plugConfigTop);
    // plugConfigTop.setAttribute("style", "position: relative;width: 100%;height: 48px;border-bottom: solid 1px rgba(82, 82, 89, 0.5);display: flex;flex-direction: row-reverse;align-items: center;");

    // const plugConfigTitle = document.createElement("div");
    // plugConfigTop.append(plugConfigTitle);
    // plugConfigTitle.setAttribute("style", "position: absolute;left: 20px;font-size: 18px;font-weight: bolder;");
    // plugConfigTitle.textContent = plugListArr[0];

    // const plugConfigButton_Status = document.createElement("div");
    // plugConfigTop.append(plugConfigButton_Status);
    // plugConfigButton_Status.setAttribute("style", "font-size: 24px;margin: 0 20px 0 0;cursor: pointer;");
    // plugConfigButton_Status.innerHTML += `<span class="mdi mdi-play-outline"></span>`;
    // plugConfigButton_Status.innerHTML += `<span class="mdi mdi-pause"></span>`;



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

    return {addPage,};
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
class REIFUU_Plugin
{
    /** @type { string } name - 插件名称 */
    name;
    /** @type { string } versions -  插件版本 */
    versions;
    /** @type { JSON } 插件依赖 */
    depend;

    /** 插件服务 */
    server = {};

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
        // this.server.schemastery = window.schemastery;
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
        this.server.schemastery = window.schemastery;
        if (!plugin) { return; }
        nowREIFUUPluginList[plugin.name] = [plugin.versions];

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
                        console.log(`插件【${plugin.name}】依赖的 【${key}】，版本【${nowREIFUUPluginList[dependName]}】验证失败，需要版本：【${dependVersion}】`);
                    }
                } else
                {
                    dependStatus = 1;
                    console.log(`插件【${plugin.name}】缺少依赖 【${key}】，版本：【${dependVersion}】`);
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



// Init
const schemasteryLink = document.createElement("script");
schemasteryLink.type = "module";
schemasteryLink.src = "https://xc.null.red:8043/XCimg/img/iirose/Kurose_Kiri/zeR0Tsu/dev/schemastery/index.js";
document.body.appendChild(schemasteryLink);

const eventEmitter = new EventEmitter();

const nowREIFUUPluginList = {
    core: '0.0.1'
};

// 缓存
const REIFUUPluginListTemp = {

};