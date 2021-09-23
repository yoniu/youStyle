function imageLoadSetting(){
	setImageLightGallery();
	setPhotoSetsGallery();
	lazyLoad();
	setFooterStyle();
}
function setFooterStyle(){
	if($(".single-column").length > 0){
		$("#footer").css("border-top","1px solid var(--borderColor2)");
	}else{
		$("#footer").css("border-top","unset");
	}
}
function setImageLightGallery(){
	if($('.post-content').length > 0){
		$('.post-content img:not(.biaoqing):not([alt="avatar"]):not(.card-image)').each(function(i) {
			if(!$(this).hasClass('biaoqing') && !$(this).hasClass('card-image') ){
				if (!this.parentNode.href) {
					$(this).wrap('<a class="post-imgLink" href="' + this.src + '" data-src="' + this.alt + '"></a>');
					$(this).addClass('lazyload');
					$(this).attr("data-src",this.src);
					$(this).attr("src","data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
				}
			}
		});
		$('.post-content').lightGallery({
			selector: '.post-imgLink, .yoniu-index-image',
			share: false,
			showThumbByDefault: false,
			autoplayControls: false
		});
	}
}
function setPhotoSetsGallery(){
	if($(".yoniu-photosets:not(.set-gallery-success)").length > 0){
		$(".yoniu-photosets:not(.set-gallery-success)").each(function(){
			$(this).addClass("set-gallery-success").lightGallery({
				selector: '.yoniu-index-image',
				share: false,
				showThumbByDefault: false,
				autoplayControls: false
			});
		});
	}
}
function lazyLoad(){
	//图片缓加载
	setTimeout(function(){
		$('img.lazyload').each(function(i){
			var ss = UIkit.scrollspy($(this));
			UIkit.util.on($(this), 'inview', function () {
				$(this).attr('src',$(this).data('src'));
			});
		});
	}, 300);
}
function sortList(){
	//首页ajax分类按钮
	$(body).delegate("#sort-nav a", "click", function() {
		$("#sort-nav").find("a.staying").removeClass("staying");
		$(this).addClass("staying"); 
	    var href = $(this).attr("href");
	    if (href != undefined) {
	        $.ajax( {
	            url: href,
	            type: "get",
				beforeSend:function(){
					$("html,body").stop(true);
					$("html,body").animate({scrollTop: $("#sort-nav").offset().top}, 1000);
					$('.post-list').fadeOut();
					$('.post-list').remove();
					$('.page-Link').fadeOut();
					$('.page-Link').remove();
				},
				error: function(request) {
					window.location.href = href;
				},   
				success: function(data) {
					var $res = $(data).find('.post-list');
					var $res2 = $(data).find('.page-Link');
					$('#main').append($res.fadeIn('slow'));
					$('#main').append($res2);
					imageLoadSetting();
				}   
	        });   
	    }   
		return false;
	});
}
function eventBind(){
	//点击事件绑定
	$(body).delegate("a.load-index", "click", function() {
		if($(this).hasClass("loading")){
			return false;
		}else{
			$(this).addClass("loading");
		}
		var href = $(this).attr("href");
		if (href != undefined) {
			$.ajax({
				url: href,
				beforeSend: () => {
					$(this).html("加载中...");
				},
				success: result => {
					var grandParent = $(this).parentsUntil(".post-list");
					var resultHtml = $(result).find('.post-content');
					$(this).parentsUntil(".post-t").remove();
					$(grandParent[grandParent.length - 1]).addClass('post').find('.t-header').addClass('post-t').after(resultHtml.fadeIn());
					imageLoadSetting();
					_msg('加载完成', 3000);
				},
				error: function(e){
					_msg('加载失败', 3000);
				}
			});
		} else {
			_msg('请求地址不存在', 3000);
		}
		return false;
	});
	$(body).delegate(".a-pageLink .next","click", function(){
		var href = $(this).attr("href");
		if (href != undefined) {
			$.ajax( {
				url: href,
				type: "get",
				beforeSend:function(){
					_msg('加载中...', 3000);
					$(".a-pageLink .next").hide(); 
					$(".a-pageLink .donut").fadeIn(); 
				},
				error: function(request) {
					_msg('加载失败', 3000);
				},   
				success: function(data) {
					$(".a-pageLink .donut").hide(); 
					var $res = $(data).find("article");
					$('.post-list').append($res).fadeIn(); ;
					var newhref = $(data).find(".a-pageLink .next").attr("href");
					if( newhref != undefined ){   
						$(".a-pageLink .next").attr("href",newhref);
						$(".a-pageLink .next").fadeIn(); 
					}else{   
						$(".a-pageLink .next").attr("style","display:none"); 
						$(".a-pageLink").append('<a href="javascript:;" rel="nofollow">加载完毕</a>'); 
					}
					_msg('加载完成', 3000);
					imageLoadSetting();
				}
			}); 		
		}   
		return false;   
	});
	$(body).delegate(".collapse","click", function(){
		var aim = $(this).data('id');
			$('#' + aim).slideToggle();
		if($(this).hasClass('show')){
			$(this).find('svg use').attr('xlink:href', '#icon-shrink');
			$(this).find('span.post-collapse').html('收起');
		}else{
			$(this).find('svg use').attr('xlink:href', '#icon-arrawsalt');
			$(this).find('span.post-collapse').html('展开');
		}
		$(this).toggleClass('show');
		return false;
	});
	$(body).delegate(".praise-btn","click", function(){
		if ($(this).hasClass('praised')) {
			_msg('您已赞过本文！', 3000);
			return false;
		}else{
			var a = $(this);
			a.attr('disabled', true);
			id = a.data('yoniu');
			_msg('正在点赞...', 3000);
			$.post(siteurl,{action: 'praise', id: id}, function(b){
				if(b=="false"){
					_msg('您已赞过本文！', 3000);
				}else{
					a.find('span').html( b );
					a.find('svg use').attr('xlink:href', '#icon-heart-fill');
					a.addClass('praised');
					_msg('点赞成功！', 3000);
					a.css('cursor', 'not-allowed').attr('title','您已赞过本文！');
				}
				return false;
			});
		}
	});
}
function archivesCollapse(aim){
	if($('#ca' + aim).hasClass('show')){
		$('#collapse' + aim).attr('style','--max-height: unset;');
		$('#ca' + aim).removeClass('show');
		$('#ca' + aim).addClass('hidden');
	}else if($('#ca' + aim).hasClass('hidden')){
		$('#collapse' + aim).attr('style','--max-height: 0;');
		$('#ca' + aim).removeClass('hidden');
		$('#ca' + aim).addClass('show');
	}else{
		$('#collapse' + aim).attr('style','--max-height: 0;');
		$('#ca' + aim).removeClass('hidden');
		$('#ca' + aim).addClass('show');
	}
}
function _msg(itext,time){
	$('body').find('#yoniu-msg').text(itext);
	$('body').find('#yoniu-msg').addClass('showtime');
	setTimeout(function(){
		$('body').find('#yoniu-msg').removeClass('showtime');
	}, time-1000);
}
function showSidebar(){
	$('#secondary').attr('style', '--top:' + $('#header').height() + 'px');
	if($('#secondary').hasClass('show')){
		$('#secondary').removeClass('show');
		$('#showSidebar').find('use').attr('xlink:href','#icon-swap');
	}else{
		$('#secondary').addClass('show');
		$('#showSidebar').find('use').attr('xlink:href','#icon-close');
	}
}
function turnLight(){
	$.post(siteurl,{yoniu_moonlight: $('body').hasClass('night') === true ? 'off' : 'on'}, function(b){
		if($('body').hasClass('night')){
			$('body').removeClass('night');
		}else{
			$('body').addClass('night');
		}
	});
}
function pwSent(cid){
	var mypassword = $('input[name="pw'+cid+'"]').val();
	if(mypassword == ""){
		alert('密码不能为空');
		return false;
	}
	$.ajax({
		url: window.location.href,
		type: 'POST',
		data: {themeAction:'password',mypassword:mypassword},
		beforeSend: function(){
			_msg('加载中', 3000);
		},
		success: function(s){
			if(s!="密码错误"){
				$('.post-content').html(s);
				_msg('加载完成', 3000);
			}else{
				alert('密码错误');
			}
			return false;
		},
		error: function(){
			alert('加载错误');
			return false;
		}
	});
}
function copyToClipboard(s){
	if(window.clipboardData){
		window.clipboardData.setData('text',s);
	}else{
		(function(s){
			document.oncopy=function(e){
			e.clipboardData.setData('text',s);
			e.preventDefault();
			document.oncopy=null;
		}
	})(s);
		document.execCommand('Copy');
	}
	_msg('复制完成', 3000);
}
function searchFramework(){
	if($('#search-framework').hasClass('active')){
		$('#search-framework').removeClass('active');
	}else{
		$('#search-framework').addClass('active');
	}
}
$(document).ready(function() {
	if($("#footer_bar").css("position") == 'fixed') $('#footer_bar').addClass('hidetime');
	$('#nav-btn').click(function(){
		$('#nav-menu').toggleClass('show');
		$("#header").toggleClass("background");
		if($('#nav-menu').hasClass('show')){
			$(this).find('use').attr('xlink:href','#icon-close');
		}else{
			$(this).find('use').attr('xlink:href','#icon-menu');
		}
	});
	sortList();
	imageLoadSetting();
	eventBind();
	var startx, starty;
    function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    };
    function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result;
        }
        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        }
        return result;
    }
    document.addEventListener("touchstart", function(e) {
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
    }, false);
    document.addEventListener("touchend", function(e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
            case 0://未滑动，显示
                break;
            case 1://向上滑动，隐藏
				$('body').find('#footer_bar').addClass('hidetime');
                break;
            case 2://向下滑动，显示
				$('body').find('#footer_bar').removeClass('hidetime');
                break;
            default:
        }
    }, false);
	if ($(window).scrollTop() > 50) {
	  $("#header").addClass("background-black");
	}
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
          $("#header").addClass("background-black");
        } else {
          $("#header").removeClass("background-black");
        }
    });
});