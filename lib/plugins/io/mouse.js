/*
* Game's gamepad, contains the bindings you wish
*/
ig.module(
	'plugins.io.mouse'
)
.requires(
)
.defines(function(){

	Mouse = ig.Class.extend({
		
		bindings:{
			click:[ig.KEY.MOUSE1]
		},
		init:function()
		{
			// Mouse
			ig.input.initMouse();
			for(var key in this.bindings)
			{
				this[key] = key;
				for(var i = 0;i<this.bindings[key].length;i++)
				{
					ig.input.bind(this.bindings[key][i],key);
				}
			}
		},
		getPos:function()
		{
			if(ig.ua.mobile)
			{
				
				var currentMousePosX = ig.input.mouse.x / ig.sizeHandler.sizeRatio.x;
				var currentMousePosY = ig.input.mouse.y / ig.sizeHandler.sizeRatio.y;
				
				//var currentMousePosX = ig.input.mouse.x;// * ig.sizeHandler.scaleRatioMultiplier.x;
				//var currentMousePosY = ig.input.mouse.y;// * ig.sizeHandler.scaleRatioMultiplier.y;
				
				var y = window.innerHeight/640;
				var x = window.innerWidth/480;
				
				//console.log(ig.sizeHandler.scaleRatioMultiplier.x,ig.sizeHandler.scaleRatioMultiplier.y);
				return new Vector2(currentMousePosX,currentMousePosY);
			}
			else
			{
				var currentMousePosX = ig.input.mouse.x; // multiplierX;
				var currentMousePosY = ig.input.mouse.y; // multiplierY;
			
				return new Vector2(currentMousePosX,currentMousePosY);
			}
		},
	});
});