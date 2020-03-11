//yyw
var loveteam = window.loveteam || {};
loveteam = {
	openTime: 1,//开通时长，月
	price: 8000,//开通一个月的金豆
	endTime: '',
	init: function() {
		var that = this;
		moment.locale("zh-cn");

		_ivp.token = _ivp.token || _ivp.imToken;

		var ltOpenBtn = $("#lt_open_btn");
		if(_ivp.auth == 1){
			ltOpenBtn.hide();
			$("#lt_name_setting").show();
		}else{
			ltOpenBtn.show();
		}

		$(document.body).delegate("#lt_open_btn", "click", function(){
			showpanel("开通", "是否开通真爱团"+that.openTime+"个月？", {
				"leftText": "确定",
				"leftCallback": function(){
					that.openAndRenew(that.openTime, function(res){
						var result = res.result;
						if(result == 0){
							console.log('开通成功');
							that.endTime = res.endTime.replace(/-/ig, '/');
							var html = fm('有效期至 <span class="lt_c2">{}</span>',
								moment(new Date(that.endTime)).add(1, 'M').format("YYYY-MM-DD HH:mm"));
							$("#lt_great_date").html(html);
							showSimplePanel('成功开通真爱团'+that.openTime+'个月！');
							that.roomLoveInfo(function(){
								$(".lt_container").show();
							});
						}else if(result == -3){
							// showSimplePanel('余额不足！');
							chargePop();
						}else if(result == -4){
							showSimplePanel('购买不能超过1年！');
						}else{
							// 开通失败
							console.log('开通失败');
							showSimplePanel('开通失败！');
						}
					});
				},
				rightText: "取消"
			});
        });

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
				$("#loveteam_panel_title").html('真爱团排行榜');
			});
		});
		$("#lt_mem_rank_btn").bind("click", function(){
			ltMenTab.find("li").eq(0).click();
		});
		ltMenTab.find("li").bind("click", function(){
			var _self = $(this);
			var idx = _self.index();
			_self.addClass("act").siblings().removeClass("act");
			that.loveteamMemRank(function(){
				ltMenTab.show();
				$("#loveteam_panel_title").html(that.loveName + '真爱团成员');
			}, idx);
		});

		//关注
		$(document.body).delegate(".lt_attention0", "click", function(){
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
			var cb = function(){self.addClass("lt_attention1").removeClass("lt_attention0")};
			var attentionNum = '';
			that.ajaxFollow(emceeId, type, cb, attentionNum);
		});

		//设置
		$("#lt_name_setting").bind("click", function(){
			that.ltNameSetting();
		});
		$(document.body).delegate('.lt_common_btn1', "click", function(){
			that.setLoveName();
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
			var self = $(this);
			var _status = self.attr("data-status");
			if(_status == 1){
				self.attr("data-status", 2);
				_div1.show();
				_div2.hide();
				$(".lt_open_item").find("i").eq(0).click();
			}else{
				that.openAndRenew(that.openTime, function(res){
					var result = res.result;
					if(result == 0){
						console.log('续费成功');
						self.attr("data-status", 1);
						that.endTime = res.endTime.replace(/-/ig, '/');
						var html = fm('有效期至 <span class="lt_c2">{}</span>',
							moment(new Date(that.endTime)).add(1, 'M').format("YYYY-MM-DD HH:mm"));
						$("#lt_great_date").html(html);
						showSimplePanel('成功续费真爱团'+that.openTime+'个月！');
						$("#lt_fanhui_btn").click();
					}else if(result == -3){
						// showSimplePanel('余额不足！');
						chargePop();
					}else if(result == -4){
						showSimplePanel('购买不能超过1年！');
					}else{
						// 续费失败
						console.log('续费失败');
						showSimplePanel('续费失败！');
					}
				});
			}
		});
		$("#lt_fanhui_btn").bind("click", function(){
			$("#lt_xufei_btn").attr("data-status", 1);
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
				token: _ivp.token,
				roomId: _ivp.roomId
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				var result = res.result;
				if(result == 0){
					// 0:未设置,1:审核中，2：已审核通过（未过1月有效期），3：已通过（已过1月修改期）
					that.setNameStatus = res.setNameStatus;
					// 下次可修改时间
					that.nextTime = res.nextTime;
					that.loveName = res.loveName == null ? '无' : res.loveName;
					if(res.isOpen == 1 || _ivp.auth == 1){
						that.roomLoveInfo(function(){
							$(".lt_container").show();
						});
						that.endTime = res.endTime.replace(/-/ig, '/');
						var html = fm('有效期至 <span class="lt_c2">{}</span>',
							moment(new Date(that.endTime)).add(1, 'M').format("YYYY-MM-DD HH:mm"));
						$("#lt_great_date").html(html);
					}else{
						$("#lt_name").html('[<i class="lt_c1">'+that.loveName+'</i>]');
						$(".lt_container").show();
					}
				}
				that.__ii1 = 2;
			}
		});
	},
	openAndRenew: function(n, cb){
        var that = this;
		if(that.__ii4 == 1) return;
		that.__ii4 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/openAndRenew",
			data: {
				token: _ivp.token,
				emceeId: _ivp.hostId,
                month: n
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii4 = 2;
				if ((typeof cb) == "function") {
					cb(res);
				}
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
				token: _ivp.token,
				roomId: _ivp.roomId
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				var result = res.result;
				if(result == 0){
					$("#lt_xufei_btn, #lt_mine_info, #lt_task_wrap").show();
					$("#lt_open_btn, #lt_privilege_wrap, #lt_foot_open").hide();
					var temp1 = '我的真爱值 <span class="lt_c2">{}</span> <span class="lt_lv">lv{}</span>';
					var html1 = fm(temp1, res.loveNum, res.loveLv);
					$(".lt_mine_value").html(html1);
					$("#lt_team_rank_btn").html('团排名'+(res.loveRank == "" ? '100+' : res.loveRank)+' <i class="lt_arrow1"></i>');
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
				if ((typeof cb) == "function") {
					cb(data);
				}
				showSimplePanel("关注成功!");
			}else if(data == "1") {
				showSimplePanel("您已经关注过!");
			}
		}, 'text');
	},
	ltNameSetting: function(){
		var that = this;
		var lt_input_text = $(".lt_input_text");
		var lt_common_btn1 = $(".lt_common_btn1");
		var setNameStatus = that.setNameStatus;
		if(setNameStatus == 0){}else if(setNameStatus == 1){
			lt_input_text.val(that.loveName).attr("disabled", "disabled");
			lt_common_btn1.html('审核中').addClass("lt_common_btn2").removeClass("lt_common_btn1");
		}else if(setNameStatus == 2){
			lt_input_text.val(that.loveName).attr("disabled", "disabled");
			var btnTxt = moment(new Date(that.endTime.replace(/-/ig, '/'))).format("MM月DD日");
			lt_common_btn1.html(btnTxt + '后才可以重新修改').addClass("lt_common_btn2").removeClass("lt_common_btn1");
			lt_common_btn1.css({
				"font-size": "12px",
				"letter-spacing": 0
			});
		}else if(setNameStatus == 3){
			lt_input_text.val(that.loveName);
		}
		showDivPanel('lt_panel_common');
	},
	loveteamRank: function(cb){
		var that = this;
		if(that.__ii3 == 1) return;
		that.__ii3 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/loveRank",
			data: {
				token: _ivp.token,
				emceeId: _ivp.hostId,
				pageNo: 1//翻页
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii3 = 2;
				var result = res.result;
				if(result == 0){
					var list = res.list;
					var temp = '<div class="lt_mem_line clear">'
						+'<span class="lt_attention{} right noSelect" data-emceeId="{}">{}</span>'
						+'<a href="{}{}" onclick="if(_ivp.auth === 1){return false;}" target="_blank">'
						// +'<span class="lt_attention1 right noSelect" data-emceeId="10011">+关注</span>'
						+'<span class="lt_n_common lt_n{} left">{}</span>'
						+'<div class="lt_mem_pic left"><img src="{}" class="lt_mem_avatar"></div>'
						+'<div class="lt_mem_info">'
							+'<p>{}的真爱团</p>'
							+'<p>真爱值 <span class="lt_c2">{}</span></p>'
						+'</div>'
						+'</a>'
					+'</div>';
					var html = '';
					for(var i = 0; i < list.length; i ++){
						// getUserAvatar
						html += fm(temp,
							list[i].isFollow, list[i].emceeId, list[i].isFollow == 0 ? '+关注' : '已关注',
							liveHost, list[i].emceeId,
							i+1, i+1,
							getUserAvatar(list[i].avatar), list[i].nickname, list[i].loveNum);
					}
					$("#lt_panel_scroll").find(".overview").html(html);
					var loveInfo = res.loveInfo;
					var temp1 = '<span class="lt_n_common lt_n{} left">{}</span>'
						+'<div class="lt_mem_pic left"><img src="{}" class="lt_mem_avatar"></div>'
						+'<div class="lt_mem_info">'
							+'<p>{}的真爱团 真爱值 <span class="lt_c2">{}</span></p>'
							+'<p style="color: #736eab;">超越前一名，真爱值需提升 {}</p>'
						+'</div>';
					loveInfo.rank = loveInfo.rank == '100+' ? '100' : loveInfo.rank;
					var html1 = fm(temp1, loveInfo.rank, loveInfo.rank, getUserAvatar(loveInfo.avatar), loveInfo.nickname, loveInfo.loveNum, loveInfo.needNum);
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
	},
	loveteamMemRank: function(cb, rankType){
		var that = this;
		if(that.__ii5 == 1) return;
		that.__ii5 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/loveMemberRank",
			data: {
				token: _ivp.token,
				emceeId: _ivp.hostId,
				rankType: rankType
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii5 = 2;
				var result = res.result;
				if(result == 0){
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
						// getUserAvatar
						html += fm(temp, liveHost, list[i].userId, i+1, i+1, getUserAvatar(list[i].avatar), list[i].nickname, list[i].loveNum);
					}
					if(html == ""){
						html =  '<p style="text-align: center;">暂时无人上榜</p>';
					}
					$("#lt_panel_scroll").find(".overview").html(html);
					var loveInfo = res.loveInfo;
					var temp1 = '<span class="lt_n_common lt_n{} left">{}</span>'
						+'<div class="lt_mem_pic left"><img src="{}" class="lt_mem_avatar"></div>'
						+'<div class="lt_mem_info">'
							+'<p>{} 真爱值 <span class="lt_c2">{}</span></p>'
							+'<p style="color: #736eab;">超越前一名，真爱值需提升 {}</p>'
						+'</div>';
					loveInfo.rank = loveInfo.rank == '100+' ? '100' : loveInfo.rank;
					var html1 = fm(temp1, loveInfo.rank, loveInfo.rank, getUserAvatar(loveInfo.avatar), loveInfo.nickname, loveInfo.loveNum, loveInfo.needNum);
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

function dataLength(fData) 
{ 
    var intLength=0 
    for (var i=0;i<fData.length;i++) 
    { 
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)) 
            intLength=intLength+2 
        else 
            intLength=intLength+1    
    } 
    return intLength 
}