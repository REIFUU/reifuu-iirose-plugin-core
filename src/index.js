import { intervalTry } from "../lib/tools";

intervalTry(() =>
{
    window.socket._onmessage.bind;
}, 10, () =>
{
    console.log('Reifuu插件核心管理器正在加载....')
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
    const insideDoc = inside.contentDocument
    
    const jsUrl = 'http://127.0.0.1:8080/main.js';
    const jsDoc = document.createElement('script');
    jsDoc.src = jsUrl;
    
    insideDoc.head.append(jsDoc);
    console.log('Reifuu插件核心管理器加载成功')
});
