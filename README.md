# tea
简单、高效的前端工作流

### 目录说明
+ sass: css编译、打包、属性排序、压缩、自动处理私有前缀
+ image: 图片压缩、小图按需合并、响应式精灵图
+ html: html编译、循环、引用，使用nunjucks模板引擎
+ js: js按需打包，内含第三方框架、库、插件
+ font: 字体文件
+ manifest: 文件指纹配置文件，gulp运行时实时更新

# 开始 
1. 安装nodejs,推荐安装5.6.0版本
2. 全局安装gulp,推荐安装3.9.1版本  

    `$ npm install --global gulp@3.9.1`
3. 安装自动构建工具依赖的包,配置文件为package.json  

    `$ npm install`

4. 开始构建
    + 开发时运行gulpfile.js,文件不会重命名  

    `$ gulp`
    + 上线时运行gulpfile-rev.js,会给文件名添加文件指纹后缀，便于做非覆盖式更新  

    `$ gulp --gulpfile gulpfile-rev.js`
