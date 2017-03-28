
$(function(){

    window.$html =  $('html');
    window.$body = $('body');
    window.$window = $(window);
    
    //环境嗅探
    (function(){
        var parser = new UAParser();
        var browser = parser.getBrowser();
        var engine = parser.getEngine();
        var os = parser.getOS();
        var device = parser.getDevice();
        
        function fill(strs){
            return strs.replace(/[\s\.]/gi,'-').toLowerCase();
        }
        
        $html.addClass(fill(browser.name))
             .addClass(fill(browser.name) + '-' + fill(browser.major))
             .addClass(fill(engine.name) + '-' + fill(engine.version))
             .addClass(fill(os.name) + '-' + fill(os.version));
             
        if(device.model && device.type){
            $html.addClass(fill(device.model) + '-' + fill(device.type));
        }
        
    })();

    //sticky footer
    (function(){
        var $header = $('#js-page-header');
        var $inner = $('#js-page-inner');
        var $footer = $('#js-page-footer');

        function stickyFooter(){
            var height = $window.height() - $header.outerHeight() - $footer.outerHeight();
            $inner.css({
                minHeight: height < 0 ? 0 : height
            });
        }

        stickyFooter();

        $window.on('resize',function(){
            stickyFooter();
        });
        
    })();


    //修复某些移动设备bug
    if($html.hasClass('touch')){
        $body.on('touchstart', function () {});
        $body.children().click(function () {});
    }

    //使ie9及以下版本支持placeholder属性
    var $placeholders = $('[placeholder]');
    if($placeholders.size() && $html.hasClass('no-textshadow')){
        $placeholders.placeholder({
            customClass : 'placeholder'
        });
    }

    //IE6-7升级提示
    if($html.hasClass('no-hashchange')){
        var update = '<div style="position:fixed;left:0;top:0;right:0;bottom:0;z-index:20170101;background:#e5e5e5;text-align:center;">'+
                        '<div style="margin-top:200px;">(。・`ω´・) 你的浏览器实在太太太太太太旧了，<a target="_blank" style="color:#005F3C;font-weight:bold;" href="http://browsehappy.com/?locale=en">立即升级</a></div>'+
                     '</div>';
        $body.html(update);
    }

    //下拉框
    $('.com-select').each(function(){
        var that = $(this);
        var hasFilter = that.data('filter');
        var placeholder = that.attr('placeholder');
        var theme = that.attr('data-select-theme') || 'is-theme-default';
        
        var minisearch = (hasFilter == 'false') ? 10 : Infinity;
        
        that.select2({
            minimumResultsForSearch: minisearch,
            placeholder : placeholder,
            containerCssClass : theme,
            dropdownCssClass : theme
        });
    });
    
    //ajax加载效果
    $.isLoading({text:'Loading...'});
    
    setTimeout(function(){
        $.isLoading('hide');
    },500);
    

    //debug
    // $(document).on('keyup',function(event){
    //     var keycode = event.keyCode;
    //     if(keycode == 113){
    //         $('#page').toggleClass('is-debug');
    //     }
    // });
    
    
});
