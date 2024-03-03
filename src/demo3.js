new class REIFUU_Plugin_demo3 extends window.reifuuPluginCore.REIFUU_Plugin {
    name = '测试3';
    versions = '0.0.5';
    depend = {
        core: '0.0.1'
    };
    config = {
        "main": {
            a: this.ctx.schema.number(),
            b: this.ctx.schema.number()
        }
    };

    constructor() {
        super();
        this.plugInit(this);

        // 插件进行初始化代码
        // 理论上插件允许多开，只要把变量定义在这个类里面就好了

        /* code */
    }

    start() {
        // 插件主代码
        /* code */
    }

    stop() {
        // 插件消除影响代码
        /* code */
    }
};
