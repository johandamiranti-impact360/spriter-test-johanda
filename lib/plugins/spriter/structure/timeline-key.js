ig.module('plugins.spriter.structure.timeline-key')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterTimelineKey = ig.Class.extend({
            id: 0,

            time: 0,

            spin: 0,

            curveType: 0,
            c1: 0,
            c2: 0,
            c3: 0,
            c4: 0,

            init: function (id, time, spin) {

                this.id = id;
                this.time = time;
                this.spin = spin;

                this.setCurve(ig.SpriterCurveType.LINEAR);
            },

            setCurve: function (curveType, c1, c2, c3, c4) {
                if (curveType === undefined) curveType = ig.SpriterCurveType.LINEAR;
                if (c1 === undefined) c1 = 0;
                if (c2 === undefined) c2 = 0;
                if (c3 === undefined) c3 = 0;
                if (c4 === undefined) c4 = 0;

                this.curveType = curveType;
                this.c1 = c1;
                this.c2 = c2;
                this.c3 = c3;
                this.c4 = c4;
            }


        });
    });