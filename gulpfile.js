/**
 * tea 普通构建
 * 
 */
const fs = require('fs');
const path = require('path');
const concat = require('gulp-concat');
const gulp = require('gulp');
const prettify = require('gulp-jsbeautifier');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const watch = require('gulp-watch');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const csscomb = require('gulp-csscomb');
const cssmin = require('gulp-cssmin');
const fontmin = require('gulp-fontmin');
const csslint = require('gulp-csslint');
const nunjucks = require('gulp-nunjucks');
const changedInPlace = require('gulp-changed-in-place');
const gulpIgnore = require('gulp-ignore');
const minify = require('gulp-minifier');
const opn = require('opn');
const sourcemaps = require('gulp-sourcemaps');

const root = './';//项目文件路径
const dev_path = {
    src : root + 'src/', //源码目录,
    dist : root + 'dist/' //构建目录
};

const config_path = dev_path.src + 'js/config.js';

gulp.task('default',[
    'html',
    'font',
    'image',
    'sprite',
    'js',
    'sass',
    'watch'
]);

//html编译
gulp.task('html',function(){
    return gulp.src([dev_path.src + 'html/*.html'])
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(nunjucks.compile())
      .pipe(prettify({
          // debug: true,
          indentSize: 4,//缩进次数，默认缩进字符为空格
          preserveNewlines : true,//保留换行符
          maxPreserveNewlines: 0, //最多允许换行的次数
          unformatted: [] //默认行内元素不换行，这里传一个空数组是为了覆盖默认值
      }))
      .pipe(prettify.reporter())
      // .pipe(rename(function (path) {
      //     path.basename = path.basename;
      //     return path;
      // }))
      // .pipe(minify({  //html压缩
      //     minify: true,
      //     collapseWhitespace: true,
      //     conservativeCollapse: true,
      //     minifyJS: true,
      //     minifyCSS: true,
      //     getKeptComment: function (content, filePath) {
      //         var m = content.match(/\/\*![\s\S]*?\*\//img);
      //         return m && m.join('\n') + '\n' || '';
      //     }
      // }))
      .pipe(gulp.dest(dev_path.dist));
});

//html中inc目录修改时触发这个任务
gulp.task('html-inc',function(){
    return gulp.src([dev_path.src + 'html/*.html'])
      .pipe(nunjucks.compile())
      .pipe(prettify({
          // debug: true,
          indentSize: 4,//缩进次数，默认缩进字符为空格
          preserveNewlines : true,//保留换行符
          maxPreserveNewlines: 1, //最多允许换行的次数
          unformatted: [] //默认行内元素不换行，这里传一个空数组是为了覆盖默认值
      }))
      .pipe(prettify.reporter())
      // .pipe(rename(function (path) {
      //     path.basename = path.basename;
      //     return path;
      // }))
      .pipe(gulp.dest(dev_path.dist));
});

//sass编译
gulp.task('sass',function () {

    return gulp.src(dev_path.src + 'sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        //outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 5 versions','Firefox >= 20','iOS >= 7','ie 8-11'],
        remove: false
    }))
    // .pipe(csscomb()) //属性排序
    // .pipe(cssmin({
    //     advanced :true, //开启智能压缩
    //     keepSpecialComments:0,//移除所有注释
    //     restructuring:false//关闭选择器重组(此选项在classname名字过长时开启反而会增加文件体积)
    // }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dev_path.dist + 'static/css'));
});

//js编译打包
gulp.task('js',['js-copy','js-vendor','js-polyfill','css-vendor']);

//业务js文件编译，目前没有对其做任何操作
gulp.task('js-copy',function(){
    
    return gulp.src(dev_path.src + 'js/**/*')
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
});


//第三方插件、库、框架打包
gulp.task('js-vendor',function(){
    
    delete require.cache[require.resolve(config_path)];
    var MERGE_CONFIG = require(config_path);
    
    var JS_FILE = [];
    
    for(var i = 0;i < MERGE_CONFIG.JS_FILE.length; i++){
        var file = path.join(dev_path.src ,  MERGE_CONFIG.ROOT_PATH , MERGE_CONFIG.JS_FILE[i]);
        console.log('正在合并:' + file);
        JS_FILE.push(file);
    }
    
    return gulp.src(JS_FILE)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
});

