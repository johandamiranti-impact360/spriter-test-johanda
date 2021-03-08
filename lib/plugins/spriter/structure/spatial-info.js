ig.module('plugins.spriter.structure.spatial-info')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterSpatialInfo = ig.Class.extend({
            x: 0,
            y: 0,

            scaleX: 1,
            scaleY: 1,

            pivotX: 0,
            pivotY: 0,

            alpha: 1,

            angle: 0,
        })
    })