(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{if(typeof exports==="object"){a(require("jquery"))}else{a(jQuery)}}}(function(f,c){if(!("indexOf" in Array.prototype)){Array.prototype.indexOf=function(l,k){if(k===c){k=0}if(k<0){k+=this.length}if(k<0){k=0}for(var m=this.length;k<m;k++){if(k in this&&this[k]===l){return k}}return -1}}function e(m){var l=f(m);var k=l.add(l.parents());var n=false;k.each(function(){if(f(this).css("position")==="fixed"){n=true;return false}});return n}function h(){var r,l,q,m,k,o,n,p;l=(new Date).toString();q=((n=l.split("(")[1])!=null?n.slice(0,-1):void 0)||l.split(" ");if(q instanceof Array){o=[];for(m=0,k=q.length;m<k;m++){p=q[m];if(r=(n=p.match(/\b[A-Z]+\b/))!=null?n[0]:void 0){o.push(r)}}q=o.pop()}return q}function i(){return new Date(Date.UTC.apply(Date,arguments))}function d(){var k=new Date();return i(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),k.getUTCHours(),k.getUTCMinutes(),k.getUTCSeconds(),0)}var j=function(m,l){var o=this;this.element=f(m);this.container=l.container||"body";this.language=l.language||this.element.data("date-language")||"en";this.language=this.language in a?this.language:this.language.split("-")[0];this.language=this.language in a?this.language:"en";this.isRTL=a[this.language].rtl||false;this.formatType=l.formatType||this.element.data("format-type")||"standard";this.format=g.parseFormat(l.format||this.element.data("date-format")||a[this.language].format||g.getDefaultFormat(this.formatType,"input"),this.formatType);this.isInline=false;this.isVisible=false;this.isInput=this.element.is("input");this.fontAwesome=l.fontAwesome||this.element.data("font-awesome")||false;this.bootcssVer=l.bootcssVer||(this.isInput?(this.element.is(".form-control")?3:2):(this.bootcssVer=this.element.is(".input-group")?3:2));this.component=this.element.is(".date")?(this.bootcssVer==3?this.element.find(".input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o").parent():this.element.find(".add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o").parent()):false;this.componentReset=this.element.is(".date")?(this.bootcssVer==3?this.element.find(".input-group-addon .glyphicon-remove, .input-group-addon .fa-times").parent():this.element.find(".add-on .icon-remove, .add-on .fa-times").parent()):false;this.hasInput=this.component&&this.element.find("input").length;if(this.component&&this.component.length===0){this.component=false}this.linkField=l.linkField||this.element.data("link-field")||false;this.linkFormat=g.parseFormat(l.linkFormat||this.element.data("link-format")||g.getDefaultFormat(this.formatType,"link"),this.formatType);this.minuteStep=l.minuteStep||this.element.data("minute-step")||5;this.pickerPosition=l.pickerPosition||this.element.data("picker-position")||"bottom-right";this.showMeridian=l.showMeridian||this.element.data("show-meridian")||false;this.initialDate=l.initialDate||new Date();this.zIndex=l.zIndex||this.element.data("z-index")||c;this.title=typeof l.title==="undefined"?false:l.title;this.timezone=l.timezone||h();this.icons={leftArrow:this.fontAwesome?"fa-arrow-left":(this.bootcssVer===3?"glyphicon-arrow-left":"icon-arrow-left"),rightArrow:this.fontAwesome?"fa-arrow-right":(this.bootcssVer===3?"glyphicon-arrow-right":"icon-arrow-right")};this.icontype=this.fontAwesome?"fa":"glyphicon";this._attachEvents();this.clickedOutside=function(p){if(f(p.target).closest(".datetimepicker").length===0){o.hide()}};this.formatViewType="datetime";if("formatViewType" in l){this.formatViewType=l.formatViewType}else{if("formatViewType" in this.element.data()){this.formatViewType=this.element.data("formatViewType")}}this.minView=0;if("minView" in l){this.minView=l.minView}else{if("minView" in this.element.data()){this.minView=this.element.data("min-view")}}this.minView=g.convertViewMode(this.minView);this.maxView=g.modes.length-1;if("maxView" in l){this.maxView=l.maxView}else{if("maxView" in this.element.data()){this.maxView=this.element.data("max-view")}}this.maxView=g.convertViewMode(this.maxView);this.wheelViewModeNavigation=false;if("wheelViewModeNavigation" in l){this.wheelViewModeNavigation=l.wheelViewModeNavigation}else{if("wheelViewModeNavigation" in this.element.data()){this.wheelViewModeNavigation=this.element.data("view-mode-wheel-navigation")}}this.wheelViewModeNavigationInverseDirection=false;if("wheelViewModeNavigationInverseDirection" in l){this.wheelViewModeNavigationInverseDirection=l.wheelViewModeNavigationInverseDirection}else{if("wheelViewModeNavigationInverseDirection" in this.element.data()){this.wheelViewModeNavigationInverseDirection=this.element.data("view-mode-wheel-navigation-inverse-dir")}}this.wheelViewModeNavigationDelay=100;if("wheelViewModeNavigationDelay" in l){this.wheelViewModeNavigationDelay=l.wheelViewModeNavigationDelay}else{if("wheelViewModeNavigationDelay" in this.element.data()){this.wheelViewModeNavigationDelay=this.element.data("view-mode-wheel-navigation-delay")}}this.startViewMode=2;if("startView" in l){this.startViewMode=l.startView}else{if("startView" in this.element.data()){this.startViewMode=this.element.data("start-view")}}this.startViewMode=g.convertViewMode(this.startViewMode);this.viewMode=this.startViewMode;this.viewSelect=this.minView;if("viewSelect" in l){this.viewSelect=l.viewSelect}else{if("viewSelect" in this.element.data()){this.viewSelect=this.element.data("view-select")}}this.viewSelect=g.convertViewMode(this.viewSelect);this.forceParse=true;if("forceParse" in l){this.forceParse=l.forceParse}else{if("dateForceParse" in this.element.data()){this.forceParse=this.element.data("date-force-parse")}}var n=this.bootcssVer===3?g.templateV3:g.template;while(n.indexOf("{iconType}")!==-1){n=n.replace("{iconType}",this.icontype)}while(n.indexOf("{leftArrow}")!==-1){n=n.replace("{leftArrow}",this.icons.leftArrow)}while(n.indexOf("{rightArrow}")!==-1){n=n.replace("{rightArrow}",this.icons.rightArrow)}this.picker=f(n).appendTo(this.isInline?this.element:this.container).on({click:f.proxy(this.click,this),mousedown:f.proxy(this.mousedown,this)});if(this.wheelViewModeNavigation){if(f.fn.mousewheel){this.picker.on({mousewheel:f.proxy(this.mousewheel,this)})}else{console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option")}}if(this.isInline){this.picker.addClass("datetimepicker-inline")}else{this.picker.addClass("datetimepicker-dropdown-"+this.pickerPosition+" dropdown-menu")}if(this.isRTL){this.picker.addClass("datetimepicker-rtl");var k=this.bootcssVer===3?".prev span, .next span":".prev i, .next i";this.picker.find(k).toggleClass(this.icons.leftArrow+" "+this.icons.rightArrow)}f(document).on("mousedown",this.clickedOutside);this.autoclose=false;if("autoclose" in l){this.autoclose=l.autoclose}else{if("dateAutoclose" in this.element.data()){this.autoclose=this.element.data("date-autoclose")}}this.keyboardNavigation=true;if("keyboardNavigation" in l){this.keyboardNavigation=l.keyboardNavigation}else{if("dateKeyboardNavigation" in this.element.data()){this.keyboardNavigation=this.element.data("date-keyboard-navigation")}}this.todayBtn=(l.todayBtn||this.element.data("date-today-btn")||false);this.clearBtn=(l.clearBtn||this.element.data("date-clear-btn")||false);this.todayHighlight=(l.todayHighlight||this.element.data("date-today-highlight")||false);this.weekStart=0;if(typeof l.weekStart!=="undefined"){this.weekStart=l.weekStart}else{if(typeof this.element.data("date-weekstart")!=="undefined"){this.weekStart=this.element.data("date-weekstart")}else{if(typeof a[this.language].weekStart!=="undefined"){this.weekStart=a[this.language].weekStart}}}this.weekStart=this.weekStart%7;this.weekEnd=((this.weekStart+6)%7);this.onRenderDay=function(p){var r=(l.onRenderDay||function(){return[]})(p);if(typeof r=="string"){r=[r]}var q=["day"];return q.concat((r?r:[]))};this.onRenderHour=function(p){var r=(l.onRenderHour||function(){return[]})(p);var q=["hour"];if(typeof r=="string"){r=[r]}return q.concat((r?r:[]))};this.onRenderMinute=function(r){var q=(l.onRenderMinute||function(){return[]})(r);var p=["minute"];if(typeof q=="string"){q=[q]}return p.concat((q?q:[]))};this.onRenderYear=function(r){var q=(l.onRenderYear||function(){return[]})(r);var p=["year"];if(typeof q=="string"){q=[q]}return p.concat((q?q:[]))};this.onRenderMonth=function(r){var q=(l.onRenderMonth||function(){return[]})(r);var p=["month"];if(typeof q=="string"){q=[q]}return p.concat((q?q:[]))};this.startDate=-Infinity;this.endDate=Infinity;this.datesDisabled=[];this.daysOfWeekDisabled=[];this.setStartDate(l.startDate||this.element.data("date-startdate"));this.setEndDate(l.endDate||this.element.data("date-enddate"));this.setDatesDisabled(l.datesDisabled||this.element.data("date-dates-disabled"));this.setDaysOfWeekDisabled(l.daysOfWeekDisabled||this.element.data("date-days-of-week-disabled"));this.setMinutesDisabled(l.minutesDisabled||this.element.data("date-minute-disabled"));this.setHoursDisabled(l.hoursDisabled||this.element.data("date-hour-disabled"));this.fillDow();this.fillMonths();this.update();this.showMode();if(this.isInline){this.show()}};j.prototype={constructor:j,_events:[],_attachEvents:function(){this._detachEvents();if(this.isInput){this._events=[[this.element,{focus:f.proxy(this.show,this),keyup:f.proxy(this.update,this),keydown:f.proxy(this.keydown,this)}]]}else{if(this.component&&this.hasInput){this._events=[[this.element.find("input"),{focus:f.proxy(this.show,this),keyup:f.proxy(this.update,this),keydown:f.proxy(this.keydown,this)}],[this.component,{click:f.proxy(this.show,this)}]];if(this.componentReset){this._events.push([this.componentReset,{click:f.proxy(this.reset,this)}])}}else{if(this.element.is("div")){this.isInline=true}else{this._events=[[this.element,{click:f.proxy(this.show,this)}]]}}}for(var k=0,l,m;k<this._events.length;k++){l=this._events[k][0];m=this._events[k][1];l.on(m)}},_detachEvents:function(){for(var k=0,l,m;k<this._events.length;k++){l=this._events[k][0];m=this._events[k][1];l.off(m)}this._events=[]},show:function(k){this.picker.show();this.height=this.component?this.component.outerHeight():this.element.outerHeight();if(this.forceParse){this.update()}this.place();f(window).on("resize",f.proxy(this.place,this));if(k){k.stopPropagation();k.preventDefault()}this.isVisible=true;this.element.trigger({type:"show",date:this.date})},hide:function(k){if(!this.isVisible){return}if(this.isInline){return}this.picker.hide();f(window).off("resize",this.place);this.viewMode=this.startViewMode;this.showMode();if(!this.isInput){f(document).off("mousedown",this.hide)}if(this.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())){this.setValue()}this.isVisible=false;this.element.trigger({type:"hide",date:this.date})},remove:function(){this._detachEvents();f(document).off("mousedown",this.clickedOutside);this.picker.remove();delete this.picker;delete this.element.data().datetimepicker},getDate:function(){var k=this.getUTCDate();if(k===null){return null}return new Date(k.getTime()+(k.getTimezoneOffset()*60000))},getUTCDate:function(){return this.date},getInitialDate:function(){return this.initialDate},setInitialDate:function(k){this.initialDate=k},setDate:function(k){this.setUTCDate(new Date(k.getTime()-(k.getTimezoneOffset()*60000)))},setUTCDate:function(k){if(k>=this.startDate&&k<=this.endDate){this.date=k;this.setValue();this.viewDate=this.date;this.fill()}else{this.element.trigger({type:"outOfRange",date:k,startDate:this.startDate,endDate:this.endDate})}},setFormat:function(l){this.format=g.parseFormat(l,this.formatType);var k;if(this.isInput){k=this.element}else{if(this.component){k=this.element.find("input")}}if(k&&k.val()){this.setValue()}},setValue:function(){var k=this.getFormattedDate();if(!this.isInput){if(this.component){this.element.find("input").val(k)}this.element.data("date",k)}else{this.element.val(k)}if(this.linkField){f("#"+this.linkField).val(this.getFormattedDate(this.linkFormat))}},getFormattedDate:function(k){if(k==c){k=this.format}return g.formatDate(this.date,k,this.language,this.formatType,this.timezone)},setStartDate:function(k){this.startDate=k||-Infinity;if(this.startDate!==-Infinity){this.startDate=g.parseDate(this.startDate,this.format,this.language,this.formatType,this.timezone)}this.update();this.updateNavArrows()},setEndDate:function(k){this.endDate=k||Infinity;if(this.endDate!==Infinity){this.endDate=g.parseDate(this.endDate,this.format,this.language,this.formatType,this.timezone)}this.update();this.updateNavArrows()},setDatesDisabled:function(k){this.datesDisabled=k||[];if(!f.isArray(this.datesDisabled)){this.datesDisabled=this.datesDisabled.split(/,\s*/)}this.datesDisabled=f.map(this.datesDisabled,function(l){return g.parseDate(l,this.format,this.language,this.formatType,this.timezone).toDateString()});this.update();this.updateNavArrows()},setTitle:function(k,l){return this.picker.find(k).find("th:eq(1)").text(this.title===false?l:this.title)},setDaysOfWeekDisabled:function(k){this.daysOfWeekDisabled=k||[];if(!f.isArray(this.daysOfWeekDisabled)){this.daysOfWeekDisabled=this.daysOfWeekDisabled.split(/,\s*/)}this.daysOfWeekDisabled=f.map(this.daysOfWeekDisabled,function(l){return parseInt(l,10)});this.update();this.updateNavArrows()},setMinutesDisabled:function(k){this.minutesDisabled=k||[];if(!f.isArray(this.minutesDisabled)){this.minutesDisabled=this.minutesDisabled.split(/,\s*/)}this.minutesDisabled=f.map(this.minutesDisabled,function(l){return parseInt(l,10)});this.update();this.updateNavArrows()},setHoursDisabled:function(k){this.hoursDisabled=k||[];if(!f.isArray(this.hoursDisabled)){this.hoursDisabled=this.hoursDisabled.split(/,\s*/)}this.hoursDisabled=f.map(this.hoursDisabled,function(l){return parseInt(l,10)});this.update();this.updateNavArrows()},place:function(){if(this.isInline){return}if(!this.zIndex){var l=0;f("div").each(function(){var q=parseInt(f(this).css("zIndex"),10);if(q>l){l=q}});this.zIndex=l+10}var p,o,n,m;if(this.container instanceof f){m=this.container.offset()}else{m=f(this.container).offset()}if(this.component){p=this.component.offset();n=p.left;if(this.pickerPosition=="bottom-left"||this.pickerPosition=="top-left"){n+=this.component.outerWidth()-this.picker.outerWidth()}}else{p=this.element.offset();n=p.left;if(this.pickerPosition=="bottom-left"||this.pickerPosition=="top-left"){n+=this.element.outerWidth()-this.picker.outerWidth()}}var k=document.body.clientWidth||window.innerWidth;if(n+220>k){n=k-220}if(this.pickerPosition=="top-left"||this.pickerPosition=="top-right"){o=p.top-this.picker.outerHeight()}else{o=p.top+this.height}o=o-m.top;n=n-m.left;this.picker.css({top:o,left:n,zIndex:this.zIndex})},update:function(){var k,l=false;if(arguments&&arguments.length&&(typeof arguments[0]==="string"||arguments[0] instanceof Date)){k=arguments[0];l=true}else{k=(this.isInput?this.element.val():this.element.find("input").val())||this.element.data("date")||this.initialDate;if(typeof k=="string"||k instanceof String){k=k.replace(/^\s+|\s+$/g,"")}}if(!k){k=new Date();l=false}this.date=g.parseDate(k,this.format,this.language,this.formatType,this.timezone);if(l){this.setValue()}if(this.date<this.startDate){this.viewDate=new Date(this.startDate)}else{if(this.date>this.endDate){this.viewDate=new Date(this.endDate)}else{this.viewDate=new Date(this.date)}}this.fill()},fillDow:function(){var k=this.weekStart,l="<tr>";while(k<this.weekStart+7){l+='<th class="dow">'+a[this.language].daysMin[(k++)%7]+"</th>"}l+="</tr>";this.picker.find(".datetimepicker-days thead").append(l)},fillMonths:function(){var m="",l=0;while(l<12){var k=this.onRenderMonth(l+1);m+='<span class="'+k.join(" ")+'">'+a[this.language].monthsShort[l++]+"</span>"}this.picker.find(".datetimepicker-months td").html(m)},fill:function(){if(this.date==null||this.viewDate==null){return}var H=new Date(this.viewDate),u=H.getUTCFullYear(),I=H.getUTCMonth(),o=H.getUTCDate(),C=H.getUTCHours(),x=H.getUTCMinutes(),y=this.startDate!==-Infinity?this.startDate.getUTCFullYear():-Infinity,D=this.startDate!==-Infinity?this.startDate.getUTCMonth():-Infinity,q=this.endDate!==Infinity?this.endDate.getUTCFullYear():Infinity,z=this.endDate!==Infinity?this.endDate.getUTCMonth()+1:Infinity,r=(new i(this.date.getUTCFullYear(),this.date.getUTCMonth(),this.date.getUTCDate())).valueOf(),G=new Date();this.setTitle(".datetimepicker-days",a[this.language].months[I]+" "+u);if(this.formatViewType=="time"){var l=this.getFormattedDate();this.setTitle(".datetimepicker-hours",l);this.setTitle(".datetimepicker-minutes",l)}else{this.setTitle(".datetimepicker-hours",o+" "+a[this.language].months[I]+" "+u);this.setTitle(".datetimepicker-minutes",o+" "+a[this.language].months[I]+" "+u)}this.picker.find("tfoot th.today").text(a[this.language].today||a.en.today).toggle(this.todayBtn!==false);this.picker.find("tfoot th.clear").text(a[this.language].clear||a.en.clear).toggle(this.clearBtn!==false);this.updateNavArrows();this.fillMonths();var K=i(u,I-1,28,0,0,0,0),B=g.getDaysInMonth(K.getUTCFullYear(),K.getUTCMonth());K.setUTCDate(B);K.setUTCDate(B-(K.getUTCDay()-this.weekStart+7)%7);var k=new Date(K);k.setUTCDate(k.getUTCDate()+42);k=k.valueOf();var s=[];var F;while(K.valueOf()<k){if(K.getUTCDay()==this.weekStart){s.push("<tr>")}F=this.onRenderDay(K);if(K.getUTCFullYear()<u||(K.getUTCFullYear()==u&&K.getUTCMonth()<I)){F.push("old")}else{if(K.getUTCFullYear()>u||(K.getUTCFullYear()==u&&K.getUTCMonth()>I)){F.push("new")}}if(this.todayHighlight&&K.getUTCFullYear()==G.getFullYear()&&K.getUTCMonth()==G.getMonth()&&K.getUTCDate()==G.getDate()){F.push("today")}if(K.valueOf()==r){F.push("active")}if((K.valueOf()+86400000)<=this.startDate||K.valueOf()>this.endDate||f.inArray(K.getUTCDay(),this.daysOfWeekDisabled)!==-1||f.inArray(K.toDateString(),this.datesDisabled)!==-1){F.push("disabled")}s.push('<td class="'+F.join(" ")+'">'+K.getUTCDate()+"</td>");if(K.getUTCDay()==this.weekEnd){s.push("</tr>")}K.setUTCDate(K.getUTCDate()+1)}this.picker.find(".datetimepicker-days tbody").empty().append(s.join(""));s=[];var v="",E="",t="";var m=this.hoursDisabled||[];for(var A=0;A<24;A++){F=this.onRenderHour(A+1);if(m.indexOf(A)!==-1){F.push("disabled")}var w=i(u,I,o,A);if((w.valueOf()+3600000)<=this.startDate||w.valueOf()>this.endDate){F.push("disabled")}else{if(C==A){F.push("active")}}if(this.showMeridian&&a[this.language].meridiem.length==2){E=(A<12?a[this.language].meridiem[0]:a[this.language].meridiem[1]);if(E!=t){if(t!=""){s.push("</fieldset>")}s.push('<fieldset class="hour"><legend>'+E.toUpperCase()+"</legend>")}t=E;v=(A%12?A%12:12);if(A<12){F.push("hour_am")}else{F.push("hour_pm")}s.push('<span class="'+F.join(" ")+'">'+v+"</span>");if(A==23){s.push("</fieldset>")}}else{v=A+":00";s.push('<span class="'+F.join(" ")+'">'+v+"</span>")}}this.picker.find(".datetimepicker-hours td").html(s.join(""));s=[];v="",E="",t="";var n=this.minutesDisabled||[];for(var A=0;A<60;A+=this.minuteStep){if(n.indexOf(A)!==-1){continue}var w=i(u,I,o,C,A,0);F=this.onRenderMinute(A+this.minuteStep);if(w.valueOf()<this.startDate||w.valueOf()>this.endDate){F.push("disabled")}else{if(Math.floor(x/this.minuteStep)==Math.floor(A/this.minuteStep)){F.push("active")}}if(this.showMeridian&&a[this.language].meridiem.length==2){E=(C<12?a[this.language].meridiem[0]:a[this.language].meridiem[1]);if(E!=t){if(t!=""){s.push("</fieldset>")}s.push('<fieldset class="minute"><legend>'+E.toUpperCase()+"</legend>")}t=E;v=(C%12?C%12:12);s.push('<span class="'+F.join(" ")+'">'+v+":"+(A<10?"0"+A:A)+"</span>");if(A==59){s.push("</fieldset>")}}else{v=A+":00";s.push('<span class="'+F.join(" ")+'">'+C+":"+(A<10?"0"+A:A)+"</span>")}}this.picker.find(".datetimepicker-minutes td").html(s.join(""));var L=this.date.getUTCFullYear();var p=this.setTitle(".datetimepicker-months",u).end().find(".month").removeClass("active");if(L==u){p.eq(this.date.getUTCMonth()).addClass("active")}if(u<y||u>q){p.addClass("disabled")}if(u==y){p.slice(0,D).addClass("disabled")}if(u==q){p.slice(z).addClass("disabled")}s="";u=parseInt(u/10,10)*10;var J=this.setTitle(".datetimepicker-years",u+"-"+(u+9)).end().find("td");u-=1;for(var A=-1;A<11;A++){F=this.onRenderYear(u);if(L==u){F.push("active")}if(u<y||u>q){F.push("disabled")}if(A==-1||A==10){F.push(b)}s+='<span class="'+F.join(" ")+'">'+u+"</span>";u+=1}J.html(s);this.place()},updateNavArrows:function(){var o=new Date(this.viewDate),m=o.getUTCFullYear(),n=o.getUTCMonth(),l=o.getUTCDate(),k=o.getUTCHours();switch(this.viewMode){case 0:if(this.startDate!==-Infinity&&m<=this.startDate.getUTCFullYear()&&n<=this.startDate.getUTCMonth()&&l<=this.startDate.getUTCDate()&&k<=this.startDate.getUTCHours()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&m>=this.endDate.getUTCFullYear()&&n>=this.endDate.getUTCMonth()&&l>=this.endDate.getUTCDate()&&k>=this.endDate.getUTCHours()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 1:if(this.startDate!==-Infinity&&m<=this.startDate.getUTCFullYear()&&n<=this.startDate.getUTCMonth()&&l<=this.startDate.getUTCDate()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&m>=this.endDate.getUTCFullYear()&&n>=this.endDate.getUTCMonth()&&l>=this.endDate.getUTCDate()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 2:if(this.startDate!==-Infinity&&m<=this.startDate.getUTCFullYear()&&n<=this.startDate.getUTCMonth()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&m>=this.endDate.getUTCFullYear()&&n>=this.endDate.getUTCMonth()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 3:case 4:if(this.startDate!==-Infinity&&m<=this.startDate.getUTCFullYear()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&m>=this.endDate.getUTCFullYear()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break}},mousewheel:function(l){l.preventDefault();l.stopPropagation();if(this.wheelPause){return}this.wheelPause=true;var k=l.originalEvent;var n=k.wheelDelta;var m=n>0?1:(n===0)?0:-1;if(this.wheelViewModeNavigationInverseDirection){m=-m}this.showMode(m);setTimeout(f.proxy(function(){this.wheelPause=false},this),this.wheelViewModeNavigationDelay)},click:function(o){o.stopPropagation();o.preventDefault();var p=f(o.target).closest("span, td, th, legend");if(p.is("."+this.icontype)){p=f(p).parent().closest("span, td, th, legend")}if(p.length==1){if(p.is(".disabled")){this.element.trigger({type:"outOfRange",date:this.viewDate,startDate:this.startDate,endDate:this.endDate});return}switch(p[0].nodeName.toLowerCase()){case"th":switch(p[0].className){case"switch":this.showMode(1);break;case"prev":case"next":var k=g.modes[this.viewMode].navStep*(p[0].className=="prev"?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveHour(this.viewDate,k);break;case 1:this.viewDate=this.moveDate(this.viewDate,k);break;case 2:this.viewDate=this.moveMonth(this.viewDate,k);break;case 3:case 4:this.viewDate=this.moveYear(this.viewDate,k);break}this.fill();this.element.trigger({type:p[0].className+":"+this.convertViewModeText(this.viewMode),date:this.viewDate,startDate:this.startDate,endDate:this.endDate});break;case"clear":this.reset();if(this.autoclose){this.hide()}break;case"today":var l=new Date();l=i(l.getFullYear(),l.getMonth(),l.getDate(),l.getHours(),l.getMinutes(),l.getSeconds(),0);if(l<this.startDate){l=this.startDate}else{if(l>this.endDate){l=this.endDate}}this.viewMode=this.startViewMode;this.showMode(0);this._setDate(l);this.fill();if(this.autoclose){this.hide()}break}break;case"span":if(!p.is(".disabled")){var r=this.viewDate.getUTCFullYear(),q=this.viewDate.getUTCMonth(),s=this.viewDate.getUTCDate(),t=this.viewDate.getUTCHours(),m=this.viewDate.getUTCMinutes(),u=this.viewDate.getUTCSeconds();if(p.is(".month")){this.viewDate.setUTCDate(1);q=p.parent().find("span").index(p);s=this.viewDate.getUTCDate();this.viewDate.setUTCMonth(q);this.element.trigger({type:"changeMonth",date:this.viewDate});if(this.viewSelect>=3){this._setDate(i(r,q,s,t,m,u,0))}}else{if(p.is(".year")){this.viewDate.setUTCDate(1);r=parseInt(p.text(),10)||0;this.viewDate.setUTCFullYear(r);this.element.trigger({type:"changeYear",date:this.viewDate});if(this.viewSelect>=4){this._setDate(i(r,q,s,t,m,u,0))}}else{if(p.is(".hour")){t=parseInt(p.text(),10)||0;if(p.hasClass("hour_am")||p.hasClass("hour_pm")){if(t==12&&p.hasClass("hour_am")){t=0}else{if(t!=12&&p.hasClass("hour_pm")){t+=12}}}this.viewDate.setUTCHours(t);this.element.trigger({type:"changeHour",date:this.viewDate});if(this.viewSelect>=1){this._setDate(i(r,q,s,t,m,u,0))}}else{if(p.is(".minute")){m=parseInt(p.text().substr(p.text().indexOf(":")+1),10)||0;this.viewDate.setUTCMinutes(m);this.element.trigger({type:"changeMinute",date:this.viewDate});if(this.viewSelect>=0){this._setDate(i(r,q,s,t,m,u,0))}}}}}if(this.viewMode!=0){var n=this.viewMode;this.showMode(-1);this.fill();if(n==this.viewMode&&this.autoclose){this.hide()}}else{this.fill();if(this.autoclose){this.hide()}}}break;case"td":if(p.is(".day")&&!p.is(".disabled")){var s=parseInt(p.text(),10)||1;var r=this.viewDate.getUTCFullYear(),q=this.viewDate.getUTCMonth(),t=this.viewDate.getUTCHours(),m=this.viewDate.getUTCMinutes(),u=this.viewDate.getUTCSeconds();if(p.is(".old")){if(q===0){q=11;r-=1}else{q-=1}}else{if(p.is(".new")){if(q==11){q=0;r+=1}else{q+=1}}}this.viewDate.setUTCFullYear(r);this.viewDate.setUTCMonth(q,s);this.element.trigger({type:"changeDay",date:this.viewDate});if(this.viewSelect>=2){this._setDate(i(r,q,s,t,m,u,0))}}var n=this.viewMode;this.showMode(-1);this.fill();if(n==this.viewMode&&this.autoclose){this.hide()}break}}},_setDate:function(k,m){if(!m||m=="date"){this.date=k}if(!m||m=="view"){this.viewDate=k}this.fill();this.setValue();var l;if(this.isInput){l=this.element}else{if(this.component){l=this.element.find("input")}}if(l){l.change();if(this.autoclose&&(!m||m=="date")){}}this.element.trigger({type:"changeDate",date:this.getDate()});if(k==null){this.date=this.viewDate}},moveMinute:function(l,k){if(!k){return l}var m=new Date(l.valueOf());m.setUTCMinutes(m.getUTCMinutes()+(k*this.minuteStep));return m},moveHour:function(l,k){if(!k){return l}var m=new Date(l.valueOf());m.setUTCHours(m.getUTCHours()+k);return m},moveDate:function(l,k){if(!k){return l}var m=new Date(l.valueOf());m.setUTCDate(m.getUTCDate()+k);return m},moveMonth:function(k,l){if(!l){return k}var o=new Date(k.valueOf()),s=o.getUTCDate(),p=o.getUTCMonth(),n=Math.abs(l),r,q;l=l>0?1:-1;if(n==1){q=l==-1?function(){return o.getUTCMonth()==p}:function(){return o.getUTCMonth()!=r};r=p+l;o.setUTCMonth(r);if(r<0||r>11){r=(r+12)%12}}else{for(var m=0;m<n;m++){o=this.moveMonth(o,l)}r=o.getUTCMonth();o.setUTCDate(s);q=function(){return r!=o.getUTCMonth()}}while(q()){o.setUTCDate(--s);o.setUTCMonth(r)}return o},moveYear:function(l,k){return this.moveMonth(l,k*12)},dateWithinRange:function(k){return k>=this.startDate&&k<=this.endDate},keydown:function(o){if(this.picker.is(":not(:visible)")){if(o.keyCode==27){this.show()}return}var q=false,l,r,p,s,k;switch(o.keyCode){case 27:this.hide();o.preventDefault();break;case 37:case 39:if(!this.keyboardNavigation){break}l=o.keyCode==37?-1:1;viewMode=this.viewMode;if(o.ctrlKey){viewMode+=2}else{if(o.shiftKey){viewMode+=1}}if(viewMode==4){s=this.moveYear(this.date,l);k=this.moveYear(this.viewDate,l)}else{if(viewMode==3){s=this.moveMonth(this.date,l);k=this.moveMonth(this.viewDate,l)}else{if(viewMode==2){s=this.moveDate(this.date,l);k=this.moveDate(this.viewDate,l)}else{if(viewMode==1){s=this.moveHour(this.date,l);k=this.moveHour(this.viewDate,l)}else{if(viewMode==0){s=this.moveMinute(this.date,l);k=this.moveMinute(this.viewDate,l)}}}}}if(this.dateWithinRange(s)){this.date=s;this.viewDate=k;this.setValue();this.update();o.preventDefault();q=true}break;case 38:case 40:if(!this.keyboardNavigation){break}l=o.keyCode==38?-1:1;viewMode=this.viewMode;if(o.ctrlKey){viewMode+=2}else{if(o.shiftKey){viewMode+=1}}if(viewMode==4){s=this.moveYear(this.date,l);k=this.moveYear(this.viewDate,l)}else{if(viewMode==3){s=this.moveMonth(this.date,l);k=this.moveMonth(this.viewDate,l)}else{if(viewMode==2){s=this.moveDate(this.date,l*7);k=this.moveDate(this.viewDate,l*7)}else{if(viewMode==1){if(this.showMeridian){s=this.moveHour(this.date,l*6);k=this.moveHour(this.viewDate,l*6)}else{s=this.moveHour(this.date,l*4);k=this.moveHour(this.viewDate,l*4)}}else{if(viewMode==0){s=this.moveMinute(this.date,l*4);k=this.moveMinute(this.viewDate,l*4)}}}}}if(this.dateWithinRange(s)){this.date=s;this.viewDate=k;this.setValue();this.update();o.preventDefault();q=true}break;case 13:if(this.viewMode!=0){var n=this.viewMode;this.showMode(-1);this.fill();if(n==this.viewMode&&this.autoclose){this.hide()}}else{this.fill();if(this.autoclose){this.hide()}}o.preventDefault();break;case 9:this.hide();break}if(q){var m;if(this.isInput){m=this.element}else{if(this.component){m=this.element.find("input")}}if(m){m.change()}this.element.trigger({type:"changeDate",date:this.getDate()})}},showMode:function(k){if(k){var l=Math.max(0,Math.min(g.modes.length-1,this.viewMode+k));if(l>=this.minView&&l<=this.maxView){this.element.trigger({type:"changeMode",date:this.viewDate,oldViewMode:this.viewMode,newViewMode:l});this.viewMode=l}}this.picker.find(">div").hide().filter(".datetimepicker-"+g.modes[this.viewMode].clsName).css("display","block");this.updateNavArrows()},reset:function(k){this._setDate(null,"date")},convertViewModeText:function(k){switch(k){case 4:return"decade";case 3:return"year";case 2:return"month";case 1:return"day";case 0:return"hour"}}};var b=f.fn.datetimepicker;f.fn.datetimepicker=function(m){var k=Array.apply(null,arguments);k.shift();var l;this.each(function(){var p=f(this),o=p.data("datetimepicker"),n=typeof m=="object"&&m;if(!o){p.data("datetimepicker",(o=new j(this,f.extend({},f.fn.datetimepicker.defaults,n))))}if(typeof m=="string"&&typeof o[m]=="function"){l=o[m].apply(o,k);if(l!==c){return false}}});if(l!==c){return l}else{return this}};f.fn.datetimepicker.defaults={};f.fn.datetimepicker.Constructor=j;var a=f.fn.datetimepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridiem:["am","pm"],suffix:["st","nd","rd","th"],today:"Today",clear:"Clear"}};var g={modes:[{clsName:"minutes",navFnc:"Hours",navStep:1},{clsName:"hours",navFnc:"Date",navStep:1},{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(k){return(((k%4===0)&&(k%100!==0))||(k%400===0))},getDaysInMonth:function(k,l){return[31,(g.isLeapYear(k)?29:28),31,30,31,30,31,31,30,31,30,31][l]},getDefaultFormat:function(k,l){if(k=="standard"){if(l=="input"){return"yyyy-mm-dd hh:ii"}else{return"yyyy-mm-dd hh:ii:ss"}}else{if(k=="php"){if(l=="input"){return"Y-m-d H:i"}else{return"Y-m-d H:i:s"}}else{throw new Error("Invalid format type.")}}},validParts:function(k){if(k=="standard"){return/t|hh?|HH?|p|P|z|Z|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g}else{if(k=="php"){return/[dDjlNwzFmMnStyYaABgGhHis]/g}else{throw new Error("Invalid format type.")}}},nonpunctuation:/[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,parseFormat:function(n,l){var k=n.replace(this.validParts(l),"\0").split("\0"),m=n.match(this.validParts(l));if(!k||!k.length||!m||m.length==0){throw new Error("Invalid date format.")}return{separators:k,parts:m}},parseDate:function(B,z,w,k,t){if(B instanceof Date){var v=new Date(B.valueOf()-B.getTimezoneOffset()*60000);v.setMilliseconds(0);return v}if(/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(B)){z=this.parseFormat("yyyy-mm-dd",k)}if(/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(B)){z=this.parseFormat("yyyy-mm-dd hh:ii",k)}if(/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(B)){z=this.parseFormat("yyyy-mm-dd hh:ii:ss",k)}if(/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(B)){var m=/([-+]\d+)([dmwy])/,r=B.match(/([-+]\d+)([dmwy])/g),u,q;B=new Date();for(var y=0;y<r.length;y++){u=m.exec(r[y]);q=parseInt(u[1]);switch(u[2]){case"d":B.setUTCDate(B.getUTCDate()+q);break;case"m":B=j.prototype.moveMonth.call(j.prototype,B,q);break;case"w":B.setUTCDate(B.getUTCDate()+q*7);break;case"y":B=j.prototype.moveYear.call(j.prototype,B,q);break}}return i(B.getUTCFullYear(),B.getUTCMonth(),B.getUTCDate(),B.getUTCHours(),B.getUTCMinutes(),B.getUTCSeconds(),0)}var r=B&&B.toString().match(this.nonpunctuation)||[],B=new Date(0,0,0,0,0,0,0),n={},A=["hh","h","ii","i","ss","s","yyyy","yy","M","MM","m","mm","D","DD","d","dd","H","HH","p","P","z","Z"],p={hh:function(D,s){return D.setUTCHours(s)},h:function(D,s){return D.setUTCHours(s)},HH:function(D,s){return D.setUTCHours(s==12?0:s)},H:function(D,s){return D.setUTCHours(s==12?0:s)},ii:function(D,s){return D.setUTCMinutes(s)},i:function(D,s){return D.setUTCMinutes(s)},ss:function(D,s){return D.setUTCSeconds(s)},s:function(D,s){return D.setUTCSeconds(s)},yyyy:function(D,s){return D.setUTCFullYear(s)},yy:function(D,s){return D.setUTCFullYear(2000+s)},m:function(D,s){s-=1;while(s<0){s+=12}s%=12;D.setUTCMonth(s);while(D.getUTCMonth()!=s){if(isNaN(D.getUTCMonth())){return D}else{D.setUTCDate(D.getUTCDate()-1)}}return D},d:function(D,s){return D.setUTCDate(s)},p:function(D,s){return D.setUTCHours(s==1?D.getUTCHours()+12:D.getUTCHours())},z:function(){return t}},C,l,u;p.M=p.MM=p.mm=p.m;p.dd=p.d;p.P=p.p;p.Z=p.z;B=i(B.getFullYear(),B.getMonth(),B.getDate(),B.getHours(),B.getMinutes(),B.getSeconds());if(r.length==z.parts.length){for(var y=0,x=z.parts.length;y<x;y++){C=parseInt(r[y],10);u=z.parts[y];if(isNaN(C)){switch(u){case"MM":l=f(a[w].months).filter(function(){var s=this.slice(0,r[y].length),D=r[y].slice(0,s.length);return s==D});C=f.inArray(l[0],a[w].months)+1;break;case"M":l=f(a[w].monthsShort).filter(function(){var s=this.slice(0,r[y].length),D=r[y].slice(0,s.length);return s.toLowerCase()==D.toLowerCase()});C=f.inArray(l[0],a[w].monthsShort)+1;break;case"p":case"P":C=f.inArray(r[y].toLowerCase(),a[w].meridiem);break;case"z":case"Z":t;break}}n[u]=C}for(var y=0,o;y<A.length;y++){o=A[y];if(o in n&&!isNaN(n[o])){p[o](B,n[o])}}}return B},formatDate:function(m,r,n,q,p){if(m==null){return""}var l;if(q=="standard"){l={t:m.getTime(),yy:m.getUTCFullYear().toString().substring(2),yyyy:m.getUTCFullYear(),m:m.getUTCMonth()+1,M:a[n].monthsShort[m.getUTCMonth()],MM:a[n].months[m.getUTCMonth()],d:m.getUTCDate(),D:a[n].daysShort[m.getUTCDay()],DD:a[n].days[m.getUTCDay()],p:(a[n].meridiem.length==2?a[n].meridiem[m.getUTCHours()<12?0:1]:""),h:m.getUTCHours(),i:m.getUTCMinutes(),s:m.getUTCSeconds(),z:p};if(a[n].meridiem.length==2){l.H=(l.h%12==0?12:l.h%12)}else{l.H=l.h}l.HH=(l.H<10?"0":"")+l.H;l.P=l.p.toUpperCase();l.Z=l.z;l.hh=(l.h<10?"0":"")+l.h;l.ii=(l.i<10?"0":"")+l.i;l.ss=(l.s<10?"0":"")+l.s;l.dd=(l.d<10?"0":"")+l.d;l.mm=(l.m<10?"0":"")+l.m}else{if(q=="php"){l={y:m.getUTCFullYear().toString().substring(2),Y:m.getUTCFullYear(),F:a[n].months[m.getUTCMonth()],M:a[n].monthsShort[m.getUTCMonth()],n:m.getUTCMonth()+1,t:g.getDaysInMonth(m.getUTCFullYear(),m.getUTCMonth()),j:m.getUTCDate(),l:a[n].days[m.getUTCDay()],D:a[n].daysShort[m.getUTCDay()],w:m.getUTCDay(),N:(m.getUTCDay()==0?7:m.getUTCDay()),S:(m.getUTCDate()%10<=a[n].suffix.length?a[n].suffix[m.getUTCDate()%10-1]:""),a:(a[n].meridiem.length==2?a[n].meridiem[m.getUTCHours()<12?0:1]:""),g:(m.getUTCHours()%12==0?12:m.getUTCHours()%12),G:m.getUTCHours(),i:m.getUTCMinutes(),s:m.getUTCSeconds()};l.m=(l.n<10?"0":"")+l.n;l.d=(l.j<10?"0":"")+l.j;l.A=l.a.toString().toUpperCase();l.h=(l.g<10?"0":"")+l.g;l.H=(l.G<10?"0":"")+l.G;l.i=(l.i<10?"0":"")+l.i;l.s=(l.s<10?"0":"")+l.s}else{throw new Error("Invalid format type.")}}var m=[],s=f.extend([],r.separators);for(var o=0,k=r.parts.length;o<k;o++){if(s.length){m.push(s.shift())}m.push(l[r.parts[o]])}if(s.length){m.push(s.shift())}return m.join("")},convertViewMode:function(k){switch(k){case 4:case"decade":k=4;break;case 3:case"year":k=3;break;case 2:case"month":k=2;break;case 1:case"day":k=1;break;case 0:case"hour":k=0;break}return k},headTemplate:'<thead><tr><th class="prev"><i class="{iconType} {leftArrow}"/></th><th colspan="5" class="switch"></th><th class="next"><i class="{iconType} {rightArrow}"/></th></tr></thead>',headTemplateV3:'<thead><tr><th class="prev"><span class="{iconType} {leftArrow}"></span> </th><th colspan="5" class="switch"></th><th class="next"><span class="{iconType} {rightArrow}"></span> </th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};g.template='<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">'+g.headTemplate+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-hours"><table class=" table-condensed">'+g.headTemplate+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-days"><table class=" table-condensed">'+g.headTemplate+"<tbody></tbody>"+g.footTemplate+'</table></div><div class="datetimepicker-months"><table class="table-condensed">'+g.headTemplate+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-years"><table class="table-condensed">'+g.headTemplate+g.contTemplate+g.footTemplate+"</table></div></div>";g.templateV3='<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">'+g.headTemplateV3+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-hours"><table class=" table-condensed">'+g.headTemplateV3+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-days"><table class=" table-condensed">'+g.headTemplateV3+"<tbody></tbody>"+g.footTemplate+'</table></div><div class="datetimepicker-months"><table class="table-condensed">'+g.headTemplateV3+g.contTemplate+g.footTemplate+'</table></div><div class="datetimepicker-years"><table class="table-condensed">'+g.headTemplateV3+g.contTemplate+g.footTemplate+"</table></div></div>";f.fn.datetimepicker.DPGlobal=g;f.fn.datetimepicker.noConflict=function(){f.fn.datetimepicker=b;return this};f(document).on("focus.datetimepicker.data-api click.datetimepicker.data-api",'[data-provide="datetimepicker"]',function(l){var k=f(this);if(k.data("datetimepicker")){return}l.preventDefault();k.datetimepicker("show")});f(function(){f('[data-provide="datetimepicker-inline"]').datetimepicker()})}));