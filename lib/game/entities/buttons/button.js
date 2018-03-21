ig.module('game.entities.buttons.button')
.requires(
	'impact.entity',
	'plugins.data.vector'
)
.defines(function() {
	EntityButton = ig.Entity.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		size:new Vector2(48,48),
		fillColor:null,
		zIndex:95000,

		clickedTime: 0,
		
		isClicked: false,
		
		pointer: null,	
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			
			if(!ig.global.wm)
			{
				if(!isNaN(settings.zIndex))
				{
					this.zIndex=settings.zIndex;
				}
			}
			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";

			this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
		},

		update:function(){
			this.parent();

			if(this.isClicked){
				this.clickedTime += ig.system.tick;				
			}

			if(this.clickedTime > 0.5 && this.isClicked){
				this.released();
				this.clickedTime = 0;
				this.isClicked = false;
			}
		},

		clicked:function(){
			
		},
		clicking:function(){
			
		},
		released:function(){
			
		},
		
		textSet: function(pix, col) {
            var ctx = ig.system.context;

            ctx.font = pix + "px supersonic";
			ctx.fillStyle = col;
        },

        textDraw: function(tx, dx, dy) {
            var ctx = ig.system.context;
			
			ctx.textAlign="center"; 
            ctx.fillText(tx, dx, dy);
		},
		
		runClickingTime: function(){			
			this.isClicked = true;
		},
			
		disableClickingTime: function(){			
			this.clickedTime = 0;
			this.isClicked = false;
		}		
		
	});
});