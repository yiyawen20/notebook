//yyw
var qznActivity = window.qznActivity || {};
qznActivity = {
    init: function(){
		var that = this;
		moment.locale("zh-cn");
		_ivp.token = _ivp.token || _ivp.imToken;
		that.quickNav();
		$("#lt_panel_scroll").tinyscrollbar({"wheel":54,"size":300});
		// $("#lt_panel_scroll").tinyscrollbar_update();
		
		$("#gd_panel_scroll").tinyscrollbar({"wheel":54,"size":300});
		// $("#gd_panel_scroll").tinyscrollbar_update();

		var g, k;
		$(".gift_play_btn").click(function() {
			var e = $(this).attr("giftsn")
			, a = 1e3 * parseInt($(this).attr("swfsecond"));
			g != e && (g = e, $("embed.shopCarFlash").remove(),
			$(".gift_play_div").append('<embed src="flash/' + e + '.swf" wmode="transparent" width="1180" height="600" class="shopCarFlash" type="" style="pointer-events: none;">'),
			clearTimeout(k),
			k = setTimeout(function() {
				$("embed.shopCarFlash").remove(),
				g = ""
			}
			, a));
		});

		$("#buy_btn").bind("click", function(){
			that.buyBox();
		});

		that.qznInit();

		var tc = moment().hour() * 3600 + moment().minute() * 60 + moment().second();
		var sx = 17 * 3600 + 5 * 60;
		var hdDtWrap = $(".hd_dt_wrap")
		if(tc < sx){
			// 还没开始
			hdDtWrap.show();
			countdown.start(sx - tc);
		}else{
			hdDtWrap.hide();
			hdDtWrap.prev().show();
		}
    },
    quickNav: function(){
		var win = $(window);
		var quickNav = $(".quick_nav");
		if(win.scrollTop() > 800 && win.width() > 1560){
			quickNav.show();
		}
		win.bind("scroll resize", function(){
			if(win.scrollTop() > 800 && win.width() > 1560){
				quickNav.show();
			}else{
				quickNav.hide();
			}
		});
	},
	qznInit: function(){
		console.log("init");
	},
	buyBox: function(cb){
		var that = this;
		if(that.__ii1 == 1) return;
		that.__ii1 = 1;
		$.ajax({
			url: IMI.masterURL + "2020annual/buyAnnualBox",
			data: {
				token: _ivp.token
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii1 = 2;
				var result = res.result;
				if(result == 0){
					// TODO
					if ((typeof cb) == "function") {
						cb();
					}
				}
			}
		});
	}
};


// 倒计时
var countdown = {
	start: function(time){
		this.cdDiv = $("#countdown");
		this.countdownInterval(time);
	},
	countdownInterval: function(time){
		var that = this;
		that.countdownShow(time);
		clearInterval(that.__tt);
		that.__tt = setInterval(function(){
			time--;
			if(time < 0){
				clearInterval(that.__tt);
				return;
			}
			that.countdownShow(time);
		}, 1e3);
	},
	countdownShow: function(time){
        var that = this;
		var h = parseInt(time/3600);
		h = h < 10 ? "0" + h : '' + h;
		var m = parseInt((time%3600)/60);
		m = m < 10 ? "0" + m : '' + m;
		var s = parseInt((time%3600)%60);
		s = s < 10 ? "0" + s : '' + s;
        var _time = h + ":" + m + ":" + s
		// console.log(_time);
		var temp = '<li>{}</li><li>{}</li>'
			+'<li class="ct_date_d">:</li>'
			+'<li>{}</li><li>{}</li>'
			+'<li class="ct_date_d">:</li>'
			+'<li>{}</li><li>{}</li>';
        var html = fm(temp, h.charAt(0), h.charAt(1), m.charAt(0), m.charAt(1), s.charAt(0), s.charAt(1));
        that.cdDiv.html(html);
        // var temp = '{}{}<span class="si_point">:</span>{}{}';
        // var html = fm(temp, h.charAt(0), h.charAt(1), m.charAt(0), m.charAt(1));
		// $("#buy_countdown").html(html);
    }
};