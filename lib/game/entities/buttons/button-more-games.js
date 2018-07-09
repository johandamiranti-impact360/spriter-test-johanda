ig.module('game.entities.buttons.button-more-games')
.requires(
	'game.entities.buttons.button'
	,'plugins.clickable-div-layer'
)
.defines(function() {
	EntityButtonMoreGames = EntityButton.extend({
		type:ig.Entity.TYPE.A,
		gravityFactor:0,
		// logo: new ig.AnimationSheet('media/graphics/sprites/btn_more_games.png',64,66),
		size:{x:100,
			y:100,
		},
		buttonScale:1,
		zIndex: 75,
		clickableLayer:null,
		link:null,
		newWindow:false,
		div_layer_name:"more-games",
		name:"moregames",
		alpha:1,
		enabled:true,
		img:new ig.Image('media/graphics/sprites/button/btn-more.png'),
		init:function(x,y,settings){
			this.parent(x,y,settings);

            //ig.soundHandler.unmuteAll(true);
            
			if(ig.global.wm)
			{
				return;
			}
			
			if(settings.div_layer_name)
			{
				//console.log('settings found ... using that div layer name')
				this.div_layer_name = settings.div_layer_name;
			}
			else
			{
				this.div_layer_name = 'more-games'
			}
			
			// result = this.collision.polyPoint(s, p.x, p.y);

			if(_SETTINGS.MoreGames.Enabled)
			{
				// this.anims.idle = new ig.Animation(this.logo,0,[0], true);
				// this.currentAnim = this.anims.idle;
				
				if(_SETTINGS.MoreGames.Link)
				{
					this.link=_SETTINGS.MoreGames.Link;
				}
				if(_SETTINGS.MoreGames.NewWindow)
				{
					this.newWindow = _SETTINGS.MoreGames.NewWindow;
				}
				
			}
			else
			{
				this.kill();
			}	
			// this.vertices=[
			// 	{x:this.pos.x+0+this.posImageOffset.x,y:this.pos.y+98+this.posImageOffset.y},
			// 	{x:this.pos.x+30+this.posImageOffset.x,y:this.pos.y+48+this.posImageOffset.y},
   //          	{x:this.pos.x+223+this.posImageOffset.x,y:this.pos.y+0+this.posImageOffset.y},
   //          	{x:this.pos.x+194+this.posImageOffset.x,y:this.pos.y+50+this.posImageOffset.y}
			// ];
			// this.SAT=this.getSAT();

			
		},

		// getSAT: function() {
		// 	this.vertices=[
		// 		{x:this.pos.x+0+this.posImageOffset.x,y:this.pos.y+98+this.posImageOffset.y},
		// 		{x:this.pos.x+30+this.posImageOffset.x,y:this.pos.y+48+this.posImageOffset.y},
  //           	{x:this.pos.x+223+this.posImageOffset.x,y:this.pos.y+0+this.posImageOffset.y},
  //           	{x:this.pos.x+194+this.posImageOffset.x,y:this.pos.y+50+this.posImageOffset.y}
		// 	];
		// 	return new ig.SAT.Shape( this.vertices );
		// },

		doneTween:function(){
			if(_SETTINGS.MoreGames.Enabled)
			{
				this.clickableLayer = new ClickableDivLayer(this);
			}
			else
			{
				this.kill();
			}
		},

		draw:function()
		{
			this.parent();
			var ctx=ig.system.context;
			// ctx.save();
			// ctx.drawImage(this.bgImg.data,0,0,this.bgImg.width,this.bgImg.height,
			// 	this.pos.x,this.pos.y,
			// 	this.bgImg.width*this.buttonScale,this.bgImg.height*this.buttonScale);
			// ctx.restore();

			ctx.save();
			ctx.drawImage(this.img.data,0,0,this.img.width,this.img.height,
				this.pos.x,this.pos.y,
				this.img.width*this.buttonScale,this.img.height*this.buttonScale);
			ctx.restore();

		},

        show:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if(elem)ig.domHandler.show(elem);
        },
        hide:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if(elem)ig.domHandler.hide(elem);
        },
		clicked:function()
		{
			
		},
		clicking:function()
		{
			
		},
		released:function()
		{
			
		}
	});
});