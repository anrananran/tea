/**
 * 自动构建
 * 1.jade -> html
 * 2.sass scss编译 + 自动补前缀 + 属性排序 + 压缩 -> css
 * 4.imagemin 图片压缩
 * 5.sprite 雪碧图合并
 */


const fs = require('fs');
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


const root = './';//项目文件路径
const path = {
    src : root + 'src/', //源码目录,
    dist : root + 'dist/' //构建目标目录
};

gulp.task('default',[
    'jade',
    'html',
    'js',
    'copyicon',
    'imagemin',
    'sprite',
    'sass',
    'fontmin',
    'watch'
]);

//jade编译
gulp.task('jade',function(){

    return gulp.src(path.src + 'jade/*.jade')
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
            path.basename = "build-" + path.basename;
            return path;
        }))
        .pipe(gulp.dest(path.dist));
});


//由于gulp-changed-in-place的功能有限，所以为inc文件新建了一个监听任务
gulp.task('jade-inc',function(){

    return gulp.src(path.src + 'jade/*.jade')
        .pipe(jade())
        .pipe(prettify({
            indentSize: 4,//缩进次数，默认缩进字符为空格
            preserveNewlines : true,//保留换行符
            maxPreserveNewlines: 0, //最多允许换行的次数
            unformatted: [] //默认行内元素不换行，这里传一个空数组是为了覆盖默认值
        }))
        .pipe(rename(function (path) {
            path.basename = "build-" + path.basename;
            return path;
        }))
        .pipe(gulp.dest(path.dist));
});


//复制非jade的html文件
gulp.task('html',function(){
    return gulp.src(path.src + 'html/**/*')
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(rename(function (path) {
          path.basename = "noJade-" + path.basename;
          return path;
      }))
      .pipe(gulp.dest(path.dist))
});


//sass编译
gulp.task('sass',function () {

    return gulp.src(path.src + 'sass/*.scss')
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
    .pipe(cssmin({
        advanced :true, //开启智能压缩
        keepSpecialComments:0,//移除所有注释
        restructuring:false//关闭选择器重组(此选项在classname名字过长时开启反而会增加文件体积)
    }))
    .pipe(gulp.dest(path.dist + 'static/css'));
});


//js
gulp.task('js',function(){
    return gulp.src(path.src + 'js/**/*')
      .pipe(changedInPlace({
          firstPass :true
      }))
      .pipe(gulp.dest(path.dist + 'static/js'))
});


//图标字体拷贝
gulp.task('copyicon',function(){
    return gulp.src(path.src + 'icon/**/*')
      .pipe(gulp.dest(path.dist + 'static/icon'))
});



/**
 * 图片优化压缩
 */
 gulp.task('imagemin', function(){
    return gulp.src([path.src + 'image/**/*','!'+path.src + 'image/sprite/**/*'])
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
        .pipe(gulp.dest(path.dist + 'static/image'));
 });


/**
 * 图片精灵[注意：当图片只有一张时不会打包该图片]
 */

 gulp.task('sprite', function () {
    var spritePath = path.src + 'image/sprite';
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
        var _imgStream = spriteData[i].img.pipe(gulp.dest(path.dist + 'static/image'));
        var _cssStream = spriteData[i].css;
        imgStream.push(_imgStream);
        cssStream.push(_cssStream);
    }

    var mainCssStream = merge.apply(this,cssStream)
    .pipe(concat('_sprite.css'))
    .pipe(rename(function (path) {
          path.extname = '.scss';
          return path;
     }))
    .pipe(gulp.dest(path.src + 'sass/import/icon'));

    imgStream.push(mainCssStream);

    return merge.apply(this,imgStream);
 });

/**
 * 外部字体转换,fontmin有问题，手工转更靠谱
 */
gulp.task('fontmin',function(){
    return gulp.src(path.src + 'font/*')
        // .pipe(fontmin({
        //     fontPath:'../font/'
        // }))
        .pipe(gulp.dest(path.dist + 'static/font'));
});



/**
 * 监听文件变换
 */

gulp.task('watch', function () {

    //监控jade文件
    watch(path.src + 'jade/*.jade',{
        usePolling: true,
        readDelay:10
    },function(vinyl){

        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('jade');
    });

    //监控jade-inc文件
    watch(path.src + 'jade/inc/**/*.jade',{
        usePolling: true,
        readDelay:10
    },function(vinyl){

        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('jade-inc');
    });


    //监控sass文件
    watch(path.src + 'sass/**/*.scss',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('sass');
    });

    //监控js文件
    watch(path.src + 'js/**/*.js',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('js');
    });

    //监控图片文件
    watch(path.src + 'image/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('imagemin');
        gulp.start('sprite');
    });

    //监控图标字体文件
    watch(path.src + 'icon/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('copyicon');
    });


    //监控外部字体文件
    watch(path.src + 'font/**/*',{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('fontmin');
    });
});
