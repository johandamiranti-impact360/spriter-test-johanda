ig.module('game.entities.text-stroke')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityTextStroke = ig.Entity.extend({
		fontSize:20,
		text:"",
		align:"center",
            zIndex:75,
            lineWidth1:3,
            lineWidth2:8,
		init:function(x,y,settings){
			this.parent(x,y,settings);
		},
		draw:function()
		{
			this.parent();
                  var ctx=ig.system.context;
                  ctx.save();
                  ctx.strokeStyle = "#000000";
                  ctx.lineWidth=this.lineWidth2;
                  ctx.font = (this.fontSize) + "px" + " franks";
                  if(this.align=="center")
                  {
                  	ctx.strokeText(this.text, this.pos.x-(ig.system.context.measureText(this.text).width/2), this.pos.y);   
                  }
                  else 
                  	ctx.strokeText(this.text, this.pos.x, this.pos.y);           
                  ctx.restore();

                  ctx.save();
                  ctx.strokeStyle = "#FFDA00";
                  ctx.font = (this.fontSize) + "px" + " franks";
                  ctx.lineWidth=this.lineWidth1;
                   if(this.align=="center")
                  {
                  	ctx.strokeText(this.text, this.pos.x-(ig.system.context.measureText(this.text).width/2), this.pos.y);   
                  }
                  else 
                  	ctx.strokeText(this.text, this.pos.x, this.pos.y);             
                  ctx.restore(); 

                  ctx.save();
                  ctx.fillStyle = "#F45197";
                  ctx.font = (this.fontSize) + "px" + " franks";
                  if(this.align=="center")
                  {
                  	ctx.fillText(this.text, this.pos.x-(ig.system.context.measureText(this.text).width/2), this.pos.y);   
                  }
                  else 
                  	ctx.fillText(this.text, this.pos.x, this.pos.y);             
                  ctx.restore();
		}
	});
});