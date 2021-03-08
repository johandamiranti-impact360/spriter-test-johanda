ig.module('game.entities.gamecontrol')
.requires(
	'impact.entity',
	'plugins.spriter.spriter-display',
    'plugins.spriter.scml'
)
.defines(function() {
    EntityGameController = ig.Entity.extend({
        zIndex:99999,
        size:new Vector2(20,20),
        testEnt:null,
        tween:null,
		//initialize scml, make sure to put it on class declaration (not inside function) 
      //so it’s picked up by impactjs loader.
        scml: new SpriterScml("media/graphics/lancer.scml"),
		
        init:function(x,y,settings){
            this.parent(x,y,settings);
            if(!ig.global.wm){
                
                // alias 
                ig.game.gameControl = this;
                
                ig.game.spawnEntity(ig.FullscreenButton, 5, 5, { 
                    enterImage: new ig.Image("media/graphics/misc/enter-fullscreen-transparent.png"), 
                    exitImage: new ig.Image("media/graphics/misc/exit-fullscreen-transparent.png") 
                });
				
				//spawn display entity
				ig.game.sDisplay = ig.game.spawnEntity(SpriterDisplay, 500, 500, { scml: this.scml });
				//play run animation
				ig.game.sDisplay.setAnimationByName("run");

            }    
            
        },
      
        update:function(){
            this.parent();
            
            // console.log(this.tween._currentElapsed);
            
            // console.log(this.testEnt.pos);
        },
        draw:function(){
            this.parent();
           
        },
    });
});