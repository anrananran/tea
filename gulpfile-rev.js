/**
 * 自动构建
 * 1.jade -> html
 * 2.sass scss编译 + 自动补前缀 + 属性排序 + 压缩 + 文件缓存 -> css
 * 4.imagemin 图片压缩
 * 5.sprite 雪碧图合并
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
const jade = require('gulp-jade');
const changedInPlace = require('gulp-changed-in-place');
const rev = require('gulp-rev');
const revReplace = require("gulp-rev-replace");
const revFormat = require('gulp-rev-format');
const del = require('del');
const revdel = require('gulp-rev-delete-original');
const gulpIgnore = require('gulp-ignore');
const md5 = require('blueimp-md5');

const root = './';//项目文件路径
const dev_path = {
    src : root + 'src/', //源码目录,
    dist : root + 'dist/' //构建目标目录
};

const config_path = dev_path.src + 'js/config.js';

const manifest_root = dev_path.src + 'manifest/';

gulp.task('default',[
    'jade',
    'html',
    'js-copy',
    'js-rev',
    'js-vendor',
    'js-polyfill',
    'css-vendor',
    'copyicon',
    'imagemin',
    'sprite-rev',
    'fontmin',
    'watch'
]);

//jade编译
gulp.task('jade',['sass'],function(){

    var manifest_css_sass = gulp.src(manifest_root + 'css/rev-manifest-sass.json');
    var manifest_css_vendor = gulp.src(manifest_root + 'css/rev-manifest-vendor.json');
    var manifest_js_vendor = gulp.src(manifest_root + 'js/rev-manifest-vendor.json');
    var manifest_js_polyfill = gulp.src(manifest_root + 'js/rev-manifest-polyfill.json');
    var manifest_js = gulp.src(manifest_root + 'js/rev-manifest-js.json');

    return gulp.src(dev_path.src + 'jade/*.jade')
        .pipe(changedInPlace({
            firstPass :true
        }))
        .pipe(jade())
        .pipe(prettify({
            indentSize: 4,//缩进次数，默认缩进字符为空格
            preserveNewlines : true,//保留换行符
            maxPreserveNewlines: 0, //最多允许换行的次数
            unformatted: [] //默认行内元素不换行，这里传一个空数组是为了覆盖默认值
        }))
        .pipe(rename(function (path) {
            path.basename = "jade-" + path.basename;
            return path;
        }))
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


//由于gulp-changed-in-place的功能有限，所以为inc文件新建了一个监听任务
gulp.task('jade-inc',function(){

	var manifest_css_sass = gulp.src(manifest_root + 'css/rev-manifest-sass.json');

    return gulp.src(dev_path.src + 'jade/*.jade')
        .pipe(jade())
        .pipe(prettify({
            indentSize: 4,//缩进次数，默认缩进字符为空格
            preserveNewlines : true,//保留换行符
            maxPreserveNewlines: 0, //最多允许换行的次数
            unformatted: [] //默认行内元素不换行，这里传一个空数组是为了覆盖默认值
        }))
        .pipe(rename(function (path) {
            console.log('编译:'+path);
            path.basename = "jade-" + path.basename;
            return path;
        }))
		.pipe(revReplace({
            manifest: manifest_css_sass
        }))
        .pipe(gulp.dest(dev_path.dist));
});

//复制非jade的html文件
gulp.task('html',function(){
    return gulp.src(dev_path.src + 'html/**/*')
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(rename(function (path) {
          path.basename = "html-" + path.basename;
          return path;
      }))
      .pipe(gulp.dest(dev_path.dist))
});

