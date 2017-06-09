ig.module('plugins.splash-loader')
.requires(
    'impact.loader',
    'impact.animation'
)
.defines(function() {
    ig.SplashLoader = ig.Loader.extend({
        splashDesktop: new ig.Image('media/graphics/splash/desktop/cover.jpg'),
        splashMobile: new ig.Image('media/graphics/splash/mobile/cover.jpg'),

        //customAnim: new ig.AnimationSheet('media/splash/some_spritesheet.png',40,40),

        init:function(gameClass,resources){

            this.parent(gameClass,resources);
            //console.log("asdasdasd");
            // ENABLE, IF CUSTOM ANIMATION REQUIRED DURING LOADING
            //this.setupCustomAnimation();

            // ADS
            ig.apiHandler.run("MJSPreroll");
        },

        end:function(){
            this.parent();

            if(ig.ua.mobile)
            {
                var play = ig.domHandler.getElementById("#play");
                ig.domHandler.show(play);
            }

            ig.system.setGame(MyGame);

            // CLEAR CUSTOM ANIMATION TIMER
            // window.clearInterval(ig.loadingScreen.animationTimer);
        },

        setupCustomAnimation:function(){
            this.customAnim = new ig.Animation(this.customAnim, 0.05, [0,1,2,3,4,5]);
            this.customAnim.currentFrame = 0;

            // Assign this class instance an arbitrary name
            ig.loadingScreen = this;

            // Create an external timer variable
            ig.loadingScreen.animationTimer = window.setInterval('ig.loadingScreen.animate()',100);
        },

        animate:function(){
            // Somehow the update() function doesn't work in Loader class. Resort to using external timer to increment
            // current frame in anim object

            if(this.customAnim.currentFrame<this.customAnim.sequence.length){
                this.customAnim.currentFrame++;
            }else{
                this.customAnim.currentFrame=0;
            }
            this.customAnim.gotoFrame(this.customAnim.currentFrame);
        },


        draw: function() {

            this._drawStatus += (this.status - this._drawStatus)/5;

            // CLEAR RECTANGLE
            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect( 0, 0, ig.system.width, ig.system.height );

            var s = ig.system.scale;

            // DIMENSIONS OF LOADING BAR
            var w,h,x,y;
            if(ig.ua.mobile){
                // CUSTOM POSITIONS (TRIAL & ERROR)
                w = 180;
                h = 24;
                x = ig.system.width * 0.5-w/2;
                y = ig.system.height * 0.67;
                this.splashMobile.draw(0,0);
            }else{
                // CUSTOM POSITIONS (TRIAL & ERROR)
                w = 250;
                h = 30;
                x = ig.system.width * 0.5-w/2;
                y = ig.system.height * 0.67;
                this.splashDesktop.draw(0,0);
            }

            // DRAW LOADING BAR
            ig.system.context.fillStyle = '#fff';
            ig.system.context.fillRect( x*s, y*s, w*s, h*s );

            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect( x*s+s, y*s+s, w*s-s-s, h*s-s-s );

            ig.system.context.fillStyle = '#A00A2D'; // COLOR
            ig.system.context.fillRect( x*s, y*s, w*s*this._drawStatus, h*s );

            ig.system.context.fillStyle = '#ffffff';
            ig.system.context.font = "16px Arial";

            // DRAW LOADING TEXT
            var text = _STRINGS.Splash["Loading"];
            var xpos,ypos;

            if(ig.ua.mobile){    // MOBILE
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
                ypos = y*s+18;
            }else{                // DESKTOP
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
                ypos = y*s+18;
            }

            ig.system.context.fillText(text, xpos, ypos );
            ig.system.context.font = "bold 14px Arial";
            ig.system.context.fillStyle = '#000000';

            // DRAW LOGO TEXT LINE1
            text = _STRINGS.Splash["LogoLine1"];
            if(ig.ua.mobile){ // MOBILE
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;    ;
                ypos = ig.system.height * 0.6;;
            }else{            // DESKTOP
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;    ;
                ypos = ig.system.height * 0.6;
            }

            ig.system.context.font = "bold 12px Arial";
            ig.system.context.fillText(text, xpos, ypos );

            // DRAW LOGO TEXT LINE2
            text = _STRINGS.Splash["LogoLine2"];
            if(ig.ua.mobile){ // MOBILE
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;    ;
                ypos = ig.system.height * 0.6 + 15;
            }else{            // DESKTOP
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;    ;
                ypos = ig.system.height * 0.6 + 15;
            }

            ig.system.context.font = "bold 12px Arial";
            ig.system.context.fillText(text, xpos, ypos );
        }
    });
});
