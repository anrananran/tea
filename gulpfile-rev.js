/**
 * 自动构建
 * 1.jade -> html
 * 2.sass scss编译 + 自动补前缀 + 属性排序 + 压缩 + 文件缓存 -> css
 * 4.imagemin 图片压缩
 * 5.sprite 雪碧图合并
 */
var fs = require('fs');
var concat = require('gulp-concat');
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var watch = require('gulp-watch');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var csscomb = require('gulp-csscomb');
var cssmin = require('gulp-cssmin');
var fontmin = require('gulp-fontmin');
var csslint = require('gulp-csslint');
var jade = require('gulp-jade');
var changedInPlace = require('gulp-changed-in-place');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var del = require('del');
var revdel = require('gulp-rev-delete-original');

var root = './';//项目文件路径
var path = {
    src : root + 'src/', //源码目录,
    dist : root + 'dist/' //构建目标目录
};

gulp.task('default',[
    'jade',
    'html',
    'js',
    'copyicon',
    'imagemin',
    'sprite-rev',
    'fontmin',
    'watch'
]);

//jade编译
gulp.task('jade',['sass'],function(){

    var manifest = gulp.src(path.dist + 'static/css/rev-manifest.json');

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
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest(path.dist));
});


//由于gulp-changed-in-place的功能有限，所以为inc文件新建了一个监听任务
gulp.task('jade-inc',function(){

	var manifest = gulp.src(path.dist + 'static/css/rev-manifest.json');

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
		.pipe(revReplace({
            manifest: manifest
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
gulp.task('sass',['clean-css'],function () {

    var manifest = gulp.src(path.dist + 'static/image/rev-manifest.json');

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
    .pipe(revReplace({
        manifest: manifest
    }))
    .pipe(cssmin({
        advanced :true, //开启智能压缩
        keepSpecialComments:0,//移除所有注释
        restructuring:false//关闭选择器重组(此选项在classname名字过长时开启反而会增加文件体积)
    }))
    .pipe(rev())
    .pipe(gulp.dest(path.dist + 'static/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.dist + 'static/css'));
});

gulp.task('clean-css', function () {
    return del([
         path.dist + 'static/css'
    ],{
        force : true
    });
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
         var _imgStream = spriteData[i].img.pipe(gulp.dest(path.src + 'image/sprite'));
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
     .pipe(gulp.dest(path.src + 'sass/import/icon'));

     imgStream.push(mainCssSteam);

     return merge.apply(this,imgStream);
 });


  gulp.task('sprite-rev',['sprite'],function () {

     return gulp.src(path.src + 'image/sprite/sprite-*.png')
     .pipe(rev())
     .pipe(revdel())
     .pipe(gulp.dest(path.dist + 'static/image'))
     .pipe(rev.manifest())
     .pipe(gulp.dest(path.dist + 'static/image'));
 });

/**
 * 外部字体转换
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
        gulp.start('jade');
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
    watch([path.src + 'image/**/*','!'+path.src + 'image/sprite/**/*'],{
        usePolling: true,
        readDelay:1000
    },function(vinyl){
        console.log('File ' + vinyl.path + ' was changed, running tasks...');
        gulp.start('imagemin');
        gulp.start('sprite-rev');
        gulp.start('jade');
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
