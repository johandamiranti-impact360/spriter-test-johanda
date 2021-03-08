ig.module('plugins.spriter.spriter-object')
    .requires(
        'plugins.spriter.spriter-bone'
    )
    .defines(function () {
        SpriterObject = SpriterBone.extend({
            spriter: null,
            sprite: null,
            image: null,
            degToRad: Math.PI / 180,
            init: function (spriter) {
                this.parent();

                this.spriter = spriter;
            },


            setOn: function (on) {
                this.parent(on);
                //set sprite to on here
            },


            setKey: function (animation, timelineId, keyId) {
                this.parent(animation, timelineId, keyId);

                // set sprite
                var spriteKey = this.key;
                var folder = this.spriter.getFolderById(spriteKey.folder);
                var file = folder.getFileById(spriteKey.file);
                var path = this.spriter.path + folder.name + "/" + file.name + ".png";

                if (this.image == null || this.image.path != path) {
                    this.image = new ig.Image(path);
                }

                // console.log(path);
                // this.sprite.frameName = file.name + ".png";
                // this.sprite.smoothed = true;
                //this.sprite.anchor.setTo(file.anchorX, file.anchorY);
            },


            update: function (parentInfo) {
                this.parent(parentInfo);
                this.updateSprite();
            },


            updateSprite: function () {
                //update sprite here, for pixi too
                var t = this.transformed;
                var img = this.image;

                if (this.on && img) {

                    var s = ig.system;
                    var ctx = s.context;
                    var w = img.width;
                    var h = img.height;
                    ctx.save();
                    if (t.alpha < 1) ctx.globalAlpha = t.alpha;
                    ctx.translate(s.getDrawPos(t.x), s.getDrawPos(t.y));
                    ctx.rotate(t.angle * this.degToRad);
                    ctx.scale(t.scaleX, t.scaleY)
                    ctx.drawImage(img.data, 0, 0, w, h, -w * t.pivotX, -h * t.pivotY, w, h);
                    ctx.restore();
                    if (t.alpha < 1) ctx.globalAlpha = 1;
                }

            }
        });
    });