//ES5兼容补丁打包
gulp.task('js-polyfill',function(){
    
    delete require.cache[require.resolve(config_path)];
    var MERGE_CONFIG = require(config_path);
    
    var POLYFILL_FILE = [];
    
    for(var i = 0;i < MERGE_CONFIG.POLYFILL_FILE.length; i++){
        var file = path.join(dev_path.src ,  MERGE_CONFIG.ROOT_PATH , MERGE_CONFIG.POLYFILL_FILE[i]);
        console.log('正在合并:' + file);
        POLYFILL_FILE.push(file);
    }
    
    return gulp.src(POLYFILL_FILE)
      .pipe(concat('polyfill.js'))
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
});

//第三方插件、库、框架依赖的样式文件打包
gulp.task('css-vendor',function(){
    
    delete require.cache[require.resolve(config_path)];
    var MERGE_CONFIG = require(config_path);
    
    var CSS_FILE = [];
    
    for(var i = 0;i < MERGE_CONFIG.CSS_FILE.length; i++){
        var file = path.join(dev_path.src ,  MERGE_CONFIG.ROOT_PATH , MERGE_CONFIG.CSS_FILE[i]);
        console.log('正在合并:' + file);
        CSS_FILE.push(file);
    }
    
    return gulp.src(CSS_FILE)
      .pipe(concat('vendor.css'))
      .pipe(cssmin({
          advanced :true, //开启智能压缩
          keepSpecialComments:0,//移除所有注释
          restructuring:false//关闭选择器重组(此选项在classname名字过长时开启反而会增加文件体积)
      }))
      .pipe(gulp.dest(dev_path.dist + 'static/css'))
});

//图片优化与压缩
 gulp.task('image', function(){
    return gulp.src([dev_path.src + 'image/**/*','!'+dev_path.src + 'image/ico/**/*'])
        .pipe(changedInPlace({
            firstPass:true
        }))
        .pipe(imagemin({
            optimizationLevel:4,
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dev_path.dist + 'static/image'));
 });

//精灵图按目录打包
 gulp.task('sprite', function () {
    var spritePath = dev_path.src + 'image/ico';
    var pa = fs.readdirSync(spritePath);
    var dirs = [];
    pa.forEach(function(ele,index){
        var info = fs.statSync(spritePath+"/"+ele);
        if(info.isDirectory()){
            dirs.push(ele);
        }
    });

    var spriteData = [];
    for(var i=0;i<dirs.length;i++){
        (function(i){
            var dirName = dirs[i];
            var _spriteData = gulp.src(spritePath +"/"+ dirName + '/*.png').pipe(spritesmith({
              imgName: 'ico-'+ dirName +'.png',
              cssName: '_' + dirName +'.css',
              imgPath: '../image/ico-'+ dirName +'.png',
              padding:5,
              cssTemplate: 'css.handlebars',
              cssOpts: {
                  dirName : dirName   //这里自定义的参数可以在handlebars中通过options.dirName调用
              }
            }));

            spriteData.push(_spriteData);
        })(i);
    }

    var imgStream = [];
    var cssStream = [];
    for(var i=0;i<spriteData.length;i++){
        var _imgStream = spriteData[i].img.pipe(gulp.dest(dev_path.dist + 'static/image'));
        var _cssStream = spriteData[i].css.pipe(rename(function (path) {
                path.extname = '.scss';
                return path;
            }))
            .pipe(gulp.dest(dev_path.src + 'sass/import/icon'));

        imgStream.push(_imgStream);
        cssStream.push(_cssStream);
    }

    imgStream.push(cssStream);

    return merge.apply(this,imgStream);
 });

//拷贝字体文件
gulp.task('font',function(){
    return gulp.src(dev_path.src + 'font/*')
        .pipe(gulp.dest(dev_path.dist + 'static/font'));
});


//监听文件变换
gulp.task('watch', function () {

    //监控html文件
    watch(dev_path.src + 'html/*.html',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        if(vinyl.event == 'add'){
          var pageurl = path.join('http://192.168.1.101/',path.relative('E:\\',vinyl.path).replace('src\\html\\','dist\\'));
          opn(pageurl);
        }
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('html');
    });

    //监控html文件中的inc目录
    watch([dev_path.src + 'html/**/*.html','!' + dev_path.src + 'html/*.html'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('html-inc');
    });

    //监控sass文件
    watch(dev_path.src + 'sass/**/*.scss',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('sass');
    });

    //监控js文件
    watch([dev_path.src + 'js/**/*'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('js');
    });

    //监控图片文件
    watch(dev_path.src + 'image/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('image');
        gulp.start('sprite');
    });

    //监控字体文件
    watch(dev_path.src + 'font/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('font');
    });
});
