ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.debug.debug',	
	
	// PLUGINS
	'plugins.splash-loader',
	'plugins.tween',
	'plugins.url-parameters',
	'plugins.jukebox',
	'plugins.director',
	'plugins.impact-storage',
	
	// BRANDING SPLASH
	'plugins.branding.splash',
	
	// BRANDING ENTITIES
	'game.entities.branding-logo-placeholder',
	'game.entities.branding-logo',

	// MORE GAMES
	'game.entities.button-more-games',
	
	// ENTITIES
	'game.entities.opening-shield',
	'game.entities.opening-kitty',
	'game.entities.pointer',
	'game.entities.pointer-selector',
		
	'game.entities.select',
	
	// LEVELS
	'game.levels.opening',
	'game.levels.test-desktop',
	'game.levels.test-mobile'	
)
.defines(function(){	
	this.START_OBFUSCATION;
	this.FRAMEBREAKER;
	MyGame = ig.Game.extend({	
		init: function() {						
			// SERVER-SIDE INTEGRATIONS
			this.setupMarketJsGameCenter();
			
			// BASICS
			//this.initSfx();
			this.setupControls();
			//this.setupDesktopMusic();
			this.setupLocalStorage();									
			this.removeLoadingWheel();
			this.injectMobileLink();
			this.setupURLParameters();
			this.finalize();

		},
		
		setupMarketJsGameCenter:function()
		{
			if(_SETTINGS)
			{
				if(_SETTINGS['MarketJSGameCenter']){				
					if(_SETTINGS['MarketJSGameCenter']['Activator']['Enabled']){
						if(_SETTINGS['MarketJSGameCenter']['Activator']['Position']){
							console.log('MarketJSGameCenter activator settings present ....')
							$('.gamecenter-activator').css('top',_SETTINGS['MarketJSGameCenter']['Activator']['Position']['Top']);
							$('.gamecenter-activator').css('left',_SETTINGS['MarketJSGameCenter']['Activator']['Position']['Left']);
						}				
					}
					$('.gamecenter-activator').show();			
				}else{
					console.log('MarketJSGameCenter settings not defined in game settings')
				}
			}
		},
		
		initSfx: function(){
			//play sfx example   ---    ig.game.staticSound.play(); OLD Version
			//Go to impact/sound-handler.js to adjust
			
				
		},
		
		finalize:function(){
			if(ig.ua.mobile){
				// Special hack
				// $('body').height($('#game').height()+75);
				// sizeHandler();					

				ig.game.showOverlay(['play']);

				// Special hack
				//$('body').height($('#game').height());							
			}else{
				ig.game.startGame();
			}
			sizeHandler();		
		},
		
		injectMobileLink:function(){
			// Inject link 
			$('#play').attr('onclick','ig.game.pressPlay();ig.soundHandler.staticSound.play();')			
		},
		
		removeLoadingWheel:function(){
			// Remove the loading wheel
			try{
				$('#ajaxbar').css('background','none');
			}catch(err){
				console.log(err)
			}			
		},

		showDebugMenu:function(){
			console.log('showing debug menu ...');
			// SHOW DEBUG LINES
			ig.Entity._debugShowBoxes = true;	

			// SHOW DEBUG PANELS	
			$('.ig_debug').show();							
		},
				
		setupLocalStorage:function(){
			this.storage = new ig.Storage();
		},
		
		/* Please head to impact/sound-handler.js
		setupDesktopMusic:function(){
			//ig.music.add('media/sounds/desktop/background.*', 'background');			
		},*/
		
		startGame:function(){	
			this.resetPlayerStats();
								
			// TEST Eg: load level using Director plugin
			if(ig.ua.mobile){
				this.director = new ig.Director(this,[
						LevelOpening,
						LevelTestMobile
				]);										
			}else{
				this.director = new ig.Director(this,[
						LevelOpening,
						LevelTestDesktop
				]);					
			}
			
			// CALL LOAD LEVELS
			if(_SETTINGS['Branding']['Splash']['Enabled']){
				try{
					this.branding = new ig.BrandingSplash();
				}catch(err){
					console.log(err)
					console.log('Loading original levels ...')
					this.director.loadLevel(this.director.currentLevel);
				}					
			}else{
				this.director.loadLevel(this.director.currentLevel);
			}
						
			this.spawnEntity(EntityPointerSelector,50,50);
						
			// MUSIC // Changed to use ig.soundHandler
			ig.soundHandler.playBackgroundMusic();						
		},
		
		/* no longer used since ig.soundHandler handles all sounds and music
		playBackgroundMusic:function(){
			if(ig.ua.mobile){
				if(this.pausePosition){
					ig.game.jukebox.player.resume(this.pausePosition);
				}				
			}else{
				ig.music.play();
			}			
		},
		
		stopBackgroundMusic:function(){
			if(ig.ua.mobile){
				// STOPPING JUKEBOX DOESN'T WORK ON DEVICE. WE USE PAUSE INSTEAD
				this.pausePosition = ig.game.jukebox.player.pause();
			}else{
				ig.music.pause();
			}						
		},
		*/

		fpsCount: function(){
			if(!this.fpsTimer){
				this.fpsTimer = new ig.Timer(1);
			}
			if(this.fpsTimer && this.fpsTimer.delta() < 0){
				if(this.fpsCounter != null){
					this.fpsCounter ++ ;
				}else{
					this.fpsCounter = 0 ;
				}
			}else{
				ig.game.fps = this.fpsCounter ;
				this.fpsCounter = 0 ;
				this.fpsTimer.reset();
			}
		},	
			
		endGame:function(){
			console.log('End game')
			// IMPORTANT
			ig.soundHandler.stopBackgroundMusic();
			
			// SUBMIT STATISTICS - USE ONLY WHEN MARKETJS API IS CONFIGURED
			// this.submitStats();

			if(ig.ua.mobile){
				if(_SETTINGS['Ad']['Mobile']['End']['Enabled'])
					MobileAdInGameEnd.Initialize();
			}
		},
		
		resetPlayerStats:function(){
			ig.log('resetting player stats ...');
			this.playerStats = {
				// EG: coins,score,lives, etc
				id:this.playerStats?this.playerStats.id:null, // FOR FACEBOOK LOGIN IDS
			}				
		},

		setupControls:function(){
			ig.input.unbindAll();

			// Mouse
			ig.input.initMouse();			
			ig.input.bind(ig.KEY.MOUSE1, 'click');
			
			// Keyboard			
		},						
		/* ig.soundHandler replace
		setupJukebox:function(){
			if(ig.ua.mobile){
				this.jukebox = new ig.Jukebox();
			}			
		},
		*/			
		setupURLParameters:function(){
			this.setupURLParameters = new ig.UrlParameters();
		},		

		pressPlay:function(){
			this.hideOverlay(['play']);
			
			// do something
			this.startGame();

			// Show ads
			if(ig.ua.mobile){
				if(_SETTINGS['Ad']['Mobile']['Footer']['Enabled'])
					MobileAdInGameFooter.Initialize();
			}

			if(ig.ua.mobile){
				if(_SETTINGS['Ad']['Mobile']['Header']['Enabled'])
					MobileAdInGameHeader.Initialize();
			}			
		},

		pauseGame:function(){
			ig.system.stopRunLoop.call(ig.system);
			console.log('Game Paused');
		},

		resumeGame:function(){
			ig.system.startRunLoop.call(ig.system);
			console.log('Game Resumed');	
		},
		/* use ig.soundHandler for your muting needs, any modifications can be done there
		pressMute:function(){
			if(ig.Sound.enabled){
				$('#btn-mute').attr('src','media/buttons/button-sound-off3.png');
				this.mute();				
			}else{
				$('#btn-mute').attr('src','media/buttons/button-sound-on3.png');
				this.unmute();				
			}
		},
		
		mute:function(){
			ig.game.stopAllSounds();
			if(!ig.ua.mobile){
				ig.music.volume = 0;				
				ig.Sound.enabled = false;
			}else{
				ig.game.jukebox.player.pause();
				ig.game.jukebox.player.setVolume(0.01);
			}
			//SFX
			//Howler.mute();						
		},
		
		unmute:function(){
			if(!ig.ua.mobile){
				ig.music.volume = 1;						
				ig.Sound.enabled = true;
			}else{
				ig.game.jukebox.player.resume();
				ig.game.jukebox.player.setVolume(1);
			}
			//SFX
			//Howler.unmute();			
		},
		*/	
		showOverlay:function(divList){			
			for(i=0;i<divList.length;i++){				
				if($('#'+divList[i])) $('#'+divList[i]).show();
				if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility="visible";
			}	
			
			// OPTIONAL
			//this.pauseGame();		
		},
	
		hideOverlay:function(divList){
			for(i=0;i<divList.length;i++){
				if($('#'+divList[i])) $('#'+divList[i]).hide();
				if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility="hidden";
			}
			
			// OPTIONAL
			//this.resumeGame();
		},
		/*		
		stopAllSounds:function(){
			for(i=0;i<ig.resources.length;i++){
				if(ig.resources[i].multiChannel){
					ig.resources[i].stop();
				}
			}
			console.log('all sounds stopped');
		},
		*/
		
		// MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
		update:function(){
			//Optional - to use 
			//this.fpsCount();
			
			if( this.paused ) {
	        // only update some of the entities when paused:
	            for( var i = 0; i < this.entities.length; i++ ) {
	                if( this.entities[i].ignorePause ) {
	                    this.entities[i].update();
	                }
	            }
	        }
	        else {
	            // call update() as normal when not paused
	            this.parent(); 
	
				//BGM looping fix for mobile 
				if(ig.ua.mobile && ig.soundHandler) // A win phone fix by yew meng added into ig.soundHandler
				{
					ig.soundHandler.forceLoopBGM();
				}
				
				
				
	        }	
		},
		
		draw: function(){
			this.parent();
				//Optional - to use , debug console , e.g : ig.game.debugCL("debug something");
				//hold click on screen for 2s to enable debug console
			//this.drawDebug();
		},

		drawDebug: function(){	//-----draw debug-----
			if(!ig.global.wm){
				// enable console
				this.debugEnable();
				//debug postion set to top left
				if(this.viewDebug){

					//draw debug bg				
					ig.system.context.fillStyle = '#000000';
					ig.system.context.globalAlpha = 0.35 ;
					ig.system.context.fillRect(0,0,ig.system.width/4,ig.system.height);
					ig.system.context.globalAlpha = 1 ;

					if(this.debug && this.debug.length > 0){
						//draw debug console log
						for(i = 0; i < this.debug.length; i++){
							ig.system.context.font = "10px Arial";
							ig.system.context.fillStyle = '#ffffff';
							ig.system.context.fillText(this.debugLine - this.debug.length + i + ": " + this.debug[i],10,50 + 10 * i);
						}

						// delete console log 1 by 1 per 2s , OPTIONAL
						//if(!this.debugTimer){
						//	this.debugTimer = new ig.Timer(2);
						//}else if(this.debugTimer && this.debugTimer.delta() > 0){
						//	this.debug.splice(0,1);
						//	if(this.debug.length > 0){
						//		this.debugTimer.reset();
						//	}else{
						//		this.debugTimer = null ;
						//	}
						//}
					}
				}
			}	
		},

		debugCL: function(consoleLog){ // ----- add debug console log -----
			//add console log to array
			if(!this.debug){
				this.debug = [] ;
				this.debugLine = 1 ;
				this.debug.push(consoleLog);
			}else{
				if(this.debug.length < 50){
					this.debug.push(consoleLog);
				}else{
					this.debug.splice(0,1);
					this.debug.push(consoleLog);
				}
				this.debugLine++;	
			}
			console.log(consoleLog);
		},

		debugEnable: function(){	// enable debug console
			//hold on screen for more than 2s then can enable debug
			if(ig.input.pressed('click')){
				this.debugEnableTimer = new ig.Timer(2);
			}
			if(this.debugEnableTimer && this.debugEnableTimer.delta() < 0){
				if(ig.input.released('click')){
					this.debugEnableTimer = null ;
				}
			}else if(this.debugEnableTimer && this.debugEnableTimer.delta() > 0){
				this.debugEnableTimer = null ;
				if(this.viewDebug){
					this.viewDebug = false;
				}else{
					this.viewDebug = true;
				}
			}
		},	
	});
	
	// FORCED DEVICE DETECTION
	var device = getQueryVariable("device");
	if(device){
		switch(device){
			case 'mobile':
				console.log('serving mobile version ...');
				ig.ua.mobile = true;
				break;
			case 'desktop':
				console.log('serving desktop version ...');
				ig.ua.mobile = false;			
				break;
			default:
				console.log('serving universal version ...');
				break;			
		}								
	}else{
		console.log('serving universal version ...');
	}

	// FORCED DEVICE ROTATION
	var force_rotate = getQueryVariable("force-rotate");
	if(force_rotate){
		switch(force_rotate){
			case 'portrait':
				console.log('force rotate to portrait')
				window.orientation = 0;
				break;
			case 'landscape':
				console.log('force rotate to horizontal')
				window.orientation = 90;
				break;
			default:
				alert('wrong command/type in param force-rotate. Defaulting value to portrait');
				window.orientation = 0;
		}
	}
		
	// VIEWPORT				
	if( ig.ua.mobile ) {
		ig.Sound.enabled = false;
		// mobileWidth, mobileHeight defined in handler.js, for more flexibility		
		ig.main('#canvas', MyGame, 60, mobileWidth, mobileHeight, 1, ig.SplashLoader);	    
	}
	else {
		// desktopWidth, desktopHeight defined in handler.js, for more flexibility
	    ig.main('#canvas', MyGame, 60, desktopWidth, desktopHeight, 1, ig.SplashLoader);
	}

	if(ig.ua.mobile){
		orientationHandler();
	}
	
	sizeHandler();
	
	// Samsung fix
	fixSamsungHandler();
	
	this.END_OBFUSCATION;
});
