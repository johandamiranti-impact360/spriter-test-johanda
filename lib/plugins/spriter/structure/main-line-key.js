ig.module('plugins.spriter.structure.main-line-key')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterMainLineKey = ig.Class.extend({
            time: 0,

            curveType: 0,
            c1: 0,
            c2: 0,
            c3: 0,
            c4: 0,

            boneRefs: [],
            objectRefs: [],
            init: function (time) {
                this.time = time;
                this.setCurve(ig.SpriterCurveType.LINEAR);
            },

            addBoneRef: function (boneRef) {
                this.boneRefs.push(boneRef);
            },

            addObjectRef: function (objectRef) {
                this.objectRefs.push(objectRef);
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
            },
        });
    });