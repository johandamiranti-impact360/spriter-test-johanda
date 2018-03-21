ig.module(
    'game.entities.menu-controller'
)
.requires(
    'impact.entity',
    'game.entities.buttons.button',
    'game.entities.controller'
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
                    y: ig.system.height * 0.175 - this.gameTitle.size.y * 0.5
                }

                this.buttonPlay = ig.game.spawnEntity(EntityButtonPlay, ig.system.width * 2, ig.system.height * 2);
                this.buttonPlay.pos = {
                    x: ig.system.width * 0.5 - this.buttonPlay.size.x * 0.5,
                    y: ig.system.height * 0.65 - this.buttonPlay.size.y * 0.5
                }

                this.buttonSetting = ig.game.spawnEntity(EntityButtonSetting, ig.system.width * 2, ig.system.height * 2);
                this.buttonSetting.pos = {
                    x: ig.system.width * 0.95 - this.buttonSetting.size.x * 0.5,
                    y: ig.system.height * 0.925 - this.buttonSetting.size.y * 0.5
                }

                this.buttonMoreGames = ig.game.spawnEntity(EntityButtonMoreGames, ig.system.width * 0.05 - 39, ig.system.height * 0.925 - 34);                
            }            
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

        sc: 0.5,
        name: "button play",
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