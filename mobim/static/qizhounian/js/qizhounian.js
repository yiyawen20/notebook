//yyw
var requestUrl = '';
var qznActivity = window.qznActivity || {};
qznActivity = {
    init: function(){
		var that = this;
		moment.locale("zh-cn");
		requestUrl = IMI.masterURL;
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

		$(".hd_tab").find("li").bind("click", function(){
			var _self = $(this);
			zbsRank.type = _self.index();
			zbsRank.n = nowday;
			zbsRank.getRankList(zbsRank.type, nowday);
			_self.addClass("act").siblings().removeClass("act");
		});
		$('#slider1_date').html(moment().format("MMMDo ") + '19:05~24:00');
		zbsRank.init();
		that.tc = moment().hour() * 3600 + moment().minute() * 60 + moment().second();
		that.sx = 15 * 3600 + 5 * 60;
		that.hdDtWrap = $(".hd_dt_wrap");
		if(that.tc < that.sx){
			// 还没开始
			that.hdDtWrap.show();
			countdown.start(that.sx - that.tc);
			if(nowday <= start) {
				zbsRank.arrowLeft.addClass("slider_disabled");
			}
		}else{
			that.hdDtWrap.hide();
			that.hdDtWrap.prev().show();
			zbsRank.getRankList(zbsRank.type, nowday);
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

var start ="2020/03/10";
var end = "2020/03/30";
var nowday = '';
var zbsRank = zbsRank || {
	type: 0,
	init: function(){
		var _this = this;
		nowday = moment().format("YYYY/MM/DD");
		_this.zbsDate = $('#slider1_date');
		_this.arrowLeft = $('#slider1_left');
		_this.arrowRight = $('#slider1_right');
		_this.n = nowday;
		//日期翻页
		//顶部切页事件
		_this.arrowLeft.bind('click', function(){
			if($(this).attr("class").indexOf("slider_disabled") > -1) return;
			_this.n = moment(new Date(_this.n)).subtract("1", "d").format('YYYY/MM/DD');
			_this.getRankList(zbsRank.type, _this.n);
		});
		_this.arrowRight.bind('click', function(){
			if($(this).attr("class").indexOf("slider_disabled") > -1) return;
			_this.n = moment(new Date(_this.n)).add("1", "d").format('YYYY/MM/DD');
			_this.getRankList(zbsRank.type, _this.n);
		});

		$(document.body).delegate(".hd_r_xx", "click", function(e){
			e.preventDefault();
			var emceeId = $(this).attr("emecee");
			// console.log(emceeId);
			_this.emceeRankInfo(emceeId, _this.n);
		});
	},
	userMap: [{}, {}],
	//请求用户列表{'2018-12-01':["13:00@19018@1@15@测试用户1", "15:00@10011@1@23@测试用户2", "17:00@10012@2@27@测试用户4",..]}
	getRankList: function(type, date){
		$('#zbs_rank_content').empty();
		if(date < start) {
			 this.arrowLeft.addClass("slider_disabled");
			 this.zbsDate.html(moment(new Date(date)).format("MMMDo ") + '19:05~24:00');
			 $('#zbs_rank_content').html('<p style="text-align: center; padding: 30px 0 0;">活动暂未开始</p>');
			 clearTimeout(this.__);
			 this.__ = setTimeout(function(){$("#lt_panel_scroll").tinyscrollbar_update();}, .2e3);
			 return;
		}
		this.arrowLeft.removeClass("slider_disabled");
		if(date == start) {
			 this.arrowLeft.addClass("slider_disabled");
		}
		this.arrowRight.removeClass("slider_disabled");
		if(date >= nowday) {
			this.arrowRight.addClass("slider_disabled");
			date = nowday;
		}
		//end 格式 yyyy/MM/dd
		if(date > end) {
			date = end;
			this.arrowRight.addClass("slider_disabled");
		}
		// date = date.replace(/\//ig,'-');
		// $('#zbsDate').find('#slider_t2').html(new Date(date.replace(/-/ig,'/')).format('MM月d日幸运用户'));
		// 3月22日 19:05~24:00
		this.zbsDate.html(moment(new Date(date)).format("MMMDo ") + '19:05~24:00');
		if(qznActivity.tc < qznActivity.sx && date >= nowday){
			// 还没开始
			qznActivity.hdDtWrap.show();
			qznActivity.hdDtWrap.prev().hide();
			return;
		}else{
			qznActivity.hdDtWrap.hide();
			qznActivity.hdDtWrap.prev().show();
		}
		if(this.userMap[zbsRank.type][date]) {
			zbsRank.renderData(date);
			return;
		}
		$.ajax({
			type		: 'get',
			url			: requestUrl + '2020annual/hourPk/rank?type='+(type+1)+'&day='+date,
			dataType	: 'json',
			jsonpCallback : 'callback_' + new Date().getTime(),
			success		: function(rs){
				if(rs.result == 0) {
					delete rs['result'];
					var list = rs.list || [];
					zbsRank.userMap[zbsRank.type][date] = list;
					zbsRank.renderData(date);
					zbsRank.mvpRenderData(rs.mvpInfo);
				}else {
					//无数据
					$("#zbs_rank_content").html('<p style="text-align: center; padding: 30px 0 0;">无人上榜</p>');
				}
			}
		});
	},
	renderData: function(date) {
		if(jQuery.isEmptyObject(zbsRank.userMap[zbsRank.type])){
			return;
		}
		var list = zbsRank.userMap[zbsRank.type][date]; 
		// <span class="hd_live">直播</span>
		var html = '';
		var temp = '<a href="{}{}" onclick="if(isAuth === 1){return false;}" target="_blank">'
			+'<ul class="clear">'
			+'<li class="hd_r1"><span class="hd_n_common hd_n{}">{}</span></li>'
			+'<li class="hd_r2"><img src="{}" class="hd_r_avatar"></li>'
			+'<li class="hd_r3"><span class="hd_r_name">{}</span> {}</li>'
			+'<li class="hd_r4">{}</li>'
			+'<li class="hd_r5">{} <span class="hd_r_xx" emecee="{}">详情&gt;</span></li>'
		+'</ul></a>';
		if(list && list.length > 0) {
			for(var i = 0; i < list.length; i ++){
				html += fm(temp,
					liveHost, list[i].emceeId,
					i+1, i+1,
					list[i].avatar,
					list[i].nickName,
					list[i].isLive == 1 ? '<span class="hd_live">直播</span>' : '',
					list[i].score,
					list[i].win,
					list[i].emceeId
				);
			}
		}else{
			html = '<p style="text-align: center; padding: 30px 0 0;">无人上榜</p>';
		}
		$('#zbs_rank_content').html(html);
		clearTimeout(this.__);
		this.__ = setTimeout(function(){$("#lt_panel_scroll").tinyscrollbar_update();}, .2e3);
	},
	mvpRenderData: function(mvpInfo){
		var temp = '<div class="hd_mvp_p1">'
			+'<a href="{}{}" onclick="if(isAuth === 1){return false;}" target="_blank">'
			+'<div><img src="{}" class="hd_mvp_avatar"></div>'
			+'<div>{}</div>'
			+'</a>'
		+'</div>'
		+'<div class="hd_mvp_p2">'
			+'<a href="{}info/{}" target="_blank">'
			+'<div><img src="{}" class="hd_mvp_avatar"></div>'
			+'<div>{}</div>'
			+'</a>'
		+'</div>'
		+'<div class="hd_mvp_jz">{}<i>金豆</i></div>';
		var html = fm(temp,
			liveHost, mvpInfo.emceeId,
			mvpInfo.eAvatar,
			mvpInfo.eNickName,
			liveHost, mvpInfo.userId,
			mvpInfo.avatar,
			mvpInfo.nickName,
			mvpInfo.score,
		);
		if(mvpInfo.userId != undefined){
			$(".hd_mvp_wrap").html(html);
		}
	},
	emceeRankInfo: function(emceeId, date, cb){
		var that = this;
		if(that.__ii1 == 1) return;
		that.__ii1 = 1;
		$.ajax({
			url: IMI.masterURL + "2020annual/hourPk/emceeRankInfo",
			data: {
				emceeId: emceeId,
				day: date
			},
			dataType: "json",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii1 = 2;
				var result = res.result;
				if(result == 0){
					// TODO
					var list = res.list;
					that.emceeRankInfoRender(list);
					if ((typeof cb) == "function") {
						cb();
					}
				}
			}
		});
	},
	emceeRankInfoRender: function(list){
		var html = '';
		var temp = '<div class="gd_line">'
			+'<div class="left gd_t1">{}</div>'
			+'<div class="left gd_db">'
				+'<span class="gd_db_load"><i style="width: 40%;"></i></span>'
				+'<div class="left gd_zb1">'
					+'<img src="{}" class="left gd_zb_avatar1">'
					+'<div class="left gd_zb_info1">'
						+'<p class="gd_zb_d1">{}</p>'
						+'<p class="gd_zb_d2">{}</p>'
					+'</div>'
				+'</div>'
				+'<div class="left gd_zb1">'
					+'<div class="left gd_zb_info2">'
						+'<p class="gd_zb_d1">{}</p>'
						+'<p class="gd_zb_d2">{}</p>'
					+'</div>'
					+'<img src="{}" class="left gd_zb_avatar2">'
				+'</div>'
			+'</div>'
		+'</div>';
		for(var i = 0; i < list.length; i++){
			html += fm(temp,
				list[i].hour,
				list[i].avatar,
				list[i].score,
				list[i].nickName,
				list[i].oppoScore,
				list[i].oppoNickName,
				list[i].oppoAvatar,
			);
		}
		if(html == ""){
			html = '<p style="text-align: center; padding: 30px 0 0;">暂无数据</p>';
		}
		$("#emcee_details").html(html);
		$(".activity_details_pop").show();
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