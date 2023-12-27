new class REIFUU_Plugin_demo3 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = '测试3';
    versions = '0.0.5';
    depend = {
        core: '0.0.10'
    };
    config = {
        '主要配置': {
            a: this.server.schemastery.number().default(10).max(20).min(10),
            b: this.server.schemastery.string().default('嗨嗨嗨')
        }
    };

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
};
