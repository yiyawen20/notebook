/**
 * yyw
 */
// var requestUrl = IMI.masterURL.replace("www.","coop.").replace("s2.","s2coop.");

;$(function() {
	Spring_2020_Act.init();
});

var dailyRecvMap = dailyRecvMap || {};
var currGiftSn = 2543;
var dIdx = 0;

var Spring_2020_Act = Spring_2020_Act || {};
Spring_2020_Act = {
	starTime : '',
	endTime	: '',
	nowday	: '',
	discount : 10,//抽取的折扣
	rechargeNum	: 0,//充值金额
	extractNum : 0,//已经抽取的次数
	hadBuy : 0,//已经购买礼包的次数
	boxPrice : [8000, 3, 20, 50],//显示原价，后面3个显示万
	wishArr	:	[],//心愿内容
	index : 0,
	t:0,
	patroller : 0,//是否巡管
	submitWish	:	"",
	changeDay	: 0,
	luckyList	: {},
	wishfhxy	:	['f_1944','h_1945','x_1946','y_1947'],
    init: function(){
        var that = this;
        // moment.locale("zh-cn");
		// if(IMI.env == "develop"){
		// 	requestUrl = "//aimi.mobimtech.com/";//测试
		// }
        // that.token = token;

        $(".ny_menu_tab").find("li").bind("click", function(){
			var self = $(this);
			var idx = self.index();
			self.addClass("act").siblings().removeClass("act");
			self.closest(".ny_menu_tab").next().children().eq(idx).fadeIn().siblings().hide();
		});
    }
}


 //弹幕
function barrageFly(content, num, idx){//ns_f风,ns_h花,ns_x雪,ns_y月
	var bkCss = ["ns_f","ns_h","ns_x","ns_y"];
	var _lable = $('<div class="sys_fly clear"><div class="fly_content_main left"><span class="'+bkCss[idx]+'"></span><span class="ns_t_w">'+content+'</span><span class="ns_t_n"><img src="'+IMI.fileBaseUrl+'/taskAct/2020/newyear/z1.png" onclick="Spring_2020_Act.givethethumbsup(\''+content+'\',\''+idx+'\'); return false;"><em id="thumbId_'+idx+'">'+num+'</em></span></div></div>');
	$(".barrage_wrap").append(_lable);
	init_barrage(_lable);
}
function barrageSysFly(content, num, idx){
	var html = "";
	if(Spring_2020_Act.patroller == 1){
		html = '<img src="'+IMI.fileBaseUrl+'/taskAct/2020/newyear/del.png" class="fly_del" onclick="Spring_2020_Act.deletWish(\''+content+'\'); return false;">';
	}
	var _lable = $('<div class="b_fly clear"><div class="fly_content_main left"><span class="ns_t_w">'+html+content+'</span><span class="ns_t_n"><img src="'+IMI.fileBaseUrl+'/taskAct/2020/newyear/z1.png" onclick="Spring_2020_Act.givethethumbsup(\''+content+'\',\''+idx+'\'); return false;"><em id="thumbId_'+idx+'">'+num+'</em></span></div></div>');
	$(".barrage_wrap").append(_lable);
	init_barrage(_lable);
}
var _top = 0;
var _time = 20000;
function init_barrage(obj){
	var _obj = $(".barrage_wrap");
	var _this = obj;
	var _height = _obj.height();
	var top = Math.round(Math.random()*(_height - 72));
	if(top > _top - 72 && top < _top + 72){
		if(top > _height/2){
			_top = _top - 80;
		}else{
			_top = _top + 120;
		}
	}else{
		_top = top;
	}
	/*if(_this.index() % 2 == 0){
		_time = 12000;
	}*/
	_this.css({"top" : _top});
	_this.animate({left: "-" + _this.width() + "px"}, _time, "linear", function () {
		$(this).remove();
	});
	_this.bind({
		"mouseenter": function(){
			_this.css({"z-index": 2}).siblings().css({"z-index": 1});
			_this.stop(true);
		},
		"mouseleave": function(){
			var s = _this.offset().left - _obj.offset().left;
			var i = (1-(1000-s)/(1000+_this.width()));

			_this.animate({left: "-" + _this.width() + "px"}, _time*i, "linear", function () {
				$(this).remove();
			});
		}
	});
}