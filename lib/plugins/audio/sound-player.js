ig.module(
	'plugins.audio.sound-player'
)
.defines(function(){
	SoundPlayer = ig.Class.extend({
		
		tagName:"SoundPlayer",
		muteFlag:false,
        debug:false,
		init: function(list,options) {
            if(this.debug)
            {
                console.log(this.tagName);
            }
		},
		play:function(id){
            if(this.debug)
            {
			    console.log("play sound ",id);
            }
		},
		stop:function(id){
            if(this.debug)
            {
			    console.log("stop sound ")
            }
		},
		
		volume:function(value){
            if(this.debug)
            {
			console.log("set volume");
            }
		},
		mute:function(option){
            if(this.debug)
            {
			    console.log("mute");
            }
			if(typeof(option) === "undefined")
			{
				this.muteFlag=true;
			}
			else
			{
				if(option.flagChange)
				{
					this.muteFlag=true;
				}
			}
			
		},
		unmute:function(option){
            if(this.debug)
            {
			    console.log("unmute");
            }
			if(typeof(option) === "undefined")
			{
				this.muteFlag=false;
			}
			else
			{
				if(option.flagChange)
				{
					this.muteFlag=false;
				}
			}
		}
	
	});
});