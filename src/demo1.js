new class REIFUU_Plugin_demo1 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = '测试';
    versions = '0.0.1';
    depend = {
        core: '0.0.1'
    };
    config = {
        '主要配置': {
            a: this.server.schema.boolean().default(true).description("tesuhckchkcjbhcjbcjbhsjhsjgsfjfsj"),
            b: this.server.schema.boolean().default(false),
            c: this.server.schema.string(),
            d: this.server.schema.string().role('secret'),
            e: this.server.schema.number().default(10)
        },
        '次要配置': {
            e: this.server.schema.string().pattern(/^custom$/i),
            f: this.server.schema.array(Number).default([1, 2, 3, 4, 5, 65, 7]),
            g: this.server.schema.array(String).default(["a", "b", "c", "d"]),
            h: this.server.schema.button().link('test')
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

        // setInterval(() =>
        // {
        //     console.log("start", this.config);
        // }, 1000);
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
};
