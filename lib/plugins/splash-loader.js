ig.module('plugins.splash-loader')
.requires(
    'impact.loader',
    'impact.animation'
)
.defines(function() {
    ig.SplashLoader = ig.Loader.extend({
        loadingBackground: new ig.Image('media/graphics/splash/desktop/cover.jpg'),

        loadingFrame: new ig.Image('media/graphics/splash/loading/loading-frame.png'),

        init:function(gameClass,resources){

            this.parent(gameClass,resources);
            //console.log("asdasdasd");
            // ENABLE, IF CUSTOM ANIMATION REQUIRED DURING LOADING

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

        draw: function() {

            this._drawStatus += (this.status - this._drawStatus) / 5;
            if (this._drawStatus > 0.99) this._drawStatus = 1;

            // CLEAR RECTANGLE
            ig.system.context.fillStyle = '#000000';
            ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);

            // DRAW BACKGROUND
            this.loadingBackground.draw(0, 0);

            var s = ig.system.scale;

            // GAME DIMENSION
            var gameW = ig.system.width;
            var gameH = ig.system.height;
            var gameHalfW = gameW / 2;
            var gameHalfH = gameH / 1.25;

            w = 237;
            h = 10;
            x = ig.system.width * 0.5-w/1.725;
            y = ig.system.height / 1.265;

            // DRAW DIAMOND LOADING BAR
            var ctx = ig.system.context;


            //DRAW FRAME
            this.loadingFrame.draw(gameHalfW - this.loadingFrame.width / 1.725, gameHalfH - this.loadingFrame.height / 2);

            ctx.fillStyle = '#ff0000';
            ig.system.context.fillRect( x*s, y*s, w*s*this._drawStatus, h*s );

            // DRAW LOADING TEXT
            var text = _STRINGS.Splash["Loading"];
            var xpos, ypos;

            ctx.font = "24px LuckiestGuy";
            ctx.fillStyle = '#ffffff';

            xpos = gameHalfW - ig.system.context.measureText(text).width / 1.5;
            ypos = gameHalfH * s - 25;

            ctx.fillText(text, xpos, ypos);
        }
    });
});
