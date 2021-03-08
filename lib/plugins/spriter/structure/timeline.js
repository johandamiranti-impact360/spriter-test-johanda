ig.module('plugins.spriter.structure.timeline')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterTimeline = ig.Class.extend({
            id: 0,
            name: "",

            type: 0,
            objectRef: 0,
            keys: [],

            init: function (id, name, type, objectRef) {
                this.id = id;
                this.name = name;

                this.type = type;
                this.objectRef = objectRef;
            },

            addKey: function (key) {
                this.keys.push(key);
            }

        });
    });