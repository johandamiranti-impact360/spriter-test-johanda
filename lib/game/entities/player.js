ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/player.png', 50, 58 ),
		size: {x: 50, y: 58},
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle' , 1, [1] );
			this.addAnim( 'walk' , 1, [0,2,3] );
			//comment
		},
	});
});