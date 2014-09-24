/*Created by Sergey Brilenko*/
(function( $ ){
	$.fn.map = function(options){
		options = $.extend({
			mapLayersPath:'/map/', /* /map/ folder by default*/
			startImage:null, /*null by default, map on start, if want image on start and go to map by click on start image: format - {path,width:[w,h]}*/
            mapSize:{w:1000,h:500},
			typeImg:'jpg',
            layerSize:{w:256,h:256},
            start:'cener',
            points:[]

		}, options || {});
		
		var doit,
            va_map,
            maxW,
            maxH,
            max_x,max_y,
            map_ar={};
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        function uniqueid(){
            // always start with a letter (for DOM friendlyness)
            var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
            do {
                // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
                var ascicode=Math.floor((Math.random()*42)+48);
                if (ascicode<58 || ascicode>64){
                    // exclude all chars between : (58) and @ (64)
                    idstr+=String.fromCharCode(ascicode);
                }
            } while (idstr.length<32);

            return (idstr);
        }
		var whatMap={
            getCenter:function()
            {

            },
		    date_sizon:function() {return options.mapLayersPath;},
		    return_min_body_w:function(){ return whatMap.rW();},
		    rW:function(){return ('innerWidth' in window) ? window.innerWidth : document.body.offsetWidth;},
            rH:function(){return ('innerHeight' in window) ? window.innerHeight : document.body.offsetHeight;},
            repeatdateinpathmap:function(to_x,to_y,sp_w_,sp_h_)
            {
                    for(var i=0;i<=to_y;i++)
					{
						for(var j=0;j<=to_x;j++)
						{
                            sp_h=(i==to_y) ? sp_h_ : options.layerSize.h;
                            sp_w=(j==to_x) ? sp_w_ : options.layerSize.w;
							if(i==to_y && j==to_x) { sp_w=sp_w_; sp_h=sp_h_;}
							map_ar[i+'_'+j]=({w:sp_w,h:sp_h})
						}
					}
					max_x=to_x;
					max_y=to_y;
					maxW=options.mapSize['w'];
					maxH=options.mapSize['h'];
            },
			pathMap:function()
			{
                    var countLW=Math.floor(options.mapSize.w/options.layerSize.w),
                        countLH=Math.floor(options.mapSize.h/options.layerSize.h),
                        Wdif=options.mapSize.w-(countLW*options.layerSize.w),
                        Hdif=options.mapSize.h-(countLH*options.layerSize.h);
                    whatMap.repeatdateinpathmap(countLW,countLH,Wdif,Hdif)
			},
			maxW:function(){return maxW-whatMap.returnMin_w();},
			maxH:function(){return maxH-whatMap.returnMin_h();},
			returnMin_w:function(){return (whatMap.rW()<whatMap.return_min_body_w())?whatMap.return_min_body_w():whatMap.rW();},
			returnMin_h:function(){return whatMap.rH();},
            event_browser:function(ev){var IE='\v'=='v';return (IE) ? $(document) : $(window);},
			is_touch_device:function(){return !!('ontouchstart' in window);},
			m_t_down_x:function(ev){return (whatMap.is_touch_device()) ? ev.originalEvent.touches[0].pageX : ev.clientX;},
			m_t_down_y:function(ev){return (whatMap.is_touch_device()) ? ev.originalEvent.touches[0].pageY : ev.clientY;},
			get_napr:function(a,b,ev)
			{
				if (typeof(a) != 'undefined') {
			        var deltaX = a - whatMap.m_t_down_x(ev),
			            deltaY = b - whatMap.m_t_down_y(ev);
			        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
			            return 0;//left
			        } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
			            return 1;//right
			        } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
			            return 2;//up
			        } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
			            return 3;//down
			        }
			    }
			},
			returnAbsRoundDelKvadr:function(znach,par){return (par=="x")?Math.round(Math.abs(Math.abs(znach)/options.layerSize.w)):Math.round(Math.abs(Math.abs(znach)/options.layerSize.h));},
			plus_one_w:function(min_w,left){return (min_w%options.layerSize.w<options.layerSize.w) ? Math.floor((Math.abs(left)+min_w)/options.layerSize.w)+1 : Math.floor((Math.abs(left)+min_w)/options.layerSize.w);},
			plus_one_h:function(min_h,top){return (min_h%options.layerSize.h<options.layerSize.h) ? Math.floor((Math.abs(top)+min_h)/options.layerSize.h)+1 : Math.floor((Math.abs(top)+min_h)/options.layerSize.h);},
			putImage:function(max_y,max_x,begin_y,begin_x,plus_one_h,plus_one_w)
			{
                var i= 0,j=0;
				for(i=0;i<=max_y;i++)
					{
						for(j=0;j<=max_x;j++)
						{
							if((i<begin_y || i>plus_one_h) &&(j<begin_x || j>plus_one_w))
							    $('.img'+i+''+j).remove()
						}
					}
                    for(i=begin_y;i<=plus_one_h;i++)
                    {
                        for(j=begin_x;j<=plus_one_w;j++)
                        {
                            if($('img',$this).is('.img'+i+''+j))
                            {
                                if(va_map==whatMap.date_sizon())
                                    $('.img'+i+''+j).attr('src',va_map+options.typeImg+'/'+i+'_'+j+'.'+options.typeImg).css({border:'0',margin:'0',padding:'0',position:'absolute',left:j*options.layerSize.w,top:i*options.layerSize.h,width:map_ar[i+'_'+j]['w'],height:map_ar[i+'_'+j]['h']});
                                else
                                    $('.img'+i+''+j).attr('src',whatMap.date_sizon()+options.typeImg+'/'+i+'_'+j+'.'+options.typeImg).css({border:'0',margin:'0',padding:'0',position:'absolute',left:j*options.layerSize.w,top:i*options.layerSize.h,width:map_ar[i+'_'+j]['w'],height:map_ar[i+'_'+j]['h']})
                            }
                            else
                            {
                                var imageObj = document.createElement('img');
                                if(va_map==whatMap.date_sizon())
                                    imageObj.src=''+va_map+options.typeImg+'/'+i+'_'+j+'.'+options.typeImg+'?anti_cache=' + whatMap.date_sizon();
                                else
                                    imageObj.src=''+whatMap.date_sizon()+options.typeImg+'/'+i+'_'+j+'.'+options.typeImg+'?anti_cache=' + va_map;
                                //imageObj.onload = function(){}
                                $this.append('<img class="img'+i+''+j+'" style="border:0;margin:0;padding:0;position:absolute;left:'+j*options.layerSize.w+'px;top:'+i*options.layerSize.h+'px;width:'+map_ar[i+'_'+j]['w']+'px;height:'+map_ar[i+'_'+j]['h']+'px;" src="'+imageObj.src+'" />');
                            }
                        }
                    }


			},
            main:function()
            {
                whatMap.pathMap();
                maxW=whatMap.maxW();
                maxH=whatMap.maxH();
                if(Math.round(Math.abs($this.parent().offset().left)>=maxW)) {$this.parent().css({left:(-1)*maxW})}
                if(Math.round(Math.abs($this.parent().offset().top)>=maxH)) { $this.parent().css({top:(-1)*maxH}) }
                $('#map').css({width:whatMap.returnMin_w(),height:whatMap.returnMin_h()});

                begin_x=whatMap.returnAbsRoundDelKvadr($this.parent().offset().left,'x');
                begin_y=whatMap.returnAbsRoundDelKvadr($this.parent().offset().top,'y');
                if(begin_x*options.layerSize.w>Math.abs($this.parent().offset().left)) begin_x--;
                if(begin_y*options.layerSize.h>Math.abs($this.parent().offset().top)) begin_y--;
                var plus_one_w=whatMap.plus_one_w(whatMap.returnMin_w(),$this.parent().offset().left),
                    plus_one_h=whatMap.plus_one_h(whatMap.returnMin_h(),$this.parent().offset().top);
                if(options.start=="center")
                {
                    var left=(options.mapSize.w/2)-(whatMap.rW()/2),top=(options.mapSize.h/2)-(whatMap.rH()/2);
                    var from_x=Math.floor(left/options.layerSize.w),from_y=Math.floor(top/options.layerSize.h);
                    var to_x_=from_x+Math.floor(whatMap.rW()/options.layerSize.w)+ 1,
                        to_y_=from_y+Math.floor(whatMap.rH()/options.layerSize.h)+ 1;
                    $this.parent().css({left:(-1)*left,top:(-1)*top});
                    whatMap.putImage(max_y,max_x,from_y,from_x,to_y_,to_x_);
                }
                else
                {
                    whatMap.putImage(max_y,max_x,begin_y,begin_x,plus_one_h,plus_one_w);
                }
            },
            goto:function(selector,x,y)
            {
                var selectorx=selector.css('width'),selectory=selector.css('height');

            }
		};
        var $this = this;
        va_map=whatMap.date_sizon();
        $("<div id='map-back' style='position: absolute;z-index:1;background:url("+options.mapBack+");repeat;width:100%;height:100%;'></div>").insertAfter($this.parent());
		/*code from resize function*/
		whatMap.main();
        if(Object.size(options.points)>0)
        {
            $.each(options.points, function( index, value ) {
                if(value.x>0 && value.y>0)
                {
                    var unqid=uniqueid();
                    $("<div id='"+unqid+"' style='z-index:99999999;position: absolute;top:"+value.y+"px;left:"+value.x+"px;' class='"+value.pointclass+"'></div>").insertBefore($('#map'));
                    $('#'+unqid).on('click',function()
                    {
                        if($('#'+unqid+" >div").length>0)
                        {
                            $('#'+unqid+" >div").remove();
                        }
                        else
                        {
                            $(this).append("<div class='bubble'>"+value.html+"</div>")
                            var h=(-1)*(parseInt($('#'+unqid+" >div").css("height"))+20);
                            $('#'+unqid+" >div").css("margin-top",h+"px");
                        }

                    })
                }
            });
        }
        if(options.type=="game")
        {
            if(options.playerstart)
            {
                $("<div id='player' style='z-index:99999999;position: absolute;top:"+options.playerstart.y+"px;left:"+options.playerstart.x+"px;'></div>").insertBefore($('#map'));
            }
        }
		/*viewport = document.querySelector("meta[name=viewport]");
          if (window.orientation == 90 || window.orientation == -90) {
            viewport.setAttribute('content', 'width=device-width, maximum-scale=1.0');
          } else {
            viewport.setAttribute('content', 'width=device-width, maximum-scale=0.75');
          }*/
        whatMap.pathMap();
        $this.css({width:maxW,height:maxH});
		maxW=whatMap.maxW();
		maxH=whatMap.maxH();
		//выводим карту
		var begin_x,begin_y;
        
		var ms_x,ms_y;
		var down=false;
		var event_id,event_id_move,event_id_end;
		var top,left;

		if(whatMap.is_touch_device()) 
		{
			 event_id='touchstart';
			 event_id_move='touchmove';
			 event_id_end='touchend';
			 event_id_leave='touchend';
		}
		else 
		{
			event_id='mousedown';
			event_id_move='mousemove';
			event_id_end='mouseup';
			event_id_leave='mouseleave';
		}
		$('img',$this).on('contextmenu',function(e){e.preventDefault();})
		.on('dragstart', function(e) {e.preventDefault();})
		 
		$this.parent().on('contextmenu',function(e){e.preventDefault();})
		.on('dragstart', function(e) {e.preventDefault();})
		.on(event_id,function(e){
			if(!down)
			{
				down=true;
				ms_x=whatMap.m_t_down_x(e)	
				ms_y=whatMap.m_t_down_y(e)
			}
		}).on( event_id_move,function(e){
		    if(down)
			{			
                left=parseInt($this.offset().left) +(whatMap.m_t_down_x(e)-ms_x);
                top=parseInt($this.offset().top)+(whatMap.m_t_down_y(e)-ms_y);
                if(left>0||top>0||Math.abs(left)>maxW||Math.abs(top)>maxH) {}
                else
                {
                    begin_x=whatMap.returnAbsRoundDelKvadr(left,'x');
                    begin_y=whatMap.returnAbsRoundDelKvadr(top,'y');
                    if(begin_x*options.layerSize.w>Math.abs(left)) begin_x--;
                    if(begin_y*options.layerSize.h>Math.abs(top)) begin_y--;
                    var plus_one_w=whatMap.plus_one_w(whatMap.returnMin_w(),left);
                    var plus_one_h=whatMap.plus_one_h(whatMap.returnMin_h(),top);
                    if(plus_one_w>max_x) plus_one_w=max_x;
                    if(plus_one_h>max_y) plus_one_h=max_y;
                    whatMap.putImage(max_y,max_x,begin_y,begin_x,plus_one_h,plus_one_w);
                    $this.parent().css({'left':left,'top':top});
                }
                ms_x=whatMap.m_t_down_x(e);
                ms_y=whatMap.m_t_down_y(e);
			}
	   })
		.on(event_id_end,function(e){
			down=false;
		}).on(event_id_leave,function()
		{down=false;})
		down2=false;
 
//  window.onorientationchange = function() {
//  viewport = document.querySelector("meta[name=viewport]");
//  if (window.orientation == 90 || window.orientation == -90) {
//    viewport.setAttribute('content', 'width=device-width; maximum-scale=1.0;');
//  } else {
//    viewport.setAttribute('content', 'width=device-width; maximum-scale=0.75;');
//  }
//}
	$(window).on('resize',function()
	{
	    clearTimeout(doit);
 		doit = setTimeout(function(){
        var isiPad = navigator.userAgent.match(/iPad/i) != null;
            whatMap.main();
		} , 100)
	})
	}
})(jQuery);
		