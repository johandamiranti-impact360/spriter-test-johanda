ig.module('plugins.spriter.structure.spatial-timeline-key')
    .requires(
        'plugins.spriter.structure.timeline-key'
    )
    .defines(function () {
        SpriterSpatialTimelineKey = SpriterTimelineKey.extend({
            info: null,
            init: function (id, time, spin) {
                this.parent(id, time, spin);
                this.info = new SpriterSpatialInfo();
            }
        });
    });