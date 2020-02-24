//yyw
var loveteamFile = window.loveteamFile || {};
loveteamFile = {
    init: function(){
        var that = this;
        $(".lt_zb_wrap").delegate(".lt_btn2", "click", function(){
            that.xufeiBtn = $(this);
            loveteamPanel('是否续费真爱团一个月？', 'loveteam_xufei');
        });
        $(document.body).delegate("#loveteam_xufei", "click", function(){
            // console.log("确认续费");
            // 默认一个月
            that.openAndRenew(1, function(endTime){
                that.xufeiBtn.parent().find(".lt_endtime").html(endTime);
            });
        });
        $(".lt_zb_wrap").delegate(".lt_btn1", "click", function(){
            var _self = $(this);
            var status = _self.attr("data-status");
            that.setWearIcon(status, function(){
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
    },
    openAndRenew: function(n, cb){
        var that = this;
		if(that.__ii1 == 1) return;
		that.__ii1 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/openAndRenew",
			data: {
				userId: 1,
                roomId: 0,
                month: n
			},
			dataType: "json",
			jsonpCallback : 'callback_' + new Date().getTime(),
			type: 'GET',
			success: function(res) {
				that.__ii1 = 2;
				var result = res.result;
                if(result == 1000){
                    console.log('开通成功');
                    if ((typeof cb) == "function") {
                        cb(res.endTime);
                    }
                }else{
                    // 开通失败
                    console.log('开通失败');
                }
            }
        });
    },
    setWearIcon: function(type, cb){
        var that = this;
		if(that.__ii2 == 1) return;
		that.__ii2 = 1;
		$.ajax({
			url: IMI.masterURL + "realLove/setWearIcon",
			data: {
				userId: 1,
                roomId: 0,
                type: type
			},
			dataType: "json",
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
                    console.log('设置失败');
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