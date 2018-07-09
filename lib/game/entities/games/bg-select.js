ig.module('game.entities.games.bg-select')
.requires(
	'impact.entity',
	'plugins.data.vector'
)
.defines(function() {
	EntityBgSelect = ig.Entity.extend({
		img:null,
		size:new Vector2(316*0.9,186*0.9),
		numBG:1,
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.img=new ig.Image('media/graphics/sprites/bg/bg'+settings.numBG+'.png');
			console.log(settings.numBG+" "+this.numBG);
		},
		draw:function()
		{
			this.parent();
			var ctx=ig.system.context;
			// if(this.img.loaded)
			// {

				ctx.save();
				this.createRoundRect(this.pos.x,this.pos.y,this.size.x,this.size.y,10);
				ctx.strokeStyle="#F45197";
				ctx.lineWidth=16;
				ctx.stroke();
				ctx.restore();

				ctx.save();
				this.createRoundRect(this.pos.x,this.pos.y,this.size.x,this.size.y,10);
				ctx.strokeStyle="#000";
				ctx.lineWidth=8;
				ctx.stroke();
				ctx.restore();

				ctx.save();
				this.createRoundRect(this.pos.x,this.pos.y,this.size.x,this.size.y,10);
				ctx.clip();
				ctx.drawImage(this.img.data,0,0,this.img.width,this.img.height,
					this.pos.x,this.pos.y,this.size.x,this.size.y);
				ctx.restore();
			// }
			
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
	});
});