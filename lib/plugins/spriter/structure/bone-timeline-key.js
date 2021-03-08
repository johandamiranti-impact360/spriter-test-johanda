ig.module('plugins.spriter.structure.bone-timeline-key')
    .requires(
        'plugins.spriter.structure.spatial-timeline-key'
    )
    .defines(function () {
        SpriterBoneTimelineKey = SpriterSpatialTimelineKey.extend({
            init: function (id, time, spin) {
                this.parent(id, time, spin);
            },
        });
    });
