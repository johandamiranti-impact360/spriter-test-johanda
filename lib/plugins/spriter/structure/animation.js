ig.module('plugins.spriter.structure.animation')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterAnimationLooping = { NO_LOOPING: 0, LOOPING: 1 };
        SpriterAnimation = ig.Class.extend({

            id: 0,
            name: null,

            length: 0,
            loopType: 0,

            mainLineKeys: [],
            timelines: null,

            init: function (id, name, length, loopType) {
                this.id = id;
                this.name = name;

                this.length = length;
                this.loopType = loopType;

                this.timelines = new SpriterIdNameMap();
            },

            addMainLineKey: function (mainLineKey) {
                this.mainLineKeys.push(mainLineKey);
            },

            addTimeline: function (timeline) {
                this.timelines.add(timeline, timeline.id, timeline.name);
            },

            getTimelineById: function (id) {
                return this.timelines.getById(id);
            },

            getTimelineByName: function (name) {
                return this.timelines.getByName(name);
            },

            updateCurve: function () {
                for (var i = 0; i < this.mainLineKeys.length; i++) {
                    var key = this.mainLineKeys[i];
                    if (key.curveType != ig.SpriterCurveType.LINEAR) {
                        for (var j = 0; j < key.boneRefs.length; j++) {
                            var boneref = key.boneRefs[j];
                            this.timelines.getById(boneref.timeline).keys[boneref.key].setCurve(key.curveType, key.c1, key.c2, key.c3, key.c4);
                        }
                        for (var k = 0; k < key.objectRefs.length; k++) {
                            var objref = key.objectRefs[k];
                            this.timelines.getById(objref.timeline).keys[objref.key].setCurve(key.curveType, key.c1, key.c2, key.c3, key.c4);
                        }
                    }
                }
            }
        });
    });