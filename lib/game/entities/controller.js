ig.module('game.entities.controller')
.requires(
    'impact.entity'
)
.defines(function () {
    EntityController = ig.Entity.extend({
        name: 'controller',

        isPaused: false,

        initAnimationIsFinished: false,
    
        init: function (x, y, settings) {
            this.parent(x, y, settings);

            if (!ig.global.wm) {
                ig.game.spawnEntity(EntityPointerSelector,50,50);  
            }

            ig.game.controller = this; 
        },

        update: function(){
            if(!this.isPaused){
                this.parent();
            }            	
        },           

        onPause: function(){
            this.isPaused = true;
        },

        onUnpause: function(){
            this.isPaused = false;
        }
    });

});