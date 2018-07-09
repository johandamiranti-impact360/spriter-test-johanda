ig.module('game.entities.controllers.main-menu-control')
.requires(
	'impact.entity',
	'game.entities.buttons.button-image',
	'game.entities.buttons.button-more-games'
)
.defines(function() {
	EntityMainMenuControl = ig.Entity.extend({
		imageBG: new ig.Image('media/graphics/sprites/bg/bg-load.png'),
		imageBGBottom: new ig.Image('media/graphics/sprites/bg/bg-bottom.png'),
		imageTitle: new ig.Image('media/graphics/sprites/title.png'),
		posYBG:-200,
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);

			this.btnPlay=ig.game.spawnEntity(EntityButtonImage,(ig.system.width-134)/2,390+200,{
                pathImage:'media/graphics/sprites/button/btn-play.png',
                clickCallBackContext:this,
                clickCallBack:this.onClickPlay,
                name:"btn-play"
            }); 

			this.btnMore=ig.game.spawnEntity(EntityButtonMoreGames,((ig.system.width-134)/2)+150,402+200); 

			this.btnGallery=ig.game.spawnEntity(EntityButtonImage,(ig.system.width-134)/2-125,402+200,{
                pathImage:'media/graphics/sprites/button/btn-gallery.png',
                clickCallBackContext:this,
                clickCallBack:this.onClickPlay,
                name:"btn-gallery"

            }); 

            this.tween({posYBG:0},0.5,{
	            easing:ig.Tween.Easing.Bounce.EaseOut
	        }).start(); 

	        this.tween({
	            btnMore:{pos:{y:402}},
	        }
	        ,0.3
	        ,{
	            onComplete:function()
	                {
	                    this.btnMore.doneTween();
	                }.bind(this),
	             easing:ig.Tween.Easing.Back.EaseOut,
	            delay:0.6
	        }).start(); 

	        this.tween({
	            btnPlay:{pos:{y:390}},
	        }
	        ,0.3
	        ,{
	            easing:ig.Tween.Easing.Back.EaseOut,
	            delay:0.4
	        }).start(); 

	         this.tween({
	            btnGallery:{pos:{y:402}},
	        }
	        ,0.3
	        ,{
	            easing:ig.Tween.Easing.Back.EaseOut,
	            delay:0.8
	        }).start(); 
		},

		draw:function()
		{
			this.imageBG.draw(0,0);
			this.imageBGBottom.draw(0,ig.system.height-this.imageBGBottom.height);
			this.imageTitle.draw((ig.system.width-this.imageTitle.width)/2,40+this.posYBG);

		},

		createRoundRect:function(x,y,w,h,r){
			  if (w < 2 * r) r = w / 2;
			  if (h < 2 * r) r = h / 2;
			  var ctx=ig.system.context;
			  ctx.beginPath();
			  ctx.moveTo(x+r, y);
			  ctx.arcTo(x+w, y,   x+w, y+h, r);
			  ctx.arcTo(x+w, y+h, x,   y+h, r);
			  ctx.arcTo(x,   y+h, x,   y,   r);
			  ctx.arcTo(x,   y,   x+w, y,   r);
			  ctx.closePath();
			  return ctx;
		},

		onClickPlay:function()
		{
			ig.game.director.jumpTo(LevelTask);
		}
	});
});