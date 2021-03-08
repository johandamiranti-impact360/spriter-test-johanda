ig.module('plugins.spriter.structure.object-type')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterObjectType = {
            SPRITE: 0,
            BONE: 1
        };

        SpriterObjectType.getObjectTypeForName = function (typeName) {
            if (typeName === "sprite") {
                return SpriterObjectType.SPRITE;
            } else if (typeName === "bone") {
                return SpriterObjectType.BONE;
            }
        };
    });