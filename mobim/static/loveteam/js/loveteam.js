//yyw
var loveteam = window.loveteam || {};
loveteam = {
	openTime: 1,//开通时长，月
	price: 8000,//开通一个月的金豆
	endTime: '',
	init: function() {
		var that = this;
		moment.locale("zh-cn");

		var ltOpenBtn = $("#lt_open_btn");
		if(_ivp.auth == 1){
			ltOpenBtn.hide();
			$("#lt_name_setting").show();
		}else{
			ltOpenBtn.show();
		}

		$(".lt_open_item").find("i").bind("click", function(){
			var _self = $(this);
			var idx = _self.index();
			_self.addClass("on").siblings().removeClass("on");
			var _arr = [1, 3, 6, 12];
			that.openTime = _arr[idx];
			$("#lt_open_price").html(_arr[idx] * that.price);
			if(that.endTime != ""){
				var html = fm('有效期至 <span class="lt_c2">{}</span>',
					moment(new Date(that.endTime)).add(that.openTime, 'M').format("YYYY-MM-DD HH:mm"));
				$("#lt_great_date").html(html);
			}
		});
		var ltMenTab = $(".lt_mem_tab");
		$("#lt_team_rank_btn").bind("click", function(){
			that.loveteamRank(function(){
				ltMenTab.hide();
				$("#loveteam_panel_title").html(that.loveName + '真爱团排行榜');
			});
		});
		$("#lt_mem_rank_btn").bind("click", function(){
			that.loveteamRank(function(){
				ltMenTab.show();
				$("#loveteam_panel_title").html(that.loveName + '真爱团成员');
			});
		});
		ltMenTab.find("li").bind("click", function(){
			var _self = $(this);
			var idx = _self.index();
			_self.addClass("act").siblings().removeClass("act");
		});

		//关注
		$(document.body).delegate(".lt_attention1", "click", function(){
			var self = $(this);
			var emceeId = self.attr("data-emceeId");
			if(_ivp.userId <= 0) {//未登录
				openDiv();
				return;
			}
			if (_ivp.userId == emceeId) {//主播不可关注自己
				showSimplePanel("有点自恋哦!");
				return false;
			}
			var type = 1;
			var cb = function(){self.addClass("lt_attention2").removeClass("lt_attention1")};
			var attentionNum = '';
			that.ajaxFollow(emceeId, type, cb, attentionNum);
		});

		//设置
		$("#lt_name_setting").bind("click", function(){
			that.ltNameSetting();
		});

		//关注并加入
		$(".lt_live_tips_btn1").bind("click", function(){
			var type = 1;
			var cb = function(){$("#tabUlUserListId li:eq(0)").click();};
			var attentionNum = '';
			that.ajaxFollow(_ivp.hostId, type, cb, attentionNum);
		});
		// showSimplePanel("提示内容");

		var _div1 = $("#lt_fanhui_btn, #lt_privilege_wrap, #lt_foot_open, #lt_great_date");
		var _div2 = $("#lt_mine_info, #lt_task_wrap");
		$("#lt_xufei_btn").bind("click", function(){
			var _status = $(this).attr("data-status");
			if(_status == 1){
				_div1.show();
				_div2.hide();
			}
		});
		$("#lt_fanhui_btn").bind("click", function(){
			_div1.hide();
			_div2.show();
		});
		that.loveteamInit();
	},
	loveteamInit: function(cb){
		var that = this;
		if(that.__ii1 == 1) return;
		that.__ii1 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/init",
			data: {
				userId: 1,
				roomId: 0
			},
			dataType: "json",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				var result = res.result;
				if(result == 1000){
					that.loveName = res.loveName;
					if(res.isOpen == 1 || _ivp.auth == 1){
						that.roomLoveInfo(function(){
							$(".lt_container").show();
						});
						that.endTime = res.endTime;
						var html = fm('有效期至 <span class="lt_c2">{}</span>',
							moment(new Date(res.endTime)).add(1, 'M').format("YYYY-MM-DD HH:mm"));
						$("#lt_great_date").html(html);
						console.log(res.endTime, moment(new Date(res.endTime)).add(3, 'M').format("YYYY-MM-DD HH:mm"));
					}else{
						$("#lt_name").html('[<i class="lt_c1">'+that.loveName+'</i>]');
						$(".lt_container").show();
					}
				}
				that.__ii1 = 2;
			}
		});
	},
	roomLoveInfo: function(cb){
		var that = this;
		if(that.__ii2 == 1) return;
		that.__ii2 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/roomLoveInfo",
			data: {
				userId: 1,
				roomId: 0
			},
			dataType: "json",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				var result = res.result;
				if(result == 1000){
					$("#lt_xufei_btn, #lt_mine_info, #lt_task_wrap").show();
					$("#lt_open_btn, #lt_privilege_wrap, #lt_foot_open").hide();
					var temp1 = '我的真爱值 <span class="lt_c2">{}</span> <span class="lt_lv">lv{}</span>';
					var html1 = fm(temp1, res.loveNum, res.loveLv);
					$(".lt_mine_value").html(html1);
					$("#lt_team_rank_btn").html('团排名'+res.loveRank+' <i class="lt_arrow1"></i>');
					$("#lt_mem_rank_btn").html('团成员'+res.memberNum+' <i class="lt_arrow1"></i>');

					if(_ivp.auth == 1){
						$("#lt_mine_info").find("p:first").hide();
						$("#lt_xufei_btn").hide();
					}

					var _arr = ['每日首次观看真爱主播',
								'每日在真爱主播间发言一次',
								'每日分享真爱主播间',
								'每日首次送礼给真爱主播间',
								'每日在房间进行一次充值'];
					var _brr = [2, 2, 5, 10, 50];
					var temp2 = '<li><span class="lt_t_n">{}</span> {}<span class="lt_t_s {}">+{} {}</span></li>'
					var html2 = '';
					var taskValue = res.taskValue;
					for(var i = 0; i < taskValue.length; i ++){
						html2 += fm(temp2,
							i+1,
							_arr[i],
							taskValue[i] == 1 || _ivp.auth == 1 ? 'lt_complete' : '',
							_brr[i],
							_ivp.auth == 1 ? '' : taskValue[i] == 0 ? '未完成' : '已完成'
						);
					}
					$(".lt_task_list").html(html2);

					$("#lt_name").html('[<i class="lt_c1">'+that.loveName+'</i>]');
					if ((typeof cb) == "function") {
						cb();
					}
				}
				that.__ii2 = 2;
			}
		});
	},
	ajaxFollow : function(emceeId, type, cb, attentionNum){ //关注/取消关注请求ajax
		$.post(liveHost + "/oper/notice/" + emceeId+"/"+type, {}, function(data) {
			if (data == "0") {
				showSimplePanel("关注成功!");
			}else if(data == "1") {
				showSimplePanel("您已经关注过!");
			}
			if ((typeof cb) == "function") {
				cb();
			}
		}, 'text');
	},
	ltNameSetting: function(){
		showDivPanel('lt_panel_common');
	},
	loveteamRank: function(cb){
		var that = this;
		if(that.__ii3 == 1) return;
		that.__ii3 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/loveMemberRank",
			data: {
				userId: 1,
				roomId: 0
			},
			dataType: "json",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii3 = 2;
				var result = res.result;
				if(result == 1000){
					var list = res.list;
					var temp = '<div class="lt_mem_line clear">'
						+'<a href="{}info/{}" target="_blank">'
						// +'<span class="lt_attention1 right noSelect" data-emceeId="10011">+关注</span>'
						+'<span class="lt_n_common lt_n{} left">{}</span>'
						+'<div class="lt_mem_pic left"><img src="{}" class="lt_mem_avatar"></div>'
						+'<div class="lt_mem_info">'
							+'<p>{}</p>'
							+'<p>真爱值 <span class="lt_c2">{}</span></p>'
						+'</div>'
						+'</a>'
					+'</div>';
					var html = '';
					for(var i = 0; i < list.length; i ++){
						html += fm(temp, liveHost, list[i].userId, i+1, i+1, list[i].avatar, list[i].nickname, list[i].loveNum);
					}
					$("#lt_panel_scroll").find(".overview").html(html);
					var loveInfo = res.loveInfo;
					var temp1 = '<span class="lt_n_common lt_n{} left">{}</span>'
						+'<div class="lt_mem_pic left"><img src="{}" class="lt_mem_avatar"></div>'
						+'<div class="lt_mem_info">'
							+'<p>{} 真爱值 <span class="lt_c2">{}</span></p>'
							+'<p style="color: #736eab;">超越前一名，真爱值需提升 {}</p>'
						+'</div>';
					var html1 = fm(temp1, loveInfo.rankNum, loveInfo.rankNum, loveInfo.avatar, loveInfo.nickname, loveInfo.loveNum, loveInfo.needNum);
					$(".lt_mem_mine").html(html1);
				}
				if ((typeof cb) == "function") {
					cb();
				}
				showDivPanel("loveteam_panel");
				clearTimeout(that.scrollTimer1);
				that.scrollTimer1 = setTimeout(function(){$("#lt_panel_scroll").tinyscrollbar_update();}, .3e3);
			}
		});
	}
}