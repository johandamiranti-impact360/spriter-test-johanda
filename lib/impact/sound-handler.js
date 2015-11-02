/**
 *  SoundHandler
 *
 * In order to play sounds and have better control over all music and sound assets throughout
 * Jukebox settings are still done in jukebox.js
 * 
 * play example: ig.soundHandler.playSound(ig.soundHandler.SOUNDID.kittyopeningSound);
 *
 *
 *
 *  Created by Justin Ng on 2014-08-19.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('impact.sound-handler')
.requires(
)
.defines(function () {

    ig.SoundHandler = ig.Class.extend({
		formats:{
			ogg:".ogg",
			mp3:".mp3",
		},
		jukebox:null,
				
		pausePosition:null,
		globalMute:false,
		
		forceMuted:false,
		muted:false,
		bgmStarted: false,
		bgmPlaying:false,
		soundPlaying:false,
		currentSoundPlaying:null,
		
		soundBuffer:[],
		voSoundLoaded:[],
		sfxSoundLoaded:[],
		
		SOUNDID:{},
		
		voSoundsToLoad:[
		],
		
		/**
		* Define your sounds here
		* Add the sounds of mp3 and ogg using howler
		* the name is the given id of the sound which will be stored in SOUNDID of this handler class
		*/
		sfxSoundsToLoad:[
			{name:"staticSound", path:"media/audio/play/static"},
			{name:"openingSound", path:"media/audio/opening/opening"},
			{name:"kittyopeningSound", path:"media/audio/opening/kittyopening"}
		],		
		debug:false,
		
        init:function() 
		{
			//Setups all the sounds
			//Define your setup of sounds here
			//Make sure to turn on the relevent settings here
			if(ig.ua.mobile) //mobile
			{
				this.initSfx();
				//this.initVoSfx();
				this.setupJukebox();
			}
			else//Desktop
			{
				this.initSfx();
				//this.initVoSfx();
				this.setupDesktopMusic();
			}
					
			this.setupWindowHandler();
        },
		
		//Checking for loading of all vo sounds
		allVoSoundLoaded:function()
		{
			if(this.voSoundLoaded.length >= this.voSoundsToLoad.length)
			{
				if(this.debug)
				{
					console.log("Vo ready");
				}
				for(index=0;index<this.voSoundLoaded.length;index++)
				{
					this.voSoundLoaded[index].on("end",function()
											{
												//Prevents double playing means can double check the sound playing
												//Its possible to remove and customize. Up to each individual developer
												arguments[0].isPlaying = false;
												this.soundBuffer.pop();
												//console.log("end " + this.soundBuffer.length);
											}.bind(this,this.voSoundLoaded[index])
									);
					this.voSoundLoaded[index].on("play",function()
											{
												//console.log("play " + this.soundBuffer.length);
												arguments[0].isPlaying = true;
											}.bind(this,this.voSoundLoaded[index])
									);
				}
				return true;
			}
			else
			{
				//console.log("Vo not ready: Loaded only:" + this.voSoundLoaded.length +" / "+this.voSoundsToLoad.length);
				return false;
			}
		},
		
		//Checking if all SFX sounds are loaded
		allSfxSoundLoaded:function()
		{
			if(this.sfxSoundLoaded.length >= this.sfxSoundsToLoad.length)
			{
				return true;
			}
			else
			{
				return false;
			}
		},	
		
		stopBackgroundMusic:function()
		{			
			if(!ig.ua.mobile)
			{
				ig.music.pause();
			}
			else
			{
				// STOPPING JUKEBOX DOESN'T WORK ON DEVICE. WE USE PAUSE INSTEAD
				this.pausePosition = this.jukebox.player.pause();
			}
			
			this.bgmPlaying = false;
		},
		
		playBackgroundMusic:function()
		{
			if(this.bgmPlaying) return;
			
			this.bgmStarted = true;			
			if(!ig.ua.mobile)
			{
				ig.music.play();
			}
			else
			{
				if(this.pausePosition) this.jukebox.player.resume(this.pausePosition);
				else this.jukebox.player.play(this.jukebox.player.settings.spritemap.music.start,true);
			}
			this._unMuteBackgroundMusic();
			
			this.bgmPlaying = true;		
		},

		/**
		* Helper function to play sounds
		* @params ID, the id defined as the name and is the ID stored in attribute SOUNDID
		* play sound example:
		* ig.soundHandler.playSound(ig.soundHandler.SOUNDID.kittyopeningSound);
		* heck you can even chuck the parameter an ID that you know as a string but its up to you
		*/
		playSound:function(id)
		{
			var voToPlay = this[id];
			if(voToPlay)
			{
				//console.log("play sound:" + id);
				if((!this.forceMuted
					|| !this.muted))
				{
					if(!voToPlay.isPlaying) // check if sound has not been played // you can remove this if you need multiple sounds to come out in sequence
					{
						this.soundBuffer.push(voToPlay);
						voToPlay.play();
					}
				}
			}
		},
		
		/**
		* this stops whatever sounds that is playing and plays the sound with the given id
		*/
		stopAllAndPlaySound:function(id)
		{
			this.stopAllSounds();
			this.playSound(id);
		},
		
		/**
		* Stops all sounds from playing provided they are in the buffer
		*/
		stopAllSounds:function()
		{
			for(index=0;index<this.soundBuffer.length;index++)
			{
				this.soundBuffer[index].isPlaying = false;
				this.soundBuffer.splice(0,1)[0].stop();
			}
		},
		
		/**
		* @Params
		* id: the id to give this sound sprite
		* soundPath: the sound path without the format, normally loads mp3 and ogg
		* onLoadFn: optional, on load function if you want to do fancy stuff when the sound on loads or for pre loading check purposes
		* voice: boolean to determine if its voice
		*
		**/
		addSound:function(id,soundPath,onLoadFn)
		{
			var pathOgg = soundPath+this.formats.ogg;
			var pathMp3 = soundPath+this.formats.mp3;
			this.SOUNDID[id]= id;
			if(onLoadFn)
			{
				this[id] = new Howl({urls:[pathOgg,pathMp3],onload:onLoadFn});
			}
			else
			{
				this[id] = new Howl({urls:[pathOgg,pathMp3]});
			}
		},
		/* Old Yew Meng's fix, has been replaced but if things don't work out can always try this function again replacing the force bgm loop in main.js
		replayIfPause:function()
		{
			//BGM looping fix for mobile 
			if(ig.ua.mobile) 
			{
				if(this.jukebox) 
				{
					if(this.jukebox.player) 
					{
						for (var s in this.jukebox.player.settings.spritemap) 
						{
							if( this.jukebox.player.getCurrentTime() <=
								(this.jukebox.player.settings.spritemap[s].end 
									//- this.jukebox.player.settings.timeout/1000
								 ) 
							)
							{	
								//console.log(this.jukebox.player.getCurrentTime());
								//continue;
							}
							else 
							{
								this.jukebox.player.pause();
								//this.setupJukebox();
								this.jukebox.player.resume(this.jukebox.player.settings.spritemap[s].start);
							}
						}
					}
				}
			}
		},
		*/
		
		/**
		* Mute all the sounds
		* this is just a helper function for the mute()
		* this does not touch bgm
		*/
		_muteSounds:function()
		{	
			for(i=0;i<ig.resources.length;i++)
			{
				if(ig.resources[i].multiChannel)
				{
					ig.resources[i].stop();
				}
			}
			Howler.mute();
			if(this.debug)
			{
				console.log('Sounds muted');
			}
			
		},
		
		/**
		* unmute all the sounds
		* this is just a helper function for unmute()
		* this does not touch bgm
		*/
		_unMuteSounds:function()
		{
			Howler.unmute();
			ig.Sound.enabled = true;
			if(this.debug)
			{
				console.log('Sounds can play');
			}
			
		},
		
		/**
		* Mute BGM
		* this is just a helper function for the mute()
		* this does not touch SFXs
		*/
		_muteBackgroundMusic:function()
		{	
			if(!ig.ua.mobile)
			{
				ig.music.volume = 0;
			}
			else
			{
				// STOPPING JUKEBOX DOESN'T WORK ON DEVICE. WE USE PAUSE INSTEAD
				this.stopBackgroundMusic();
				this.jukebox.player.setVolume(0);
			}
			if(this.debug)
			{
				console.log('BGM muted');
			}
			this.bgmPlaying=false;
			
		},
		
		/**
		* unmute BGM
		* this is just a helper function for unmute()
		* this does not touch SFXs
		*/
		_unMuteBackgroundMusic:function()
		{
			if(!this.bgmStarted) return;
			
			if(!ig.ua.mobile)
			{
				ig.music.volume = 1;
			}
			else
			{
				if(this.pausePosition) this.jukebox.player.resume(this.pausePosition);
				else this.jukebox.player.play(this.jukebox.player.settings.spritemap.music.start,true);
				this.jukebox.player.setVolume(1.00);
			}
			if(this.debug)
			{
				console.log('BGM can play');
			}
			this.bgmPlaying=true;
		},
		
		/**
		* the focus blur mute and unmute relies on a force muted check to return to the state after focus and blur of windows
		*/
		focusBlurMute:function()
		{
			if(!this.forceMuted)
			{
				this.mute();
			}
		},
		
		focusBlurUnmute:function()
		{
			if(!this.forceMuted)
			{
				this.unmute();
			}
		},
		
		/**
		* if you want to force mute the sounds and music that even on blur and focus won't turn the sound back on
		* @params bool the boolean true/false on whether to be forced into mute state or not
		*/
		setForceMuted:function(bool)
		{
			this.forceMuted = bool;
		},
		
		mute:function()
		{
			if(this.muted) return;
			
			this._muteSounds();
			this._muteBackgroundMusic();
			
			this.muted = true;		
		},
		
		unmute:function()
		{
			if(!this.muted) return;
			
			this._unMuteSounds();
			this._unMuteBackgroundMusic();
			
			this.muted = false;
		},
		
		/**
		*  The window blur and focus events have been placed here so you can control it better
		*/
		setupWindowHandler:function()
		{
			if(getQueryVariable('webview')==='true')
			{
				$(window).focus(function() 
				{
					if(ig.ua.mobile && ig.game) ig.game.resumeGame();
					if(ig.soundHandler) ig.soundHandler.focusBlurUnmute(); 
				});

				$(window).blur(function() 
				{
					if(ig.soundHandler)ig.soundHandler.focusBlurMute();
				});
			}
			else
			{
				window.onfocus = function() 
				{
					if(ig.ua.mobile&& ig.game) ig.game.resumeGame();
					if(ig.soundHandler) ig.soundHandler.focusBlurUnmute(); 
				};
				window.onblur = function() 
				{
					if(ig.soundHandler)ig.soundHandler.focusBlurMute();
				};
			}
		},
		
		/**
		* adds the SFX in the sfxSoundLoaded list
		*/		
		initSfx: function()
		{
			//function(){}.bind(Represented object known as this, arguments)
			for(index=0;index<this.sfxSoundsToLoad.length;index++)
			{
				var onLoadFn=function(){
					
					//console.log(arguments[0].name);
					this.sfxSoundLoaded.push(this[arguments[0]]);
				}.bind(this,this.sfxSoundsToLoad[index].name);
				
				this.addSound(this.sfxSoundsToLoad[index].name,this.sfxSoundsToLoad[index].path,onLoadFn);
			}
		},
		
		initVoSfx:function()
		{
			for(index=0;index<this.voSoundsToLoad.length;index++)
			{
				var onLoadFn=function(){
						//console.log(arguments[0].name);
						this.voSoundLoaded.push(this[arguments[0]]);
					}.bind(this,this.voSoundsToLoad[index].name);
				
				this.addSound(this.voSoundsToLoad[index].name,this.voSoundsToLoad[index].path,onLoadFn);
				
				//this.addSound(this.voSoundsToLoad[index].name,this.voSoundsToLoad[index].path,function(){this.voSoundLoaded.push(this[this.voSoundsToLoad[index].name])}.bind(this.voSoundsToLoad[index]));
			}
		},
		
		//Desktop music is setup here
		setupDesktopMusic:function()
		{
			ig.music.add('media/audio/background.*', 'background');	
			
		},
		
		setupJukebox:function()
		{
			if(ig.ua.mobile)
			{
				this.jukebox = new ig.Jukebox();//the music file is set in the jukebox.js
				this.pausePosition = this.jukebox.player.settings.spritemap.music.start;
			}			
		},
		
		forceLoopBGM:function()
		{
			if(!ig.ua.winPhone)
			{
				return;
			}
			if(!this.forceMuted && this.bgmPlaying)
			{
				if(this.jukebox)
				{
					if(this.jukebox.player)
					{
						// all
						if(this.jukebox.player.settings.spritemap.music && this.jukebox.player.settings.spritemap.music.loop)
						{
							if(this.prevTime>=0) {
								if(this.jukebox.player.getCurrentTime() === this.prevTime) {	// music pointer is not moving
									if(!this.silentCounter) this.silentCounter = 0;
									this.silentCounter++;

									if(this.jukebox.player.getCurrentTime() >= this.jukebox.player.settings.spritemap.music.end || this.silentCounter > 0.001*ig.soundHandler.jukebox.player.settings.timeout*ig.system.fps) {	// pointer exceed end of music OR pointer is idle for 1 cycle
										// music not playing
										this.jukebox.player.pause();
										this.jukebox.player.play(this.jukebox.player.settings.spritemap.music.start, true);
										this.silentCounter = null;
									}
								}
								else {
									this.silentCounter = null;	// reset silent counter, since the music is playing
								}
							}
							this.prevTime = this.jukebox.player.getCurrentTime();
						}
					}
				}
			}
		}
    
    });

});

// PageVisibility API: START
// for mobile "HOME"/"POWER" button - mute/unmute audio when page is hidden/visible
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    
    return document[prop];
}

// use the property name to generate the prefixed event name
var visProp = getHiddenProp();
if (visProp) {
  var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
  document.addEventListener(evtname, visChange);
}

// in case PageVisiblity is failed, try page show/hide event
window.addEventListener("pagehide", function(evt){
	if(ig.soundHandler)ig.soundHandler.focusBlurMute();
}, false);
window.addEventListener("pageshow", function(evt){
	if(ig.ua.mobile && ig.game) ig.game.resumeGame();
	if(ig.soundHandler) ig.soundHandler.focusBlurUnmute(); 
}, false);

function visChange() {
    if (isHidden()) {
    	if(ig.soundHandler)ig.soundHandler.focusBlurMute();
    }
    else {
		if(ig.ua.mobile && ig.game) ig.game.resumeGame();
		if(ig.soundHandler) ig.soundHandler.focusBlurUnmute(); 
    }
}
// PageVisibility API: END