ig.module('game.entities.pointer')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityPointer = ig.Entity.extend({
		type:ig.Entity.TYPE.A,
	    checkAgainst: ig.Entity.TYPE.B,
	
		
	    isClicking: false,
		isHovering: false,
		
		// in case to use new pointer 
		firstClick: false,
		isReleased: false,
		hoveringItem: null,
		objectArray: [] , 
		
		ignorePause: true,
		
		zIndex: 5000,
	
    	

	    /*check: function( other ) {
			this.isHovering = true;
			
	        // if clicking	
			if(this.isClicking){
				if(typeof(other.clicked) == 'function'){
					other.clicked();
				}
			}

			// if hovering
	        if( 
	            this.isHovering && 
	            typeof(other.hovered) == 'function' 
	        ) {
	            other.hovered();
	        }
	
	    },
			
	    update: function() {		
			if(!ig.ua.mobile){ // DESKTOP
			    this.pos.x = ig.input.mouse.x / multiplier - this.size.x/2 + ig.game.screen.x;
		        this.pos.y = ig.input.mouse.y / multiplier - this.size.y/2 ;
			}else{ // MOBILE
				var heightRatio = window.innerHeight / mobileHeight ;
				var widthRatio = window.innerWidth / mobileWidth ;
				this.pos.x = ig.input.mouse.x / widthRatio - this.size.x/2 + ig.game.screen.x;
		        this.pos.y = ig.input.mouse.y / heightRatio - this.size.y/2;					
			}
				        
			// Only check for the click once per frame, instead of
	        // for each entity it touches in the 'check' function
	        this.isClicking = ig.input.pressed('click');
			this.isHold = ig.input.state('click');
			this.isReleased = ig.input.released('click');
		}*/
		
		// -------------------- new pointer ------------------------
		//entity can use this four function
		//clicked
		//clicking
		//released
		//idle
		
		check: function( other ) {
		
			this.objectArray.push(other);	
	    },

		clickObject: function(targetobject){
			// if clicked
			if(this.isClicking && !this.firstClick){
				if(typeof(targetobject.clicked) == 'function'){
					targetobject.clicked();
					this.firstClick = true ;
				}
			}
			// if clicking
			if(this.firstClick && !this.isReleased){
				if(typeof(targetobject.clicking) == 'function'){
					targetobject.clicking();
				}	
			}
			// if released
			if(this.firstClick && this.isReleased){
				if(typeof(targetobject.released) == 'function'){
					targetobject.released();
					this.firstClick = false ;
				}
			}
		},
			
	    update: function() {
		
			if(!ig.ua.mobile){ // DESKTOP
			    this.pos.x = ig.input.mouse.x- this.size.x/2;// multiplier - this.size.x/2 + ig.game.screen.x; //- this.adjustedMouse.x - this.size.x/2 + ig.game.screen.x;
		        this.pos.y = ig.input.mouse.y- this.size.y/2;// multiplier - this.size.y/2 ; //- this.adjustedMouse.y - this.size.y/2 + ig.game.screen.y;	
			}else{ // MOBILE
				var heightRatio = window.innerHeight / mobileHeight ;
				var widthRatio = window.innerWidth / mobileWidth ;
				this.pos.x = ig.input.mouse.x/ widthRatio - this.size.x/2 + ig.game.screen.x;
		        this.pos.y = ig.input.mouse.y/ heightRatio - this.size.y/2;					
			}
			
			var targetObject = null ;
			var highestIndex = -1 ;
			
			for(a = this.objectArray.length -1 ; a > -1 ; a --){
				if(this.objectArray[a].zIndex > highestIndex){
					highestIndex = this.objectArray[a].zIndex;
					targetObject = this.objectArray[a] ;
				}
			}
			
			if(targetObject != null){
				if(targetObject.name=='close')console.log(targetObject)
				if(this.hoveringItem != null && typeof(this.hoveringItem.idle) == 'function'){
					if(this.hoveringItem != targetObject){
						this.hoveringItem.idle();
					}
				}
				this.hoveringItem = targetObject ;
				this.clickObject(targetObject);
				this.objectArray = [];
			}else{
				if(this.hoveringItem != null && typeof(this.hoveringItem.idle) == 'function'){
					this.hoveringItem.idle();
					this.hoveringItem = null;
				}
				
			}
			//this.firstClick = false ;

				        
			// Only check for the click once per frame, instead of
	        // for each entity it touches in the 'check' function
	        this.isClicking = ig.input.pressed('click');
			this.isReleased = ig.input.released('click');
		}
   
	});
});