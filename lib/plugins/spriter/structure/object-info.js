ig.module('plugins.spriter.structure.object-info')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterObjectInfo = ig.Class.extend({
            id: 0,
            type: 0,
            name: "",
            width: 0,
            height: 0,
            init: function (id, name, type, width, height) {
                this.id = id;
                this.type = type;
                this.name = name;
                this.width = width;
                this.height = height;
            }

        });
    });