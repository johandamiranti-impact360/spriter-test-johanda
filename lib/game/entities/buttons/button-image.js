ig.module('game.entities.buttons.button-image')
.requires(
	'game.entities.buttons.button',
	'plugins.data.vector'
)
.defines(function() {
	EntityButtonImage = EntityButton.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		size:new Vector2(39,44),
		fillColor:null,
		zIndex:76,
		img:null,
		// img:new ig.Image('media/graphics/sprites/button/btn-gallery.png'),
		isClicked:false,
		timerPause:10,
		clickCallBack:null,
		clickCallBackContext:null,
		mother:null,
		name:"button-image",
		buttonScale:1,
		imgScale:1,
		offSet:{x:0,y:0},
		bolUpdateSize:false,
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);	
			console.log(this.name+" nma");
			this.img=new ig.Image(settings.pathImage);	
			this.size=new Vector2(this.img.width*this.buttonScale*this.imgScale,this.img.height*this.buttonScale*this.imgScale);
			
			
			// this.size={x:this.img.width.x,y:this.img.height.y};
		},

		draw:function()
		{
			this.parent();
			
			var ctx=ig.system.context;
			ctx.save();
			ctx.drawImage(this.img.data,
				0,0,
				this.img.width,this.img.height,
				this.pos.x+(this.img.width*(1-this.buttonScale)/2),
				this.pos.y+(this.img.height*(1-this.buttonScale)/2),
				this.img.width*this.buttonScale*this.imgScale,
				this.img.height*this.buttonScale*this.imgScale
			);					
			ctx.restore();
			
		},

		update:function()
		{
			this.parent();
			
			if(this.bolUpdateSize==false&&this.img.loaded)
			{
				this.size=new Vector2(this.img.width*this.buttonScale*this.imgScale,this.img.height*this.buttonScale*this.imgScale);
				this.bolUpdateSize=true;
			}

			if(this.isClicked)
			{
				if(this.buttonScale>0.8)
				{
					this.buttonScale-=0.1;
				}
				console.log(this.timerPause+" ad "+this.name);
				this.timerPause--;
				if(this.timerPause==0)
				{
					this.isClicked=false;
					this.clickCallBack.apply(this.clickCallBackContext, []);  
					
					ig.game.tweening=false;
				}
			}
		},

		clicked:function(){
			console.log("clicked ");
			if((this.mother&&this.mother.enabled)||this.mother==null)
			{
				if(ig.game.tweening==false&&this.isClicked==false)
				{
					this.parent();
					ig.game.tweening=true;
					this.isClicked=true;
				}
			}
		},

		clicking:function(){
			
		},
		released:function(){
			
		}

	});
});