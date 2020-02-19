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
		// showSimplePanel("提示内容");

		var _div1 = $("#lt_fanhui_btn, #lt_privilege_wrap, #lt_foot_open, #lt_great_date");
		var _div2 = $("#lt_mine_info, #lt_task_wrap");
		$("#lt_xuefei_btn").bind("click", function(){
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
					if(res.isOpen == 1){
						that.roomLoveInfo(function(){
							$(".lt_container").show();
						});
						that.endTime = res.endTime;
						var html = fm('有效期至 <span class="lt_c2">{}</span>',
							moment(new Date(res.endTime)).add(1, 'M').format("YYYY-MM-DD HH:mm"));
						$("#lt_great_date").html(html);
						console.log(res.endTime, moment(new Date(res.endTime)).add(3, 'M').format("YYYY-MM-DD HH:mm"));
					}else{
						$("#lt_name").html('[<i class="lt_c1">'+res.loveName+'</i>]');
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
					$("#lt_xuefei_btn, #lt_mine_info, #lt_task_wrap").show();
					$("#lt_open_btn, #lt_privilege_wrap, #lt_foot_open").hide();
					var temp1 = '<p class="lt_mine_value">我的真爱值 <span class="lt_c2">{}</span> <span class="lt_lv">lv{}</span></p>'
						+'<div class="lt_ch1 clear">'
							+'<span class="lt_btn2 left">团排名{} <i class="lt_arrow1"></i></span>'
							+'<span class="lt_btn2 right">团成员{} <i class="lt_arrow1"></i></span>'
						+'</div>';
					var html1 = fm(temp1, res.loveNum, res.loveLv, res.loveRank, res.memberNum);
					$("#lt_mine_info").html(html1);

					if(_ivp.auth == 1){
						$("#lt_mine_info").find("p:first").hide();
						$("#lt_xuefei_btn").hide();
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

					$("#lt_name").html('[<i class="lt_c1">'+res.loveName+'</i>]');
					if ((typeof cb) == "function") {
						cb();
					}
				}
				that.__ii2 = 2;
			}
		});
	}
}