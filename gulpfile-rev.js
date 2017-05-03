/**
 * tea 带指纹的构建
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
const rev = require('gulp-rev');
const revReplace = require("gulp-rev-replace");
const revFormat = require('gulp-rev-format');
const del = require('del');
const revdel = require('gulp-rev-delete-original');
const sequence = require('gulp-sequence');

const root = './';//项目文件路径
const dev_path = {
    src : root + 'src/', //源码目录,
    dist : root + 'dist/' //构建目录
};

const config_path = dev_path.src + 'js/config.js';

const manifest_root = dev_path.src + 'manifest/';

//初始任务
gulp.task('default',sequence(
    'build',
    'watch'
  )
);

//清理dist目录
gulp.task('clean-dist', function () {
    return del([
         dev_path.dist
    ],{
        force : true
    });
});

//任务列表
gulp.task('build',function(callback){
    sequence(
      'clean-dist', 
      ['js-copy','js-rev','js-vendor','js-polyfill','css-vendor','image','font'],
      'sprite',
      'sprite-rev',
      'sass',
      'html'
    )(callback);
});
    
//html编译
gulp.task('html',function(){

    var manifest_css_sass = gulp.src(manifest_root + 'css/rev-manifest-sass.json');
    var manifest_css_vendor = gulp.src(manifest_root + 'css/rev-manifest-vendor.json');
    var manifest_js_vendor = gulp.src(manifest_root + 'js/rev-manifest-vendor.json');
    var manifest_js_polyfill = gulp.src(manifest_root + 'js/rev-manifest-polyfill.json');
    var manifest_js = gulp.src(manifest_root + 'js/rev-manifest-js.json');

    return gulp.src(dev_path.src + 'html/*.html')
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
        //     path.basename =  path.basename;
        //     return path;
        // }))
        .pipe(revReplace({
            manifest: manifest_css_sass
        }))
        .pipe(revReplace({
            manifest: manifest_css_vendor
        }))
        .pipe(revReplace({
            manifest: manifest_js_vendor
        }))
        .pipe(revReplace({
            manifest: manifest_js_polyfill
        }))
        .pipe(revReplace({
            manifest: manifest_js
        }))
        .pipe(gulp.dest(dev_path.dist));
});

//sass编译
gulp.task('sass',function () {

    var manifest = gulp.src(manifest_root + 'image/rev-manifest.json');

    return gulp.src(dev_path.src + 'sass/*.scss')
    .pipe(changedInPlace({
        firstPass :true
    }))
    .pipe(sass({
        //outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 5 versions','Firefox >= 20','iOS >= 7','ie 8-11'],
        remove: false
    }))
    .pipe(csscomb()) //属性排序
    //.pipe(csslint()) //代码检查
    //.pipe(csslint.reporter())
    .pipe(revReplace({
        manifest: manifest
    }))
    .pipe(cssmin({
        advanced :true, //开启智能压缩
        keepSpecialComments:0,//移除所有注释
        restructuring:false//关闭选择器重组(此选项在classname名字过长时开启反而会增加文件体积)
    }))
    .pipe(rev())
    .pipe(gulp.dest(dev_path.dist + 'static/css'))
    .pipe(rev.manifest('rev-manifest-sass.json'))
    .pipe(gulp.dest(manifest_root + 'css'));
});

//拷贝第三方插件、库、框架的目录
gulp.task('js-copy',function(){
    
    return gulp.src([dev_path.src + 'js/**/*','!' + dev_path.src + 'js/*.js'])
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
});


//给业务js添加文件指纹
gulp.task('js-rev',function(){
    
    return gulp.src(dev_path.src + 'js/*.js')
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(rev())
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
      .pipe(rev.manifest('rev-manifest-js.json'))
      .pipe(gulp.dest(manifest_root + 'js'));
});

//第三方插件、库、框架的目录打包
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
      .pipe(rev())
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
      .pipe(rev.manifest('rev-manifest-vendor.json'))
      .pipe(gulp.dest(manifest_root + 'js'));
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
      .pipe(rev())
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
      .pipe(rev.manifest('rev-manifest-polyfill.json'))
      .pipe(gulp.dest(manifest_root + 'js'));
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
      .pipe(rev())
      .pipe(gulp.dest(dev_path.dist + 'static/css'))
      .pipe(rev.manifest('rev-manifest-vendor.json'))
      .pipe(gulp.dest(manifest_root + 'css'));
});



//图片优化压缩
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



//精灵图
 gulp.task('sprite',function () {

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
               cssName: '_'+ dirName +'.css',
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
         var _imgStream = spriteData[i].img.pipe(gulp.dest(dev_path.src + 'image/ico'));
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

//精灵图指纹
gulp.task('sprite-rev',function () {

   return gulp.src(dev_path.src + 'image/ico/ico-*.png')
   .pipe(rev())
   .pipe(revdel())
   .pipe(gulp.dest(dev_path.dist + 'static/image'))
   .pipe(rev.manifest())
   .pipe(gulp.dest(manifest_root + 'image'));
});

//拷贝字体文件
gulp.task('font',function(){
    return gulp.src(dev_path.src + 'font/*')
        .pipe(gulp.dest(dev_path.dist + 'static/font'));
});

//监听文件变换
gulp.task('watch', function () {

    //监控html文件
    watch(dev_path.src + 'html/**/*.html',{
        usePolling: true,
        readDelay:10
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('build');
    });


    //监控sass文件
    watch([dev_path.src + 'sass/**/*.scss','!' + dev_path.src + 'sass/import/icon/*.scss'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('build');
    });

    //监控js文件
    watch([dev_path.src + 'js/**/*'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('build');
    });

    //监控图片文件
    watch([dev_path.src + 'image/**/*','!'+dev_path.src + 'image/ico/**/*'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('image');
    });

    //监控ico文件
    watch(dev_path.src + 'image/ico/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('build');
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
