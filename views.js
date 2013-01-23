var ViewsNavigator = {
	
	views:{},
	currentView:null,
	
	init:function()
	{
		this.hideViews();
	},
	
	go:function(id)
	{
		if (this.views[id] == null) return;
		this.hideViews ();
		this.views[id].style.display = "block";
	},
	
	add:function(id)
	{
		var view = document.getElementById(id);
		this.views[id] = view;
	},
	
	hideViews:function ()
	{
		for (var i in this.views)
		{
			this.views[i].style.display = "none";
		}
	}
}