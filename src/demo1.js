new class REIFUU_Plugin_demo1 extends window.reifuuPluginCore.REIFUU_Plugin
{
    name = 'at补全';
    versions = '0.0.1';
    depend = {
        core: '0.0.1'
    };
    
    config = {
        // '主要配置': {
        //     // a: this.ctx.schema.boolean().default(true),
        //     // b: this.ctx.schema.boolean().default(false),
        //     // c: this.ctx.schema.string(),
        //     // d: this.ctx.schema.string().role('secret')
        // },
        // '次要配置': {
        //     h: this.ctx.schema.button().link('test'),
        //     e: this.ctx.schema.string(),
        //     f: this.ctx.schema.array(Number).default([1, 2, 3, 4, 5]),
        //     g: this.ctx.schema.array(String).default(["12", "34"]),
        // }

    };
    url = "https://www.baidu.com";
    feedback = "https://www.baidu.com";

    constructor()
    {
        super();

        this.plugInit(this);

        this.ctx.inputHolder.addTrigger("/@", () =>
        {
            this.ctx.inputHolder.createinputHolder(this.getNowMatchUser(this.ctx.inputHolder.triggerContent[2]));


        });


        // 插件进行初始化代码
        // 理论上插件允许多开，只要把变量定义在这个类里面就好了

        /* code */
    }

    start()
    {
        console.log("startInit");

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
    }

    getNowMatchUser(str)
    {
        let userList = [];
        const userJson = window['Objs'].mapHolder.Assets.userJson;
        const userNameList = Object.keys(userJson);
        const nowRoom = window['roomn'];

        userNameList.forEach((/**@type {string}*/item) =>
        {
            if (userJson[item][4] === nowRoom)
            {
                if (str)
                {
                    if ((item.indexOf(str.toLowerCase()) > -1))
                    {
                        userList.push({
                            "content": "@" + userJson[item][2],
                            "callback": () =>
                            {
                                this.ctx.inputHolder.moveInput.value = `${this.ctx.inputHolder.triggerContent[0]} [*${userJson[item][2]}*] ${this.ctx.inputHolder.triggerContent[3]}`;
                            }
                        });
                    }
                } else
                {
                    userList.push({
                        "content": "@" + userJson[item][2],
                        "callback": () =>
                        {
                            const textSizeMeasurer = document.getElementById('textSizeMeasurer');
                            this.ctx.inputHolder.moveInput.value = `${this.ctx.inputHolder.triggerContent[0]} [*${userJson[item][2]}*] ${this.ctx.inputHolder.triggerContent[3]}`;
                            textSizeMeasurer.innerHTML = `${this.ctx.inputHolder.triggerContent[0]} [*${userJson[item][2]}*] ${this.ctx.inputHolder.triggerContent[3]}`;

                            window['moveinputBubble'].style.width = textSizeMeasurer.clientWidth + "px";

                        }
                    });
                }
            }
        });
        return userList;
    }


};
