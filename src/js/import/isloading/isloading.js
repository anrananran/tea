/**
* Loading plugin for jQuery
* version: v1.0.6
* @author Laurent Blanes <laurent.blanes@gmail.com>
*/
;(function(b,e,k,l){function f(a,c){this.element=a;this.options=b.extend({},g,c);this._defaults=g;this._name="isLoading";this._loader=null;this.init()}var g={position:"right",text:"","class":"glyphicon glyphicon-refresh",transparency:.5,tpl:'<span class="isloading-wrapper %wrapper%">%text%<i class="%class% glyphicon-spin"></i></span>',disableSource:!0,disableOthers:[]};f.prototype={init:function(){b(this.element).is("body")&&(this.options.position="overlay");this.show()},show:function(){var a=this,
c=a.options.tpl.replace("%wrapper%"," isloading-show  isloading-"+a.options.position),c=c.replace("%class%",a.options["class"]),c=c.replace("%text%",""!==a.options.text?a.options.text+" ":"");a._loader=b(c);b(a.element).is("input, textarea")&&!0===a.options.disableSource?b(a.element).attr("disabled","disabled"):!0===a.options.disableSource&&b(a.element).addClass("disabled");switch(a.options.position){case "inside":b(a.element).html(a._loader);break;case "overlay":var d=null;if(b(a.element).is("body"))d=
b('<div class="isloading-overlay" style="position:fixed; left:0; top:0; z-index: 10000; background: rgba(0,0,0,'+a.options.transparency+"); width: 100%; height: "+b(e).height()+'px;" />'),b("body").prepend(d),b(e).on("resize",function(){d.height(b(e).height()+"px");a._loader.css({top:b(e).height()/2-a._loader.outerHeight()/2+"px"})});else{var c=b(a.element).css("position"),h={},f=b(a.element).outerHeight()+"px",g=b(a.element).css("width"),h="relative"===c||"absolute"===c?{top:0,left:0}:b(a.element).position(),
d=b('<div class="isloading-overlay" style="position:absolute; top: '+h.top+"px; left: "+h.left+"px; z-index: 10000; background: rgba(0,0,0,"+a.options.transparency+"); width: "+g+"; height: "+f+';" />');b(a.element).prepend(d);b(e).on("resize",function(){d.height(b(a.element).outerHeight()+"px");a._loader.css({top:d.outerHeight()/2-a._loader.outerHeight()/2+"px"})})}d.html(a._loader);a._loader.css({top:d.outerHeight()/2-a._loader.outerHeight()/2+"px"});break;default:b(a.element).after(a._loader)}a.disableOthers()},
hide:function(){"overlay"===this.options.position?b(this.element).find(".isloading-overlay").first().remove():(b(this._loader).remove(),b(this.element).text(b(this.element).attr("data-isloading-label")));b(this.element).removeAttr("disabled").removeClass("disabled");this.enableOthers()},disableOthers:function(){b.each(this.options.disableOthers,function(a,c){a=b(c);a.is("button, input, textarea")?a.attr("disabled","disabled"):a.addClass("disabled")})},enableOthers:function(){b.each(this.options.disableOthers,
function(a,c){a=b(c);a.is("button, input, textarea")?a.removeAttr("disabled"):a.removeClass("disabled")})}};b.fn.isLoading=function(a){return this.each(function(){if(a&&"hide"!==a||!b.data(this,"plugin_isLoading"))b.data(this,"plugin_isLoading",new f(this,a));else{var c=b.data(this,"plugin_isLoading");"hide"===a?c.hide():c.show()}})};(function(){b.isLoading||(b.isLoading=function(a){b("body").isLoading(a)})})()})(jQuery,window,document);