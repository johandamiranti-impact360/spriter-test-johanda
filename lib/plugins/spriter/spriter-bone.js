ig.module('plugins.spriter.spriter-bone')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterBone = ig.Class.extend({
            UPDATE_X: 1,
            UPDATE_Y: 2,
            UPDATE_SCALE_X: 4,
            UPDATE_SCALE_Y: 8,
            UPDATE_PIVOT_X: 16,
            UPDATE_PIVOT_Y: 32,
            UPDATE_ANGLE: 64,
            UPDATE_ALPHA: 128,

            on: false,

            parentId: 0,

            timelineKey: -1,
            key: null,

            timeFrom: 0,
            timeTo: 0,
            from: null,
            to: null,

            transformed: null,

            updateMask: 0,

            init: function () {
                this.transformed = new SpriterSpatialInfo();
            },


            setOn: function (on) {
                this.on = on;
            },

            setKey: function (animation, timelineId, keyId) {
                this.timelineKey = keyId;

                var keys = animation.getTimelineById(timelineId).keys;

                var keyFrom = keys[keyId];
                // in the end loop to first key. If animation is not looping, then repeat last key
                var endIndex = (keyId + 1) % keys.length;
                if (endIndex === 0 && animation.loopType === SpriterAnimationLooping.NO_LOOPING) {
                    endIndex = keyId;
                }
                var keyTo = keys[endIndex];

                this.key = keyFrom;
                this.timeFrom = keyFrom.time;
                this.timeTo = keyTo.time;

                // if loop to key 0
                if (this.timeTo < this.timeFrom) {
                    this.timeTo = animation.length;
                }

                this.from = keyFrom.info;
                this.to = keyTo.info;

                // create update mask
                this.updateMask = 0;
                var precision = 0.000001;
                if (Math.abs(this.from.x - this.to.x) > precision) {
                    this.updateMask += this.UPDATE_X;
                }
                if (Math.abs(this.from.y - this.to.y) > precision) {
                    this.updateMask += this.UPDATE_Y;
                }
                if (Math.abs(this.from.scaleX - this.to.scaleX) > precision) {
                    this.updateMask += this.UPDATE_SCALE_X;
                }
                if (Math.abs(this.from.scaleY - this.to.scaleY) > precision) {
                    this.updateMask += this.UPDATE_SCALE_Y;
                }
                if (Math.abs(this.from.pivotX - this.to.pivotX) > precision) {
                    this.updateMask += this.UPDATE_PIVOT_X;
                }
                if (Math.abs(this.from.pivotY - this.to.pivotY) > precision) {
                    this.updateMask += this.UPDATE_PIVOT_Y;
                }
                if (Math.abs(this.from.alpha - this.to.alpha) > precision) {
                    this.updateMask += this.UPDATE_ALPHA;
                }
                if (Math.abs(this.from.angle - this.to.angle) > precision) {
                    this.updateMask += this.UPDATE_ANGLE;
                }

                // init data
                this.transformed.x = this.from.x;
                this.transformed.y = this.from.y;
                this.transformed.scaleX = this.from.scaleX;
                this.transformed.scaleY = this.from.scaleY;
                this.transformed.pivotX = this.from.pivotX;
                this.transformed.pivotY = this.from.pivotY;
                this.transformed.angle = this.from.angle;
                this.transformed.alpha = this.from.alpha;
            },


            tween: function (time) {
                // calculate normalized time
                //var t = Phaser.Math.clamp((time - this.timeFrom) / (this.timeTo - this.timeFrom), 0, 1);
                var t = (this.updateMask > 0) ? this.getTweenTime(time) : 0;

                // if (this.parentId == 14) console.log(this.updateMask, t);

                this.transformed.x = (this.updateMask & this.UPDATE_X) > 0 ?
                    this.linear(this.from.x, this.to.x, t) : this.from.x;
                this.transformed.y = (this.updateMask & this.UPDATE_Y) > 0 ?
                    this.linear(this.from.y, this.to.y, t) : this.from.y;

                this.transformed.scaleX = (this.updateMask & this.UPDATE_SCALE_X) > 0 ?
                    this.linear(this.from.scaleX, this.to.scaleX, t) : this.from.scaleX;
                this.transformed.scaleY = (this.updateMask & this.UPDATE_SCALE_Y) > 0 ?
                    this.linear(this.from.scaleY, this.to.scaleY, t) : this.from.scaleY;

                this.transformed.pivotX = (this.updateMask & this.UPDATE_PIVOT_X) > 0 ?
                    this.linear(this.from.pivotX, this.to.pivotX, t) : this.from.pivotX;
                this.transformed.pivotY = (this.updateMask & this.UPDATE_PIVOT_Y) > 0 ?
                    this.linear(this.from.pivotY, this.to.pivotY, t) : this.from.pivotY;

                this.transformed.alpha = (this.updateMask & this.UPDATE_ALPHA) > 0 ?
                    this.linear(this.from.alpha, this.to.alpha, t) : this.from.alpha;

                this.transformed.angle = (this.updateMask & this.UPDATE_ANGLE) > 0 ?
                    this.angleLinear(this.from.angle, this.to.angle, this.key.spin, t) : this.from.angle;
            },


            update: function (parentInfo) {
                this.transformed.angle *= this.sign(parentInfo.scaleX) * this.sign(parentInfo.scaleY);
                this.transformed.angle += parentInfo.angle;

                this.transformed.scaleX *= parentInfo.scaleX;
                this.transformed.scaleY *= parentInfo.scaleY;

                this.scalePosition(parentInfo.scaleX, parentInfo.scaleY);
                this.rotatePosition(parentInfo.angle);
                this.translatePosition(parentInfo.x, parentInfo.y);

                this.transformed.alpha *= parentInfo.alpha;


            },


            scalePosition: function (parentScaleX, parentScaleY) {
                this.transformed.x *= parentScaleX;
                this.transformed.y *= parentScaleY;
            },


            rotatePosition: function (parentAngle) {
                var x = this.transformed.x;
                var y = this.transformed.y

                if (x !== 0 || y !== 0) {
                    var rads = parentAngle * (Math.PI / 180);

                    var cos = Math.cos(rads);
                    var sin = Math.sin(rads);

                    this.transformed.x = x * cos - y * sin;
                    this.transformed.y = x * sin + y * cos;
                }
            },


            translatePosition: function (parentX, parentY) {
                this.transformed.x += parentX;
                this.transformed.y += parentY;
            },


            getTweenTime: function (time) {
                // if (this.parentId == 14) console.log(this.key);
                if (this.key.curveType === ig.SpriterCurveType.INSTANT) {
                    // console.log("instant")
                    return 0;
                }

                var t = this.clamp((time - this.timeFrom) / (this.timeTo - this.timeFrom), 0, 1);

                switch (this.key.curveType) {
                    case ig.SpriterCurveType.LINEAR:
                        return t;

                    case ig.SpriterCurveType.QUADRATIC:
                        return this.quadratic(0, this.key.c1, 1, t);

                    case ig.SpriterCurveType.CUBIC:
                        return this.cubic(0, this.key.c1, this.key.c2, 1, t);
                }

                return 0;
            },


            linear: function (a, b, t) {
                return ((b - a) * t) + a;
                // return a * (1 - t) + b * t;
            },


            quadratic: function (a, b, c, t) {
                return this.linear(this.linear(a, b, t), this.linear(b, c, t), t);
            },


            cubic: function (a, b, c, d, t) {
                return this.linear(this.quadratic(a, b, c, t), this.quadratic(b, c, d, t), t);
            },


            angleLinear: function (angleA, angleB, spin, t) {
                // no spin
                if (spin === 0) {
                    return angleA;
                }

                // spin left
                if (spin > 0) {
                    if (angleB > angleA) {
                        angleB -= 360;
                    }
                } else {    // spin right
                    if (angleB < angleA) {
                        angleB += 360;
                    }
                }

                return this.linear(angleA, angleB, t);
            },

            sign: function (x) {

                return (x < 0) ? -1 : ((x > 0) ? 1 : 0);

            },

            clamp: function (v, min, max) {

                if (v < min) {
                    return min;
                }
                else if (max < v) {
                    return max;
                }
                else {
                    return v;
                }

            },

        });
    });
