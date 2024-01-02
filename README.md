# Plugin-core

# 简介

这是一个含有插件依赖检测，快速创建插件交互界面以及配置界面等功能的蔷薇插件开发工具

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled.png)

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%201.png)

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%202.png)

# 插件模板

```jsx
new class pluginDemoName extends reifuuPluginCore.REIFUU_Plugin {
	// 插件名称
	name = '插件名称';

	// 插件版本
	versions = '0.0.1';

	// 插件依赖项
	depend = {
		core: '0.0.1'
	};

	// 插件配置项
	config = {
		a: this.server.schema.number().max(20).min(10),
		b: this.server.schema.string().default('嗨嗨嗨')
	};

	// 插件初始化函数
	constructor() {
		super();
		this.plugInit(this);

		/* code */
		// 插件自身进行初始化代码
		// 理论上插件允许多开，只要把变量定义在这个类里面就好了
	}

	// 插件开始执行函数
	start() { }

	// 插件停止时清除影响函数
	stop() { }
};
```

# 插件属性

### REIFUU_Plugin.name

作用：插件名称

格式：”string”

是否必填：必填

### REIFUU_Plugin.versions

作用：插件版本

格式： “x.x.x”

是否必填：必填

### REIFUU_Plugin.depend

作用：插件依赖列表

格式：{object} —— key为依赖插件的name属性，value为依赖插件的版本，版本支持”^0.0.1”，”~0.0.1”这样的格式

是否必填：否

### REIFUU_Plugin.config

作用：配置构型 —— 通过配置此项，在插件配置页面生成对应的数据组件

格式：详见“配置构型”项

是否必填：是

### REIFUU_Plugin.value

作用：配置构型的返回值

是否必填：否，且在插件类中使用this.value即可调用

### REIFUU_Plugin.constructor()

作用：插件初始化

格式：函数

是否必填：是

### REIFUU_Plugin.start()

作用：插件点击启动按钮后运行的函数，用于消除插件带来的影响

格式：函数

是否必填：否

### REIFUU_Plugin.stop()

作用：插件点击停止按钮后运行的函数

格式：函数

是否必填：否

# 插件初始化

在插件子类的签名函数constructor中，必须按照如下格式编写：

```jsx
constructor 
{
    super();
    this.plugInit(this);// 插件进行顶层初始化，必写

    /* code */
};
```

this.plugInit(this)是使父类将此子类初始化的方法，请务必编写，否则无法生成配置页面等信息，并发生不可预见的错误

# 配置构型

在插件子类的**config**属性，我们可以得知它是用于生成插件的配置页面的关键参数，但是我们该如何使用？

我们可以创建如下插件类，它会在插件配置页面生成一个数字类型输入框，并且在插件start的时候调用它

```jsx
new class pluginDemoName extends reifuuPluginCore.REIFUU_Plugin {
	// 插件名称
	name = '测试插件';

	// 插件版本
	versions = '0.0.1';

	// 插件依赖项
	depend = {
		core: '0.0.1'
	};

	// 插件配置项，无层级
	config = {
		a: this.server.schema.number()
	};

	// 插件配置项：有层级(层级最多为1层)
	config = {
		"main": {
			a: this.server.schema.number()
		}
	};

	// 插件初始化函数
	constructor() {
		super();
		this.plugInit(this);// 使插件初始化，必写）

		// 插件进行初始化代码
		// 理论上插件允许多开，只要把变量定义在这个类里面就好了

		/* code */
	}

	// 插件开始执行函数
	start() { console.log(this.value.a); }

	// 插件停止时清除影响函数
	stop() { }
};
```

运行结果：

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%203.png)

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%204.png)

## 配置构型：层级

有时我们的配置项会有很多，我们希望将它们分成几部分，我们如何做到？

这里展示一个demo，它可以实现为一些构型添加一个标题

```jsx
config = {
	"main": {
		a: this.server.schema.number()
	},
	"other": {
		b: this.server.schema.number()
	}
};
```

执行结果：

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%205.png)

```jsx
config = {
	"main": {
		a: this.server.schema.number(),
		b: this.server.schema.number()
	}
};
```

执行结果：

![Untitled](Plugin-core%2037fbf83d97834172954b1088918caa05/Untitled%206.png)

## 配置构型：数字

```jsx

生成一般数字构型：this.server.schema.number();
设置最大值为10：this.server.schema.number().max(10);
设置最小值为0：this.server.schema.number().min(10);
```

## 配置构型：字符串

```jsx

生成一般字符串构型：this.server.schema.string();
验证格式的字符串构型：this.server.schema.string().pattern(/^custom$/i);
设置为密码型字符串构型：this.server.schema.string().role("secret");
```

## 配置构型：true/false

```jsx

生成一般布朗构型：this.server.schema.boolean();
```

## 配置构型：按钮

```jsx
生成一般按钮构型：this.server.schema.button();
使按钮型构型被点击时触发当前插件类的test函数：this.server.schema.button().link("test");
```

## 配置构型：数组

```jsx
生成一般字符串数组构型：this.server.schema.array(String);
生成一般数字数组构型：this.server.schema.array(Number);
生成一般布朗数组构型：this.server.schema.array(boolean);
```

## 配置构型：通用配置函数

```jsx
// 设置构型默认值
this.server.schema.string().default("哼哼aaa");
this.server.schema.number().default(123);
this.server.schema.boolean().default(true);

// 设置描述
this.server.schema.string().description("这里需要填写字符串");
this.server.schema.number().description("这里需要填写数字");
this.server.schema.boolean().description("这里需要个布朗");
```

## 配置构型：组合使用

同一个类型的构型下的很多配置函数可以一起使用，甚至与通用配置函数也一起使用！比如：

```jsx
this.server.schema.number().min(1).max(10).default(3).description("这里需要填写1~10的数字，你不写的时候是3");
```

## 配置构型：获取配置值

在config项中配置的构型，可以最后生成一个页面，那么我们如何获取用户所配置的值呢？

其实config生成配置页面后，我们会自动为插件子类创建一个value变量，它是config项的映像

```jsx
// 举个例子，如config为这样：
config = {
	a: this.server.schema.number(),
	b: this.server.schema.number()
};

// 生成的value为这样：
value = {
	a: 用户在输入框1输入的数字
				b: 用户在输入框2输入的数字
};

// 在生成value时，config会忽视层级，如下格式的config，生成的value也依旧如上所述
config = {
	"main": {
		a: this.server.schema.number()
	},
	"other": {
		b: this.server.schema.number()
	}
};
// 或者这个也一样
config = {
	"main": {
		a: this.server.schema.number(),
		b: this.server.schema.number()
	}
};
```

# 插件主类内容

## 主类成员变量

### REIFUU_Plugin.status —— `'start' | 'stop' | 'reload' | 'error' | 'remove'`

插件状态

### REIFUU_Plugin.pluginID —— `String`

插件ID
备注：此项在初始化插件后会自动生成

## 主类成员方法

### plugInit(REIFUU_Plugin子类) : void

将子类传给父类进行初始化

## pluginStart() : void

开启子插件

## pluginStop() : void

暂停子插件

## pluginRemove() : void

删除子插件

## pluginReload() : void

重载子插件

# 其他API

## 插件API

### eventEmitter.on(pluginID, 'start')

启动插件

**pluginID** —— 插件id

### eventEmitter.on(pluginID, 'stop')

停止插件

**pluginID** —— 插件id

# 更多正在开发

1. 新增创建自定义界面方法
2. 新增选择选项方法
3. 新增新建类方法
4. 新增插件保存配置按钮，对应pluginConfigSave函数