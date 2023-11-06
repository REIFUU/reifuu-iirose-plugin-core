# reifuu-iirose-plugin-core - 蔷薇花园基础插件加载

## 开发目的

此项目为解决日后IIROSE前端插件过多，导致的变量名冲突；及插件依赖检测的需求；

它提供了一套全局关闭和开启插件的api

## 快速入门

在前端新建script标签，并且引用 `index.js`，而后，引入 `demo.js`即可

`index.js`： 核心插件

`demo.js`：插件demo

#### 插件API

eventEmitter.on(pluginID, 'start')

* 启动插件
* `pluginID` —— 插件id


eventEmitter.on(pluginID, 'stop')

* 停止插件
* `pluginID` —— 插件id


# REIFUU_Plugin类

### 成员属性

REIFUU_Plugin.name —— `String`

* 插件名称

REIFUU_Plugin.versions —— `String`

* 插件版本
* 备注：此项必须符合'x.x.x'或为"^x.x.x"格式

REIFUU_Plugin.depend —— `Object`

* 插件依赖

```javascript
// 格式
{

    // "被依赖插件名称": "版本"
    // 核心插件名称为core，当前版本为0.0.1
    "core": "0.0.1"
}
```

REIFUU_Plugin.status —— `'start' | 'stop' | 'reload' | 'error' | 'remove'`

* 插件状态

REIFUU_Plugin.pluginID —— `String`

* 插件ID
* 备注：此项在初始化插件后会自动生成

### 成员方法

plugInit(REIFUU_Plugin子类) : void

* 将子类传给父类进行初始化

pluginStart() : void

* 开启插件

pluginStop() : void

* 暂停插件

pluginRemove() : void

* 删除插件

pluginReload() : void

* 重载插件
