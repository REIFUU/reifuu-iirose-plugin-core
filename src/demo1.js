new class REIFUU_Plugin_demo1 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = '测试';
    versions = '0.0.1';
    depend = {
        core: '0.0.1'
    };
    config = {
        '主要配置': {
            // a: this.ctx.schema.boolean().default(true),
            // b: this.ctx.schema.boolean().default(false),
            // c: this.ctx.schema.string(),
            // d: this.ctx.schema.string().role('secret')
        },
        '次要配置': {
            e: this.ctx.schema.string(),
            f: this.ctx.schema.array(Number).default([1, 2, 3, 4, 5]),
            g: this.ctx.schema.array(String).default(["12", "34"]),
            h: this.ctx.schema.button().link('test')
        }
    };
    url = "https://www.baidu.com";
    feedback = "https://www.baidu.com";

    constructor()
    {
        super();

        this.plugInit(this);

        // 插件进行初始化代码
        // 理论上插件允许多开，只要把变量定义在这个类里面就好了

        /* code */
    }

    start()
    {
        // 插件主代码
        /* code */

    }

    stop()
    {
        // 插件消除影响代码
        /* code */
    }

    test()
    {
        console.log(this.value);
        console.log('button被点击');
    }

    // 想其他插件开放的服务
    server() {
    }

    // 服务名称
    serverName = ''
};
