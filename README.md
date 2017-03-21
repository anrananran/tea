# tea
项目快速构建的脚手架，css是通过sass编译生成，html是通过jade编译生成

+ sass编译打包
+ 图片压缩打包
+ jade编译html
+ js打包
+ 文件指纹

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
