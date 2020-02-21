//yyw
var loveteamFile = window.loveteamFile || {};
loveteamFile = {
    init: function(){
        $(".lt_zb_wrap").delegate(".lt_btn2", "click", function(){
            loveteamPanel('是否续费真爱团一个月？', 'loveteam_xufei');
        });
        $(document.body).delegate("#loveteam_xufei", "click", function(){
            console.log("确认续费");
        });
        $(".lt_zb_wrap").delegate(".lt_btn1", "click", function(){
            var _self = $(this);
            var status = _self.attr("data-status");
            if(status == 0){
                _self.attr("data-status", "1");
                _self.html('为Ta代言');
                loveteamPanel('为Ta代言成功');
            }else{
                _self.attr("data-status", "0");
                _self.html('取消佩戴');
                loveteamPanel('取消佩戴成功');
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