new class REIFUU_Plugin_demo2 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = '隐式点歌';

    versions = '0.0.1';

    depend = {
        core: '0.0.1'
    };

    config = {};

    constructor()
    {
        super();
        this.plugInit(this);

        // 插件进行初始化代码
        // 理论上插件允许多开，只要把变量定义在这个类里面就好了

        /* code */
        this.server.inputHolder.addTrigger(/~([\s\S]+)/, (value) =>
        {
            // 获取输入的歌名
            const input = value[1];
            this.server.inputHolder.createinputHolder([{
                content: '点歌',
                "callback": () =>
                {
                    this.openMusic(input);
                }
            }]);
        });
    }

    openMusic(url)
    {
        // https://music.163.com/song?id=1924062187&userid=582785446
        // https://music.163.com/playlist?id=6643543480&userid=582785446

        url = url.replace(/https:\/\/music.163.com\/(#\/)*([\s\S]+)\?/, 'https://xc.null.red:8043/meting-api/?');
        if (/^(\d+)$/.test(url)) { url = url.replace(/(\d+)/, 'https://xc.null.red:8043/meting-api/?id=$1'); }

        Urls.helper + 'lib/php/function/loadImg.php?s=' + encodeURIComponent(url);
        try
        {
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res) =>
            {
                // const data = await res.json()
                // console.log(data);
                if (!res.ok)
                {
                    throw new Error(); // Will take you to the `catch` below
                }
                return res.json();
            }).then(res =>
            {
                const typeMap = {
                    music: 0,
                    video: 1,
                };

                const data = JSON.stringify({
                    // b: `=${typeMap[type]}`,
                    n: '0',
                    c: res.pic.substr(4),
                    d: Math.round(res.time / 1000),
                    n: res.name,
                    o: res.url.substr(4),
                    r: res.auther,
                    s: res.url.substr(4),
                });

                socket.send(`&1${data}`);

                this.server.inputHolder.moveInput.value = '';

                _alert("成功点歌啦");
            }).catch(error =>
            {
                // Do something useful with the error
                console.log(error);

                _alert("点歌失败了！");
            });
        } catch (err)
        {
            console.log(err);

            _alert("点歌失败了！");
        }
    }
};
