$(function(){

    //依赖 webuploader/cropper/layer

    var _uploader = WebUploader.Uploader;

    var html = $('html');

    if ( !_uploader.support()) {
        layer.msg( '检测到您的浏览器版本过低且没有安装flash插件，请安装flash插件或升级浏览器后重新尝试！');
        return;
    }

    _uploader.register({
        'before-send-file': 'cropImage'
    }, {

        cropImage: function( file ) {

            if(html.hasClass('no-textshadow')){
                return;
            }

            var data = file._cropData,
                image, deferred;

            file = this.request( 'get-file', file );

            deferred = WebUploader.Deferred();

            image = new WebUploader.Lib.Image();

            deferred.always(function() {
                image.destroy();
                image = null;
            });

            image.once( 'error', deferred.reject );
            image.once( 'load', function() {
                image.crop( data.x, data.y, data.width, data.height, data.scale );
            });

            image.once( 'complete', function() {
                var blob, size;
                try {
                    blob = image.getAsBlob();
                    size = file.size;
                    file.source = blob;
                    file.size = blob.size;

                    file.trigger( 'resize', blob.size, size );

                    deferred.resolve();
                } catch ( e ) {
                    deferred.resolve();
                }
            });

            file._info && image.info( file._info );
            file._meta && image.meta( file._meta );
            image.loadFromBlob( file.source );

            return deferred.promise();
        }
    });

    //文件上传
    var Uploader = function(option){

        var ACCEPT_EXTENSION = 'gif,jpg,jpeg,bmp,png';   //可接受的文件类型
        var FILE_NUM_LIMIT = 20;                         //可接受的文件总数量
        var FILE_SIZE_LIMIT = 100;                       //可接受的文件总大小 单位MB
        var FILE_SINGLE_SIZE_LIMIT = 5;                  //可接受的单文件大小 单位MB

        var uploader;                                    //上传实例
        var file_count = 0;                              //队列中文件总数
        var file_size = 0;                               //队列中文件总大小

        var is_uploaded = option.isUploaded;             //是否上传过证件

        var isSupportBase64 = ( function() {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function() {
                if( this.width != 1 || this.height != 1 ) {
                    support = false;
                }
            }
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        } )();


        var upload_btn = $(option.uploadBtn);
        var uploaded_img = $(option.uploadedImg);
        var view_index = 0;

        //初始化上传按钮
        function init(){

            uploader = WebUploader.create({
                pick: {
                    id: option.uploadBtn,
                    innerHTML: 'Upload Photo',
                    multiple :false
                },
                formData: {
                    uid: 20161123
                },
                swf: 'static/js/require/webuploader/swf/Uploader.swf',
                server: 'http://172.16.13.34:9090/fileupload.php',
                accept: {
                    title: 'Images',
                    extensions: ACCEPT_EXTENSION,
                    mimeTypes: 'image/*'
                },
                crop: true,
                disableGlobalDnd: true,
                fileNumLimit: FILE_NUM_LIMIT,
                fileSizeLimit: FILE_SIZE_LIMIT * 1024 * 1024,
                fileSingleSizeLimit: FILE_SINGLE_SIZE_LIMIT * 1024 * 1024,
                duplicate :true //允许上传重复图片
            });

            uploader.on('fileQueued',function( file ) {

                //老旧浏览器不启用裁剪功能
                if(html.hasClass('no-textshadow')){
                    uploader.upload(file);
                    return;
                }

                //获取预览图
                uploader.makeThumb( file, function( error, src ) {

                    if ( error ) {
                        layer.msg('预览失败，即将上传');
                        uploader.upload(file);
                        return;
                    }

                    if( isSupportBase64 ) {
                        create_view(file,src);
                    } else {
                        $.ajax('http://172.16.13.34:9090/preview.php', {
                            method: 'POST',
                            data: src,
                            dataType:'json'
                        }).done(function( response ) {
                            if (response.result) {
                                create_view(file,response.result);
                            }else{
                                layer.msg('预览失败，即将上传');
                                uploader.upload(file);
                            }
                        });
                    }


                }, 1, 1 );
            });

            uploader.on('error', function( _type) {
                var error_code = {
                    'Q_EXCEED_NUM_LIMIT' : '最多只能上传'+FILE_NUM_LIMIT+'个文件',
                    'Q_EXCEED_SIZE_LIMIT' : '所有文件大小不能大于'+ FILE_SIZE_LIMIT +'MB',
                    'F_EXCEED_SIZE' : '单个文件大小不能大于'+ FILE_SINGLE_SIZE_LIMIT +'MB',
                    'Q_TYPE_DENIED' : '文件类型错误，只支持'+ ACCEPT_EXTENSION +'等格式',
                    'F_DUPLICATE' : '同一图片无需重复上传'
                };

                var error_str = error_code[_type] ? error_code[_type] : '未知错误';
                layer.msg(error_str + ',请重新选择');
            });



            uploader.on('uploadError', function( _file , _reason) {
                $.isLoading('hide');
                layer.msg('上传失败，错误代码:'+ _reason + '，请重新上传');
                layer.close(view_index);
            });

            uploader.on('uploadSuccess', function( _file , _response) {
                $.isLoading('hide');
                layer.close(view_index);
                layer.msg('头像上传成功');

                is_uploaded = true;
                uploaded_check();
            });

            uploader.on('uploadStart', function( _file , _response) {
                $.isLoading({
                    text : '上传中,请稍候...'
                });

            });


            //进入page后立即检测一次
            uploaded_check();

        }

        function uploaded_check(){

            if(is_uploaded){
                upload_btn.addClass('element-invisible');
                uploaded_img.removeClass('element-invisible');
                uploader.addButton({
                    id: option.reuploadBtn,
                    innerHTML: 'Modify Picture',
                    multiple :false
                });
            }else{
                uploaded_img.addClass('element-invisible');
                upload_btn.removeClass('element-invisible');
            }
        }

        //创建预览图
        function create_view(file,src){

            var $image;


            view_index = layer.open({
                type:1,
                title:'请选择合适的区域上传',
                content:'<div class="upload-preview">'+
                            '<img id="js-preview-img" class="upload-preview-img is-loader" src="static/image/loader-spin.gif" />'+
                        '</div>',
                area:['500px','auto'],
                btn:['确定上传','取消'],
                success:function(layero,index){

                    //裁剪
                    $image = layero.find('#js-preview-img');

                    $image.attr('src',src).removeClass('is-loader');

                    $image.cropper({
                        aspectRatio: 1,
                        crop: function(e) {

                        }
                    });
                },
                yes:function(index){
                    get_crop_data($image,file);
                    uploader.upload();

                },
                end:function(){
                    $image.cropper('destroy');
                    uploader.removeFile(file,true);
                }
            });

        }


        function get_crop_data($image,file){
            var data = $image.cropper("getData");

            var scale = $image.get(0).naturalWidth / file._info.width;



            data.scale = scale;

            file._cropData = {
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height,
                scale: data.scale
            };
        }

        init();
    }

    return Uploader;
});