//sass编译
gulp.task('sass',['clean-css'],function () {

    var manifest = gulp.src(manifest_root + 'image/rev-manifest.json');

    return gulp.src(dev_path.src + 'sass/*.scss')
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

gulp.task('clean-css', function () {
    return del([
         dev_path.dist + 'static/css'
    ],{
        force : true
    });
});


//第三方库合并
gulp.task('js-copy',function(){
    
    return gulp.src([dev_path.src + 'js/**/*','!' + dev_path.src + 'js/*.js'])
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(gulp.dest(dev_path.dist + 'static/js'))
});

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

//图标字体拷贝
gulp.task('copyicon',function(){
    return gulp.src(dev_path.src + 'icon/**/*')
      .pipe(gulp.dest(dev_path.dist + 'static/icon'))
});



/**
 * 图片优化压缩
 */
 gulp.task('imagemin', function(){
    return gulp.src([dev_path.src + 'image/**/*','!'+dev_path.src + 'image/sprite/**/*'])
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



/**
 * 图片精灵[注意：当图片只有一张时不会打包该图片]
 */

 gulp.task('sprite', function () {

     var spritePath = dev_path.src + 'image/sprite';
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
               imgName: 'sprite-'+ dirName +'.png',
               cssName: 'sprite-'+ dirName +'.css',
               imgPath: '../image/sprite-'+ dirName +'.png',
               padding:5,
               cssOpts: {
                  cssSelector: function (sprite) {

                      return '.sprite-' + dirName + '-' + sprite.name;
                  }
               }
             }));

             spriteData.push(_spriteData);
         })(i);
     }

     var imgStream = [];
     var cssStream = [];
     for(var i=0;i<spriteData.length;i++){
         var _imgStream = spriteData[i].img.pipe(gulp.dest(dev_path.src + 'image/sprite'));
         var _cssStream = spriteData[i].css;
         imgStream.push(_imgStream);
         cssStream.push(_cssStream);
     }

     var mainCssSteam = merge.apply(this,cssStream)
     .pipe(concat('_sprite.css'))
     .pipe(rename(function (path) {
           path.extname = '.scss';
           return path;
      }))
     .pipe(gulp.dest(dev_path.src + 'sass/import/icon'));

     imgStream.push(mainCssSteam);

     return merge.apply(this,imgStream);
 });


  gulp.task('sprite-rev',['sprite'],function () {

     return gulp.src(dev_path.src + 'image/sprite/sprite-*.png')
     .pipe(rev())
     .pipe(revdel())
     .pipe(gulp.dest(dev_path.dist + 'static/image'))
     .pipe(rev.manifest())
     .pipe(gulp.dest(manifest_root + 'image'));
 });

/**
 * 外部字体转换
 */
gulp.task('fontmin',function(){
    return gulp.src(dev_path.src + 'font/*')
        // .pipe(fontmin({
        //     fontPath:'../font/'
        // }))
        .pipe(gulp.dest(dev_path.dist + 'static/font'));
});



/**
 * 监听文件变换
 */

gulp.task('watch', function () {

    //监控jade文件
    watch(dev_path.src + 'jade/*.jade',{
        usePolling: true,
        readDelay:10
    },function(vinyl){

        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('jade');
    });

    //监控jade-inc文件
    watch(dev_path.src + 'jade/inc/**/*.jade',{
        usePolling: true,
        readDelay:10
    },function(vinyl){

        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('jade-inc');
    });


    //监控sass文件
    watch(dev_path.src + 'sass/**/*.scss',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('jade');
    });

    //监控js文件
    watch([dev_path.src + 'js/**/*.js','!' + dev_path.src + 'js/config.js'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('js-copy');
        gulp.start('js-rev');
    });
    
    watch(dev_path.src + 'js/config.js',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('js-vendor');
        gulp.start('css-vendor');
        gulp.start('js-polyfill');
    });

    //监控图片文件
    watch([dev_path.src + 'image/**/*','!'+dev_path.src + 'image/sprite/**/*'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('imagemin');
        gulp.start('sprite-rev');
        gulp.start('jade');
    });

    //监控图标字体文件
    watch(dev_path.src + 'icon/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('copyicon');
    });


    //监控外部字体文件
    watch(dev_path.src + 'font/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('fontmin');
    });
});
