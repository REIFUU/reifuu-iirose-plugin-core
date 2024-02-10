//TODO：冲突检测

/**
 * @returns 
 */
export const inputHolder = (() =>
{
    const moveInput = document.querySelector("#moveinput");

    let triggerCondition = [];
    let triggerContent = [];
    let isTrigger = 0;
    let selectIndex = 0;

    let moveInputValue;
    let selectionStart;
    let triggerStartIndex;
    let triggerEndIndex;
    let callback;

    moveInput.addEventListener("keydown", (event) =>
    {
        const inputHolder = document.getElementById('inputHolder');
        const holderItem = document.querySelectorAll("#holderItem");

        // 屏蔽默认上下事件
        if ((inputHolder ? true : false) && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
        {
            event.preventDefault();
        }

        // 面板上下键选择
        if (event.key === 'ArrowUp')
        {
            selectIndex = (selectIndex - 1 + holderItem.length) % holderItem.length;
            updateSelectedElement(holderItem);
        } else if (event.key === 'ArrowDown')
        {
            selectIndex = (selectIndex + 1) % holderItem.length;
            updateSelectedElement(holderItem);
        }

        // 选择触发事件
        if (event.key === 'Tab' && (inputHolder ? true : false))
        {
            event.preventDefault();
            holderItem[selectIndex].click();
        }

        //关闭面板
        if (event.key === "Escape")
        {
            isTrigger = 0;
            deleteHolder();
        }

        //输入内容检查
        requestAnimationFrame(() =>
        {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
            {
                detectInput();
            }
        });
    });

    function detectInput()
    {
        moveInputValue = moveInput.value;
        selectionStart = moveInput.selectionStart;

        if (isTrigger)
        {
            //光标越界退出
            if (selectionStart < triggerEndIndex)
            {
                isTrigger = 0;
                deleteHolder();
                return;
            }

            triggerContent[0] = moveInputValue.slice(0, triggerStartIndex);
            triggerContent[1] = moveInputValue.slice(triggerStartIndex, triggerEndIndex);
            triggerContent[2] = moveInputValue.slice(triggerEndIndex, selectionStart);
            triggerContent[3] = moveInputValue.slice(selectionStart);
            callback();

        } else
        {
            const contentBeforeCursor = moveInputValue.slice(0, selectionStart);
            for (let condition of triggerCondition)
            {

                if (condition.condition instanceof RegExp)
                {
                    if (contentBeforeCursor.endsWith(contentBeforeCursor.match(condition.condition)))
                    {
                        triggerStartIndex = selectionStart - contentBeforeCursor.match(condition.condition)[0].length;
                        triggerEndIndex = selectionStart;
                        isTrigger = 1;
                        callback = condition.callback;
                        detectInput();
                        break;
                    }
                } else
                {
                    if (contentBeforeCursor.endsWith(condition.condition))
                    {
                        triggerStartIndex = selectionStart - condition.condition.length;
                        triggerEndIndex = selectionStart;
                        isTrigger = 1;
                        callback = condition.callback;

                        detectInput();
                        break;
                    }
                }
            }
        }


    }

    /**
     * 添加触发内容
     * @param {*} condition 
     * @param {*} callback 
     */
    function addTrigger(condition, callback)
    {
        const trigger = { condition: condition, callback: callback };
        triggerCondition.push(trigger);
    }

    /**
     * 更新列表样式
     */
    function updateSelectedElement(elementAll)
    {
        elementAll.forEach((element, index) =>
        {
            if (index === selectIndex)
            {
                // @ts-ignore
                element.style.backgroundColor = `#${window['inputcolorhex']}88`;
            } else
            {
                // @ts-ignore
                element.style.backgroundColor = 'transparent';
            }
        });
    }


    /**
 * 创建弹出面板
 * @param {Array} list  
 */
    function createinputHolder(list)
    {
        // 清除当前存在面板
        deleteHolder();

        // 空列表
        if (list.length === 0)
        {
            deleteHolder();
            return;
        }


        const moveInputBubble = document.querySelector('#moveinputBubble');
        const moveInput = document.querySelector("#moveinput");

        const moveInputBubbleStyle = window.getComputedStyle(moveInputBubble);
        const moveInputStyle = window.getComputedStyle(moveInput);

        const inputHolder = document.createElement('div');
        inputHolder.id = 'inputHolder';
        inputHolder.style.left = '0px';
        inputHolder.style.position = 'absolute';
        inputHolder.style.zIndex = '999';
        inputHolder.style.backgroundColor = moveInputBubbleStyle.backgroundColor;
        inputHolder.style.width = '100%';
        inputHolder.style.height = 'auto';
        inputHolder.style.borderColor = moveInputBubbleStyle.borderColor;
        inputHolder.style.borderStyle = moveInputBubbleStyle.borderStyle;
        inputHolder.style.borderWidth = moveInputBubbleStyle.borderWidth;
        inputHolder.style.borderBottom = 'none';
        inputHolder.style.borderLeft = 'none';
        inputHolder.style.padding = ' 24px 0 12px 0';
        inputHolder.style.backdropFilter = 'blur(2px)';

        const close = document.createElement('div');
        close.id = "atClose";
        close.style.position = 'absolute';
        close.style.background = `#${window['inputcolorhex']}`;
        close.style.height = '6px';
        close.style.width = '20%';
        close.style.top = '4px';
        close.style.left = '50%';
        close.style.borderRadius = '4px';
        close.style.transform = 'translateX(-50%)';
        close.style.maxWidth = '100px';
        close.style.cursor = 'pointer';
        close.addEventListener('click', () =>
        {
            deleteHolder();
            moveInput.focus();
        });
        inputHolder.appendChild(close);

        list.forEach((item, index) =>
        {
            const userItem = document.createElement('div');
            userItem.id = 'holderItem';
            userItem.style.margin = '0 20px 0 20px';
            userItem.style.padding = '0 8px';
            userItem.style.whiteSpace = 'nowrap';
            userItem.style.overflow = 'hidden';
            userItem.style.height = '24px';
            userItem.style.textOverflow = 'ellipsis';
            userItem.style.color = moveInputStyle.color;
            userItem.style.textShadow = moveInputStyle.textShadow;
            userItem.style.cursor = 'pointer';
            userItem.style.borderRadius = '4px';

            if (index == selectIndex)
            {
                userItem.style.background = `#${window['inputcolorhex']}88`;
            }

            userItem.addEventListener('click', () =>
            {
                isTrigger = 0;
                item.callback();
                deleteHolder();
                moveInput.focus();
            });

            userItem.textContent = item.content;
            inputHolder.appendChild(userItem);
        });

        inputHolder.style.height = list.length * 24 + 'px';
        inputHolder.style.top = -1 * (list.length * 24 + 36) + 'px';

        moveInputBubble.appendChild(inputHolder);

    }

    /**
         * 删除提示列表
         */
    function deleteHolder()
    {
        let existingAtTipBox = document.querySelector('#inputHolder');
        if (existingAtTipBox) existingAtTipBox.remove();
    }

    return {
        moveInput,
        moveInputValue,
        selectionStart,
        addTrigger,
        triggerContent,
        deleteHolder,
        createinputHolder
    };
})();



