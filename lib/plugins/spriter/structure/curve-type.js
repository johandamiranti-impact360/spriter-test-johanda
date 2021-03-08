ig.module('plugins.spriter.structure.curve-type')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        ig.SpriterCurveType = {
            LINEAR: 0,
            INSTANT: 1,
            QUADRATIC: 2,
            CUBIC: 3
        };

        ig.SpriterCurveType.getCurveTypeForName = function (curveTypeName) {
            if (curveTypeName === "linear") {
                return ig.SpriterCurveType.LINEAR;
            } else if (curveTypeName === "instant") {
                return ig.SpriterCurveType.INSTANT;
            } else if (curveTypeName === "quadratic") {
                return ig.SpriterCurveType.QUADRATIC;
            } else if (curveTypeName === "cubic") {
                return ig.SpriterCurveType.CUBIC;
            } else {
                console.warn("Unknown curve type: " + curveTypeName);
                return ig.SpriterCurveType.LINEAR;
            }
        };
    });

