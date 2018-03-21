ig.module(
    'game.entities.game-controller'
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

    EntityGameController = EntityController.extend({
        
        desktopBackground: new LanscapeBackground('media/graphics/backgrounds/desktop/background.jpg'),

        init: function (x, y, settings) {      
            this.parent(x, y, settings);

            if (!ig.global.wm) {               

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
});