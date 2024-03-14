
/**
 * 定义循环尝试运行
 * 直到运行回调时不再抛出错误
 * @param {function (number, number): void} callback 第一个参数为尝试运行的次数 第二个参数为尝试运行的时间
 * @param {number} interval 执行间隔
 * @param {function (): void} canDo 可以执行时执行此函数
 * @param {boolean} [immediate]
 */
export function intervalTry(callback, interval, canDo, immediate = false)
{
	let countOfCall = 0;
	let startTime = Date.now();
	let intervalId = null;
	let func = (() =>
	{
		countOfCall++;
		try
		{
			callback(countOfCall, Date.now() - startTime);
			if (intervalId != null){
				clearInterval(intervalId);
			}
				
			canDo();
			return;
		}
		catch (err)
		{ }
	});
	intervalId = setInterval(func, interval);
	if (immediate)
		func();
}

/**
 * 获取内层message.html
 * @param {document} 内层内容
 */
export const getInsideDoc = () => {
    if (location.host != "iirose.com")
        return;

    let doc = null;
    let win = null;

    if (location.pathname == "/")
    {
        doc = document;
        win = window;
    }
    else if (location.pathname == "/messages.html")
    {
        doc = parent.document;
        win = parent.window;
    }
    else return;

	const inside = doc.getElementById('mainFrame');
    // const insideDoc = (inside.contentDocument)? inside.contentDocument: inside.contentWindow.document;
    const insideDoc = inside.contentDocument;

	return insideDoc
}