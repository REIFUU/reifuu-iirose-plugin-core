import { getInsideDoc, intervalTry } from "../lib/tools";

intervalTry(() =>
{
    window.socket._onmessage.bind;
}, 10, () =>
{
    console.log('Reifuu插件核心管理器正在加载....')
    const insideDoc = getInsideDoc();

    const jsUrl = 'http://127.0.0.1:8080/main.js';
    const jsDoc = document.createElement('script');
    jsDoc.src = jsUrl;

    insideDoc.head.append(jsDoc);
    console.log('Reifuu插件核心管理器加载成功');
});
