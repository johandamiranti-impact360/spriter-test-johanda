ig.module(
    'game.entities.menu-controller'
)
.requires(
    'impact.entity',
    'game.entities.buttons.button',
    'game.entities.controller',
    'plugins.scale'
)

.defines(function () {

    LanscapeBackground = ig.Image.extend({
        resize: function () { },
        draw: function () {
            if (!this.loaded) { return; }
            ig.system.context.drawImage(this.data, 0, 0);
        }
    });

    EntityMenuController = EntityController.extend({

        desktopBackground: new LanscapeBackground('media/graphics/backgrounds/desktop/background.jpg'),

        gameTitle: null,
        buttonPlay: null,
        buttonSetting: null,
        buttonMoreGames: null,

        init: function (x, y, settings) {
            //console.log(ig.game.setting.colors);           
            this.parent(x, y, settings);

            if (!ig.global.wm) {
                this.gameTitle = ig.game.spawnEntity(EntityGameTitle, ig.system.width * 2, ig.system.height * 2);
                this.gameTitle.pos = {
                    x: ig.system.width * 0.5 - this.gameTitle.size.x * 0.5,
                    y: - 100
                }

                this.buttonPlay = ig.game.spawnEntity(EntityButtonPlay, ig.system.width * 2, ig.system.height * 2);
                this.buttonPlay.pos = {
                    x: ig.system.width * 0.5 - this.buttonPlay.size.x * 0.5,
                    y: ig.system.height + this.buttonPlay.size.y * 2
                }

                this.buttonSetting = ig.game.spawnEntity(EntityButtonSetting, ig.system.width * 2, ig.system.height * 2);
                this.buttonSetting.pos = {
                    x: ig.system.width * 1,
                    y: ig.system.height * 0.925 - this.buttonSetting.size.y * 0.5
                }

                if(_SETTINGS.MoreGames.Enabled){
                    this.buttonMoreGames = ig.game.spawnEntity(EntityButtonMoreGames, ig.system.width * 0.05 - 39, ig.system.height * 0.925 - 34);                       
                    this.buttonMoreGames.pos = {
                        x: -39,
                        y: ig.system.height * 0.925 - 34
                    }
                }
                     
                this.gameTitleTween();
            }            
        },

        gameTitleTween: function(){
            var titleFinalPosY = ig.system.height * 0.175 - this.gameTitle.size.y * 0.5;  

            var gameTitleTween1 = this.gameTitle.tween(
                { pos: { y: titleFinalPosY } }
                , 0.75, {
                    easing: ig.Tween.Easing.Quadratic.EaseInOut,
                    
                    onComplete: function () {
                        this.settingButtonTween();
                        this.playButtonTween();
                        if(_SETTINGS.MoreGames.Enabled){
                            this.moreGamesButtonTween();               
                        }                        
                        //ig.soundHandler.sfxPlayer.play('buttonAnimation1');  
                    }.bind(this)
                }
            ).start();
        },

        playButtonTween: function(){
            var buttonPlayFinalPosY = ig.system.height * 0.65 - this.buttonPlay.size.y * 0.5;  

            var buttonPlayTween1 = this.buttonPlay.tween(
                { pos: { y: buttonPlayFinalPosY } }
                , 0.75, {
                    easing: ig.Tween.Easing.Quadratic.EaseInOut,
                    
                    onComplete: function () {
                                               
                        //ig.soundHandler.sfxPlayer.play('buttonAnimation1');  
                    }.bind(this)
                }
            ).start();
        },


        settingButtonTween: function(){
            var buttonSettingFinalPosX = ig.system.width * 0.95 - this.buttonSetting.size.x * 0.5;  

            var buttonSettingTween1 = this.buttonSetting.tween(
                { pos: { x: buttonSettingFinalPosX } }
                , 0.75, {
                    easing: ig.Tween.Easing.Quadratic.EaseInOut,
                    
                    onComplete: function () {

                        //ig.soundHandler.sfxPlayer.play('buttonAnimation1');  
                    }.bind(this)
                }
            ).start();
        },

        moreGamesButtonTween: function(){
            var buttonMoreGamesFinalPosX = ig.system.width * 0.05 - 39;  

            var buttonMoreGamesTween1 = this.buttonMoreGames.tween(
                { pos: { x: buttonMoreGamesFinalPosX } }
                , 0.75, {
                    easing: ig.Tween.Easing.Quadratic.EaseInOut,
                    
                    onComplete: function () {

                        //ig.soundHandler.sfxPlayer.play('buttonAnimation1');  
                    }.bind(this)
                }
            ).start();
        },

        update: function () {
            this.parent();

        },

        draw: function () {
            this.parent();

            this.desktopBackground.draw();
        }
    });

    EntityGameTitle = ig.Entity.extend({
        zIndex: 2,

        size: { x: 564, y: 118 },

        animSheet: new ig.AnimationSheet('media/graphics/sprites/game-title.png', 564, 118),

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim("default", 1, [0]);   
        },

        update: function () {            
            this.parent();      
            
        },

        draw: function () {
            this.parent();
        }
    });

    EntityButtonPlay = EntityButton.extend({
        zIndex: 2,

        chipID: 0,
        size: { x: 307, y: 306 },

        animSheet: new ig.AnimationSheet('media/graphics/sprites/btn-play.png', 307, 306),

        chipOn: false,

        scaleSize: 1,

        upSizing: false,

        sc: 0.5,
        name: "button play",
        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim("default", 1, [0]);    
        },

        update: function () {            
            this.parent();     
            
            if(this.scaleSize >= 1){
                this.upSizing = false;
            }
            else if(this.scaleSize <= 0.75){
                this.upSizing = true;
            }

            if(!this.upSizing){
                this.scaleSize -= 0.5 * ig.system.tick;
            }
            else{
                this.scaleSize += 0.5 * ig.system.tick;
            }

            console.log(this.scaleSize);
            this.setScale(this.scaleSize, this.scaleSize);
        },

        draw: function () {
            this.parent();
        },

        check: function (other) {

        },

        clicked: function () {            
            this.runClickingTime();
            //ig.soundHandler.sfxPlayer.play('buttonSound');
            
        },

        released: function () {
            this.disableClickingTime();
           

            
        }
    });

    EntityButtonSetting = EntityButton.extend({
        zIndex: 2,

        chipID: 0,
        size: { x: 78, y: 68 },

        animSheet: new ig.AnimationSheet('media/graphics/sprites/btn-setting.png', 78, 68),

        chipOn: false,

        sc: 0.5,
        name: "button setting",
        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim("default", 1, [0]);    
        },

        update: function () {            
            this.parent();     
            
        },

        draw: function () {
            this.parent();
        },

        check: function (other) {

        },

        clicked: function () {            
            this.runClickingTime();
            //ig.soundHandler.sfxPlayer.play('buttonSound');
            this.setScale(1.2, 1.2);
        },

        released: function () {
            this.disableClickingTime();
            this.setScale(1, 1);
            
        }
    });
});