ig.module('plugins.spriter.spriter-display')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        SpriterDisplay = ig.Entity.extend({
            scml: null,
            spriter: null,

            entityName: "",
            currentAnimationName: "",
            animation: null,
            animationSpeed: 0,

            bones: [],
            objects: [],

            time: 0,
            nextTime: 0,
            keyIndex: 0,

            root: null,

            pause: false,
            finished: false,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                if (this.scml == null) {
                    console.error("scml is null, please provide one")
                    return;
                }
                this.spriter = this.scml.spriter;
                this.entityName = this.spriter.getEntityById(0).name;

                this.root = new SpriterSpatialInfo();

                // set animation speed
                this.setAnimationSpeedPercent(100);
                this.setAnimationById(0);
            },


            getAnimationCount: function () {
                return this.spriter.getEntityByName(this.entityName).getAnimationsCount();
            },

            setAnimationSpeedPercent: function (animationSpeedPercent) {
                if (animationSpeedPercent === undefined) animationSpeedPercent = 100;
                this.animationSpeed = animationSpeedPercent / 100;
            },


            setAnimationById: function (animationId, restart) {
                var animation = this.spriter.getEntityByName(this.entityName).getAnimationById(animationId);

                if (animation === undefined || animation === null) {
                    console.warn("Animation " + animationId + " for entity " + this.entityName + " does not exist!");
                    return;
                }

                this.setAnimation(animation, restart);
            },


            setAnimationByName: function (animationName, restart) {
                var animation = this.spriter.getEntityByName(this.entityName).getAnimationByName(animationName);
                // console.warn(animation);
                if (animation === undefined || animation === null) {
                    console.warn("Animation " + animationName + " for entity " + this.entityName + " does not exist!");
                    return;
                }

                this.setAnimation(animation, restart);
            },


            setAnimation: function (animation, restart) {
                if (restart === undefined) restart = true;

                this.animation = animation

                this.finished = false;

                // reset time to beginning of animation and find first from and to keys
                if (restart || this.currentAnimationName != animation.name) {
                    this.clearTime();

                    this.currentAnimationName = animation.name;

                    // create bones and sprites - based on data in mainLine key 0
                    this.loadKeys(0, true);
                }
            },


            clearTime: function () {
                this.time = 0;
                this.keyIndex = -1;
            },


            getNextMainLineKeyTime: function (time) {
                var keys = this.animation.mainLineKeys;
                var newIndex = (this.keyIndex + 1) % keys.length;

                this.nextTime = newIndex !== 0 ? keys[newIndex].time : this.animation.length;

                // game is lagging or keys are to close to each other - notify in console
                if (newIndex !== 0 && this.nextTime < time) {
                    // console.log("Game is lagging or keys are too close to each other...");
                }
            },


            setBones: function (bones, force) {
                if (force === undefined) force = false;
                // switch off all existing bones
                for (var i = 0; i < this.bones.length; i++) {
                    if (this.bones[i] !== undefined) {
                        this.bones[i].setOn(false);
                    }
                }

                // go through all bones and add new ones if necessary and activate used ones
                for (var i = 0; i < bones.length; i++) {
                    var ref = bones[i];

                    // if bone does not exist add it and make active, else make it active only
                    if (this.bones[ref.id] === undefined) {
                        this.bones[ref.id] = new SpriterBone();
                    }

                    var bone = this.bones[ref.id];

                    bone.setOn(true);
                    bone.parentId = ref.parentId;

                    if (bone.timelineKey != ref.key || force) {
                        bone.setKey(this.animation, ref.timeline, ref.key);
                    }
                }
            },


            setObjects: function (objects, force) {
                if (force === undefined) force = false;
                // switch off (kill) all existing sprites
                for (var i = 0; i < this.objects.length; i++) {
                    if (this.objects[i] !== undefined) {
                        this.objects[i].setOn(false);
                    }
                }

                // go through all objects/sprites and add new ones if necessary and activate used ones
                var zChange = false;
                for (var i = 0; i < objects.length; i++) {
                    var ref = objects[i];

                    var object = null;

                    // if sprite does not exist add it and make active, else make it active only
                    if (this.objects[ref.id] === undefined) {
                        object = new SpriterObject(this.spriter);
                        this.objects[ref.id] = object;
                        // this.add(sprite);
                    } else {
                        object = this.objects[ref.id];
                    }

                    object.setOn(true);
                    object.parentId = ref.parentId;

                    // if (object.sprite.z !== ref.z) {
                    //     object.sprite.z = ref.z;
                    //     zChange = true;
                    // }

                    if (object.timelineKey != ref.key || force) {
                        object.setKey(this.animation, ref.timeline, ref.key);
                    }
                }

                // need to sort sprites?
                if (zChange) {
                    // this.sort();
                }
            },


            loadKeys: function (mainLineKeyIndex, force) {
                // if (force === undefined) force = false;
                if (force === undefined) force = true;
                // create or update bones and sprites
                // console.warn(mainLineKeyIndex);
                // console.warn(this.animation.mainLineKeys);
                // console.warn(this.animation.mainLineKeys[mainLineKeyIndex]);
                this.setBones(this.animation.mainLineKeys[mainLineKeyIndex].boneRefs, force);
                this.setObjects(this.animation.mainLineKeys[mainLineKeyIndex].objectRefs, force);
            },

            update: function () {
                this.parent();
            },

            draw: function () {
                this.parent();
                // this.root.x = this.pos.x;
                // this.root.y = this.pos.y;
                var sys = ig.system;
                var ctx = sys.context;
                ctx.save();
                ctx.translate(sys.getDrawPos(this.pos.x), sys.getDrawPos(this.pos.y));
                if (this.scale) {
                    if (this.scale.x != 1 || this.scale.y != 1) {
                        ctx.scale(this.scale.x, this.scale.y);
                    }
                } else {
                    this.scale = {};
                    this.scale.x = 1;
                    this.scale.y = 1;
                }
                this.updateAnimation();
                ctx.restore();
            },

            updateAnimation: function () {
                if(this.nextTime<this.animation.length||this.animation.loopType === SpriterAnimationLooping.LOOPING)
                {   
                    if (this.keyIndex === -1 || this.time > this.nextTime) {
                        this.keyIndex = (this.keyIndex + 1) % this.animation.mainLineKeys.length;

                        // start anim from beginning again
                        if (this.time > this.animation.length) {
                            if (this.animation.loopType === SpriterAnimationLooping.NO_LOOPING) {
                                // prevent skipping all keys in the very end of animation - loop through all of them and adjust sprites
                                while (this.keyIndex !== 0) {
                                    this.getNextMainLineKeyTime(this.time);
                                    this.loadKeys(this.keyIndex);
                                    this.updateCharacter();
                                    this.keyIndex = (this.keyIndex + 1) % this.animation.mainLineKeys.length;
                                }
                                this.finished = true;
                                return;
                            }

                            this.time = 0;
                            this.keyIndex = 0;
                        }

                        this.getNextMainLineKeyTime(this.time);
                        this.loadKeys(this.keyIndex);
                    }

                    this.updateCharacter();

                    if (this.pause || this.finished) {
                        return;
                    }
                    this.time += (ig.system.tick * this.animationSpeed * 1000);
                }
                else
                {
                    this.time=this.animation.length;
                    this.finished=true;
                    this.updateCharacter();
                }
            },


            updateCharacter: function () {
                for (var i = 0; i < this.bones.length; i++) {
                    var bone = this.bones[i];
                    if (bone.on) {
                        var parentSpatial = (bone.parentId === -1) ? this.root : this.bones[bone.parentId].transformed;
                        bone.tween(this.time);
                        bone.update(parentSpatial);
                    }
                }

                for (var i = 0; i < this.objects.length; i++) {
                    var object = this.objects[i];
                    if (object.on) {
                        var parentSpatial = (object.parentId === -1) ? this.root : this.bones[object.parentId].transformed;
                        object.tween(this.time);
                        object.update(parentSpatial);
                    }
                }
            },
        });
    });
