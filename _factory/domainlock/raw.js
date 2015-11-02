
	MyGame = ig.Game.extend({	
		init: function() {
			// BASICS
			this.setupControls();
			this.setupDesktopMusic();
			this.setupLocalStorage();									
			this.removeLoadingWheel();
			this.injectMobileLink();
			this.setupURLParameters();
			this.finalize();
		},
		
		finalize:function(){
			if(ig.ua.mobile){
				ig.game.showOverlay(['play']);			
			}else{
				ig.game.startGame();
			}	
			sizeHandler();		
		},
		
		injectMobileLink:function(){
			// Inject link createjs.Sound.play(\'start\');
			$('#play').attr('onclick','ig.game.setupJukebox();ig.game.pressPlay();')			
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
		
		setupDesktopMusic:function(){
			//ig.music.add('media/sounds/desktop/background.*', 'background');			
		},

		startGame:function(){	
			this.resetPlayerStats();
								
			// TEST Eg: load level using Director plugin
			if(ig.ua.mobile){
				this.director = new ig.Director(this,[
						LevelTestMobile
				]);										
			}else{
				this.director = new ig.Director(this,[
						LevelTestDesktop
				]);					
			}
			
			// CALL LOAD LEVELS
			this.director.loadLevel(this.director.currentLevel);
			
			this.spawnEntity(EntityPointerSelector,50,50);
						
			// MUSIC
			// this.playBackgroundMusic();						
		},
		
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

		// THIS FUNCTION FOR MACHINE RUNNING UNDER 30FPS , WILL INCREASE THE TIMESCALE TO MAKE GAME SEEMS SMOOTHER
		// Put this function into update() or run() to use this function
		fpsMultiplierFunction: function(){
	
			if(!this.fpsTimer){
		
				this.fpsTimer = new ig.Timer(1 * ig.Timer.timeScale);
			}
	
			if(this.fpsTimer && this.fpsTimer.delta() < 0){
		
				if(this.fpsCounter != null){
			
					this.fpsCounter ++ ;
			
				}else{
			
					this.fpsCounter = 0 ;
			
				}
		
			}else{
		
				ig.game.fps = this.fpsCounter ;
		
				if(ig.game.fps < 31){
			
					ig.Timer.timeScale = 60 / ig.game.fps * 0.75 ;
					//apply fpsMultiplier to enity with pos++ example : this.pos.x += a * ig.game.fpsMultiplier ;
					ig.game.fpsMultiplier = 60 / ig.game.fps * 0.75 ;
			
				}else{
			
					ig.Timer.timeScale = 1 ;
					ig.game.fpsMultiplier = 1 ;
			
				}
		
				this.fpsCounter = 0 ;
		
				this.fpsTimer.set(1 * ig.Timer.timeScale);
		
				this.fpsTimer.reset();
			}
	
		},	
			
		endGame:function(){
			console.log('End game')
			// IMPORTANT
			this.stopBackgroundMusic();
			
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

		setupJukebox:function(){
			if(ig.ua.mobile){
				this.jukebox = new ig.Jukebox();
			}			
		},
					
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
				ig.game.jukebox.player.setVolume(0.01);
			}			
			
			ig.game.video.muteAllPlayer();
		},
		
		unmute:function(){
			if(!ig.ua.mobile){
				ig.music.volume = 1;						
				ig.Sound.enabled = true;
			}else{
				ig.game.jukebox.player.setVolume(1);
			}			
			
			ig.game.video.muteAllPlayer();
		},
				
		showOverlay:function(divList){			
			for(i=0;i<divList.length;i++){				
				$('#'+divList[i]).fadeIn(200);
				document.getElementById(divList[i]).style.visibility="visible";
			}	
			
			// OPTIONAL
			//this.pauseGame();		
		},
	
		hideOverlay:function(divList){
			for(i=0;i<divList.length;i++){
				$('#'+divList[i]).fadeOut(200);
				document.getElementById(divList[i]).style.visibility="hidden";
			}
			
			// OPTIONAL
			//this.resumeGame();
		},
				
		stopAllSounds:function(){
			for(i=0;i<ig.resources.length;i++){
				if(ig.resources[i].multiChannel){
					ig.resources[i].stop();
				}
			}
			console.log('all sounds stopped');
		},
		
		// MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
		update:function(){
			// OPTIONAL - USE IF NEEDED, ASK RAM FOR USE CASE
			// this.fpsMultiplierFunction();
			
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
	        }	
		}	
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
	