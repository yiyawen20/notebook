//yyw
var loveteamFile = window.loveteamFile || {};
loveteamFile = {
    init: function(){
        var that = this;
        that.quickNav();
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
	}
};
