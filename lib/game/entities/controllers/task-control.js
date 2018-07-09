ig.module('game.entities.controllers.task-control')
.requires(
	'impact.entity',
	'game.entities.buttons.button-image',
	'game.entities.text-stroke',
	'game.entities.games.bg-select'
)
.defines(function() {
	EntityTaskControl = ig.Entity.extend({
		imageBG: new ig.Image('media/graphics/sprites/bg/bg-task.png'),
		zIndex:0,
		numPage:0,

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.btnHome=ig.game.spawnEntity(EntityButtonImage,20,20,{
                pathImage:'media/graphics/sprites/button/btn-home.png',
                clickCallBackContext:this,
                clickCallBack:this.onClickHome,
                name:"btn-home"
            }); 

            this.txtSelect=ig.game.spawnEntity(EntityTextStroke,ig.system.width/2,60,{
                text:_STRINGS.Task.Select,
                zIndex:this.zIndex+2,
                fontSize:40,
                lineWidth1:5,
                lineWidth2:10
            }); 
            
            this.createBGSelect();
            ig.game.sortEntitiesDeferred();
		},

		createBGSelect:function(){
			var pos=[
				{x:313,y:184},
				{x:642,y:184},
				{x:313,y:378},
				{x:642,y:378}
			];
			for(var i=0;i<4;i++)
			{
				var num=i+1+this.numPage*4;
				if(num<=6)
				{	
					ig.game.spawnEntity(EntityBgSelect,pos[i].x-158+20,pos[i].y-93,{
						numBG:num,
						zIndex:this.zIndex+2
					});
				}
			}

		},

		onClickHome:function() {
			 ig.game.director.jumpTo(LevelMainMenu);
		},
		draw:function()
		{
			this.parent();
			this.imageBG.draw(0,0);
		}
	});
});