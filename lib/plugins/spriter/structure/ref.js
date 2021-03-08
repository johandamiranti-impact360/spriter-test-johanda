ig.module('plugins.spriter.structure.ref')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterRef = ig.Class.extend({
            id: 0,
            parentId: 0,
            timeline: 0,
            key: 0,
            z: 0,
            init: function (id, parentId, timeline, key, z) {
                this.id = id;
                this.parentId = parentId;
                this.timeline = timeline;
                this.key = key;
                this.z = z;
            }
        });
    });