#wechat-official
# Finance project

## yarn

本项目暂时使用`yarn`作为包管理工具，它的功能与`npm`大同小异，并无取代之说。可以查看这篇文件[Yarn vs npm: 你需要知道的一切](http://web.jobbole.com/88459/)了解其中的一些差异。

#### yarn 安装

macOS 安装方法

```
brew update
brew install yarn

```

windows 安装方法

- 去官网下载[安装文件](https://yarnpkg.com/zh-Hans/docs/install#windows-tab)

备选安装方法

- 通过`npm`安装, `npm install -g yarn`

#### yarn 的常用命令

所有命令的详细用法可参考[官方文档](https://yarnpkg.com/zh-Hans/docs/cli/)

- `yarn init` 初始化包的开发环境，生成一个package.json文件
- `yarn install` 安装 package.json 文件里定义的所有依赖
- `yarn add <package...>` 安装依赖包，同时更新你的 `package.json` 和 `yarn.lock`
- `yarn remove <package...>` 移除依赖包，同时更新你的 `package.json` 和 `yarn.lock`
- `yarn upgrade` 所有依赖更新为 package.json 文件里指定版本范围的最新版本，yarn.lock 文件也会重建。慎用，慎用，慎用。。。
- `yarn [package]` 单个包更新到 latest 标签指定的版本（可能跨大版本升级）
- `yarn upgrade [package@version]` 将已安装的包到指定版本
- `yarn outdated` 检查过期的依赖包

#### package.json 文件管理规范

区分`dependencies`和`devDependencies`能够比较清晰的看到生产环境和开发环境所用到的依赖包

- 生产环境需要用的依赖包采用`yarn add <package...>`来安装，添加到`dependencies`属性管理
- 开发环境需要用的依赖包采用`yarn add -D <package...>`来安装，添加到`devDependencies`属性管理

## webpack config

webpack的配置主要由以下部分组成

- `loaders.js` 所有的loader都在这个文件中配置
- `plugins.js` 所有的plugin都在这个文件中配置
- `constants.js` 一些公用的常量配置
- `webpack.config.js` 开发环境和正式环境的webpack配置都在这个文件中，通过`NODE_ENV`来区分构建

## scripts

```
yarn install # 安装依赖包
npm start # 启动本地开发服务
npm run build # 构建production文件
npm run eslint # 检查代码是否符合airbnb代码规范，同时自动补全或格式化一些简单的代码，如：缺少分号
```

## ngxin
需要安装ngxin来模拟线上环境，下载链接[nginx](https://nginx.org/en/download.html)

配置文件模板

```
server {
  listen 8081;
  server_name localhost;

  location / {
    root /path/to/dist; # production文件目录
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}

```

## 后端状态码说明

-  0  失败
-  1  成功
-  2  处理中
- -1  未开始
- 5000  业务规则校验错误
- 5001  系统内部错误
- 5002  通用查询授权失败
- 5003  不具备此操作权限
- 5004  登录超时


## 各种环境的地址
    ps:模拟微信登录加这写参数  /index/cmb?OPENID=oVYHSvqo6dzZvGPZaN2QVy1mvH8U&timestamp=1494221749457&enc=f545b4ecbee4cf3da9bb2c1939c51e4f8426d17b


开发环境  http://dev-bwechat.frontpay.cn/companyLogin   (需要配host 10.1.21.155 dev-bwechat.frontpay.cn)
测试环境  http://test-bwechat.frontpay.cn/companyLogin     (需要配host 10.1.21.156 twechat.b.frontpay.cn)
沙箱环境
灰度环境  gwechat-b.frontpay.cn
生产环境  wechat_b.frontpay.cn

## 手机验证码查询平台

开发、测试环境 http://10.1.20.242:8010/sms/list.jsp

沙箱环境 http://10.1.24.9:8010/sms/list.jsp
