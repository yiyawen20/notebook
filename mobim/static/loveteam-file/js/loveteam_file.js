//yyw
var loveteamFile = window.loveteamFile || {};
loveteamFile = {
    init: function(){
        var that = this;
        _ivp.token = _ivp.token || _ivp.imToken;
        $(".lt_zb_wrap").delegate(".lt_btn2", "click", function(){
            that.xufeiBtn = $(this);
            loveteamPanel('是否续费真爱团一个月？', 'loveteam_xufei');
        });
        $(document.body).delegate("#loveteam_xufei", "click", function(){
            // console.log("确认续费");
            // 默认一个月
            var n = 1;
            that.openAndRenew(n, function(res){
                var result = res.result;
                if(result == 0){
                    console.log('续费成功');
                    that.xufeiBtn.parent().find(".lt_endtime").html(res.endTime);
                    showCommonPanel('成功续费真爱团'+n+'个月！<br>有效期至'+res.endTime);
                }else if(result == -3){
                    showCommonPanel('余额不足！');
                    // chargePop();
                }else if(result == -4){
                    showCommonPanel('购买不能超过1年！');
                }else{
                    // 续费失败
                    console.log('续费失败');
                    showCommonPanel('续费失败！');
                }
            }, that.xufeiBtn.attr("data-emceeId"));
        });
        $(".lt_zb_wrap").delegate(".lt_btn1", "click", function(){
            var _self = $(this);
            var status = _self.attr("data-status");
            var emceeId = _self.attr("data-emceeId");
            that.setWearIcon(status, emceeId, function(){
                var otBtn = _self.closest(".lt_zb_kuai").siblings().find(".lt_btn1");
                otBtn.attr("data-status", "1");
                otBtn.html('为Ta代言');
                if(status == 0){
                    _self.attr("data-status", "1");
                    _self.html('为Ta代言');
                    loveteamPanel('取消佩戴成功');
                }else{
                    _self.attr("data-status", "0");
                    _self.html('取消佩戴');
                    loveteamPanel('为Ta代言成功');
                }
            });
        });
        that.loveteamInit();
    },
    loveteamInit: function(){
        var that = this;
		if(that.__ii3 == 1) return;
		that.__ii3 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/userLoveList",
			data: {
				token: _ivp.token
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii3 = 2;
				var result = res.result;
                if(result == 0){
                    var list = res.list;
                    var temp = '<div class="lt_zb_kuai left">'
                        +'<div class="lt_zb_p1 clear">'
                            +'<a href="{}{}" onclick="if(_ivp.auth === 1){return false;}" target="_blank">'
                            +'<div class="lt_zb_pic left"><img src="{}" class="lt_zb_avatar"></div>'
                            +'<div class="lt_zb_info left">'
                                +'<p class="lt_i_t1">{} <span class="lt_lv">lv{}</span></p>'
                                +'<p>主播：<span class="lt_c1">{}</span></p>'
                            +'</div>'
                            +'</a>'
                            +'<span class="lt_btn_common lt_btn1 left noSelect" data-emceeId="{}" data-status="{}">{}</span>'
                        +'</div>'
                        +'<div class="lt_zb_p2 clear">'
                            +'<span class="lt_btn_common lt_btn2 right noSelect" data-emceeId="{}">续  费</span>'
                            +'<p>我的真爱值 <span class="lt_c1">{}</span> &nbsp;&nbsp;&nbsp;&nbsp;到期 <span class="lt_c1 lt_endtime">{}</span></p>'
                        +'</div>'
                    +'</div>';
                    var html = '';
                    for(var i=0; i<list.length; i++){
                        html += fm(temp,
                            liveHost, list[i].emceeId,
                            getUserAvatar(list[i].avatar),
                            list[i].loveName == "" ? "无" : list[i].loveName,
                            list[i].loveLv,
                            list[i].nickname,
                            list[i].emceeId,
                            list[i].isWear == 1 ? 0 : 1,
                            list[i].isWear == 1 ? '取消佩戴' : '为Ta代言',
                            list[i].emceeId,
                            list[i].loveNum,
                            list[i].endTime);
                    }
                    if(html == ""){
                        html =  '<p style="text-align: center;">未开通真爱团</p>';
                    }
                    $("#lt_zb_list").html(html);
                }
            }
        });
    },
    openAndRenew: function(n, cb, emceeId){
        var that = this;
		if(that.__ii1 == 1) return;
		that.__ii1 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/openAndRenew",
			data: {
				token: _ivp.token,
				emceeId: emceeId,
                month: n
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii1 = 2;
				if ((typeof cb) == "function") {
					cb(res);
				}
            }
        });
    },
    setWearIcon: function(type, emceeId, cb){
        var that = this;
		if(that.__ii2 == 1) return;
		that.__ii2 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/setWearIcon",
			data: {
				token: _ivp.token,
				emceeId: emceeId,
                type: type
			},
			dataType: "jsonp",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii2 = 2;
				var result = res.result;
                if(result == 0){
                    if ((typeof cb) == "function") {
                        cb();
                    }
                }else{
                    // 设置失败
                    loveteamPanel('为Ta代言失败');
                }
            }
        });
    }
};

function loveteamPanel(content, id){
	if($("#common_panel").length){
		$("#common_panel").remove();
	}
	var html = '<div class="pop-cost" id="common_panel" style="display: none">'
		 + '<p class="cost-title"><i>提 示</i><i class="close"><a href="javascript:void(0);" onclick="closeDivPanel(\'common_panel\');return false;"><img src="'+IMI.fileBaseUrl+'/style/img/close.png" width="24" height="24"></a></i></p>'
		 + '<div class="cost-font">'
		 + '<p class="serve" style="margin-left:0px; color:#000;">'
		 + '<i>'+content+'</i>'
		 + '</p>'
		 + '</div>'
		 + '<p class="submit-a"><a href="javascript:void(0);" onclick="closeDivPanel(\'common_panel\');return false;" id="'+id+'"><img src="'+IMI.fileBaseUrl+'/style/img/pop-sure.gif" width="165" height="32"></a>&emsp;</a></p>'
		 + '</div>';
	$(document.body).append(html);
	showDivPanel('common_panel');
}