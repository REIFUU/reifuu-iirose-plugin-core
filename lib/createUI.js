/**
 * 
 * @typedef {object} modifyFaceHolder
 * @property {function} addPageItem 添加faceHolder子页面
 * @property {function} hiddenPageType 隐藏faceHolderType项 
 * @property {function} hiddenPageItem 隐藏hiddenPageItem项 
 */

import { object } from "schemastery";

/**
 * 修改faceHolder相关方法
 * @type {modifyFaceHolder}
 */
export const modifyFaceHolder = (() =>
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
        const className = isPage?.className;
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
export const createConfigPage = (() =>
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
        if (type === 0)
        {
            tips.setAttribute("style", "background: rgba(59, 165, 94, .1);border-left: #3ba55e 4px solid;padding: 6px 12px;margin: 0 0 12px 0;");

        } else if (type === 1)
        {
            tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(116, 89, 255, .1);border-left: #7459ff 4px solid;padding: 6px 12px;");
        } else if (type === 2)
        {
            tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(249, 175, 27, .1);border-left: #f9af1b 4px solid;padding: 6px 12px;");
        }
        else
        {
            return;
        }
        tips.textContent = text;
        return tips;
    }

    function createConfigElement(plugin)
    {
        const box = document.createElement("div");
        box.setAttribute("style", " margin: 0 0 20px 0;");
        console.log(plugin.config);



        const configList = Object.keys(plugin.config);
        configList.forEach(item =>
        {
            const configKeyList = Object.keys(plugin.config[item]);
            const title = document.createElement("div");
            title.textContent = item;
            title.setAttribute("style", "padding: 0px 6px 8px 0;border-bottom: 1px solid rgba(82, 82, 89, .5);font-size: 18px;font-weight: bold;");
            box.append(title);
            configKeyList.forEach(key =>
            {
                const schema = plugin.config[item][key];

                box.append(createConfigItem(schema, key));
            });
        });
        return box;
    }

    function createConfigItem(schema, title)
    {
        const schemaElement = document.createElement("div");
        schemaElement.setAttribute("style", "display: flex;flex-direction: row-reverse;align-items: center;padding: 6px 8px;border-bottom: 1px solid rgba(82, 82, 89, .5);");

        const right = document.createElement("div");
        schemaElement.append(right);
        const left = document.createElement("div");
        schemaElement.append(left);
        left.setAttribute("style", "flex-grow: 1;");

        const name = document.createElement("div");
        left.append(name);
        name.setAttribute("style", "font-weight: bold;");
        name.textContent = title;
        const description = document.createElement("div");
        left.append(description);
        description.setAttribute("style", "width: 100%;font-size: 12px;overflow-wrap: anywhere;");

        if (schema.meta.description)
        {
            description.textContent = schema.meta.description;
        }

        switch (schema.type)
        {
            case "number":
                const number = document.createElement("div");
                number.setAttribute("style", "margin: 0 12px;display: flex;border: 1px solid rgba(82, 82, 89, .5);border-radius: 4px;");
                const input = document.createElement("input");
                input.setAttribute("style", "border-left: 1px solid rgba(82, 82, 89, .5);width: 64px;border-right: 1px solid rgba(82, 82, 89, .5);padding: 4px 6px;text-align: center;");
                const plus = document.createElement("span");
                plus.className = "mdi mdi-plus";
                plus.setAttribute("style", "width: 30px;display: flex;align-items: center;justify-content: center;");
                const sub = document.createElement("span");
                sub.className = "mdi mdi-minus";
                sub.setAttribute("style", "width: 30px;display: flex;align-items: center;justify-content: center;");

                input.value = schema.meta.default;

                plus.addEventListener("click", () =>
                {
                    input.value = schema(parseInt(input.value, 10) + 1);
                });
                sub.addEventListener("click", () =>
                {
                    input.value = schema(parseInt(input.value, 10) - 1);
                });

                input.addEventListener('focus', function ()
                {
                    // 在聚焦时更改样式
                    number.style.outline = '1px solid rgb(116, 89, 255)';
                });

                // 添加失焦事件处理程序（可选，根据需要）
                input.addEventListener('blur', function ()
                {
                    // 在失焦时还原样式
                    number.style.outline = '';
                });

                number.append(sub);
                number.append(input);
                number.append(plus);

                right.append(number);
                break;
            case "string":
                
                break;
        }

        return schemaElement;
    }

    return {
        addPage,
        newElement,
        createPlugContent,
        createTipsElement,
        createConfigElement
    };
})();
