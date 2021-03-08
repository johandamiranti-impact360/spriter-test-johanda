ig.module('plugins.spriter.structure.entity')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterEntity = ig.Class.extend({

            id: 0,
            name: "",
            objectInfos: null,
            animations: null,

            init: function (id, name) {
                this.id = id;
                this.name = name;

                this.objectInfos = new SpriterIdNameMap();
                this.animations = new SpriterIdNameMap();
            },

            addObjectInfo: function (objectInfo) {
                this.objectInfos.add(objectInfo, objectInfo.id, objectInfo.name);
            },

            getObjectInfoById: function (id) {
                return this.objectInfos.getById(id);
            },

            getObjectInfoByName: function (name) {
                return this.objectInfos.getByName(name);
            },

            addAnimation: function (animation) {
                this.animations.add(animation, animation.id, animation.name);
            },

            getAnimationById: function (id) {
                return this.animations.getById(id);
            },

            getAnimationByName: function (name) {
                return this.animations.getByName(name);
            },


            getAnimationsCount: function () {
                return this.animations.getLength();
            }
        });
    });
