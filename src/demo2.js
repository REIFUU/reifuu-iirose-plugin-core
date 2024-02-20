new class REIFUU_Plugin_demo2 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = '测试2';
    
    versions = '0.0.1';

    depend = {
        core: '0.0.1'
    };

    config = {
        a: this.ctx.schema.number().max(20).min(10),
        b: this.ctx.schema.string().default('嗨嗨嗨')
    };

    constructor()
    {
        super();
        this.plugInit(this);

        // 插件进行初始化代码
        // 理论上插件允许多开，只要把变量定义在这个类里面就好了

        /* code */
    }
};
