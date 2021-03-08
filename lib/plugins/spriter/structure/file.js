ig.module('plugins.spriter.structure.file')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterFile = ig.Class.extend({
            id: 0,
            name: "",
            anchorX: 0,
            anchorY: 0,
            init: function (id, name, anchorX, anchorY) {
                this.id = id;
                this.name = name;
                this.anchorX = anchorX;
                this.anchorY = anchorY;
            }
        });
    });