ig.module('plugins.spriter.loader')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterLoader = ig.Class.extend({

            spriter: null,

            getFileNameWithoutExtension: function (path) {
                var name = (path.split('\\').pop().split('/').pop().split('.'))[0];
                return name;
            },

            getDirectoryPath: function (path) {
                var arr = path.split('\\').pop().split('/');
                arr.pop();
                return arr.join("/") + "/";
            },

            parseInt: function (element, attributeName, defaultValue) {
                if (defaultValue === undefined) defaultValue = 0;
                var value = element.getAttribute(attributeName);
                return value !== null ? parseInt(value) : defaultValue;
            },

            parseFloat: function (element, attributeName, defaultValue) {
                if (defaultValue === undefined) defaultValue = 0;
                var value = element.getAttribute(attributeName);
                return value !== null ? parseFloat(value) : defaultValue;
            },

            parseString: function (element, attributeName, defaultValue) {
                if (defaultValue === undefined) defaultValue = "";
                var value = element.getAttribute(attributeName);
                return value !== null ? value : defaultValue;
            },

            load: function (scml) {
                if (!ig.spriterHasPrint) {
                    ig.spriterHasPrint = true
                    console.log("Spriter plugin version 1.0.2");
                }
                var data = $.parseXML(scml.data);

                this.spriter = new Spriter();
                this.spriter.path = this.getDirectoryPath(scml.path);

                // folders and files
                var folders = data.getElementsByTagName("folder");
                this.loadFolders(this.spriter, folders);

                // entity
                var entities = data.getElementsByTagName("entity");
                this.loadEntities(this.spriter, entities);

                return this.spriter;
            },

            loadFolders: function (spriter, folders) {
                // through all folders
                for (var i = 0; i < folders.length; i++) {
                    var folderElm = folders.item(i);

                    var folder = new SpriterFolder(this.parseInt(folderElm, "id"), folderElm.getAttribute("name"));

                    // images in folder
                    var files = folderElm.getElementsByTagName("file");
                    this.loadFiles(folder, files);

                    // add folder to spriter object
                    spriter.addFolder(folder);
                }
            },

            loadFiles: function (folder, files) {
                for (var f = 0; f < files.length; f++) {
                    var fileElm = files[f];

                    var file = new SpriterFile(
                        this.parseInt(fileElm, "id"),
                        this.getFileNameWithoutExtension(fileElm.getAttribute("name")),
                        this.parseFloat(fileElm, "pivot_x"),
                        1 - this.parseFloat(fileElm, "pivot_y"));

                    folder.addFile(file);
                    var imagePath = this.spriter.path + folder.name + "/" + file.name + ".png";
                    new ig.Image(imagePath);
                    // console.log(imagePath);
                }
            },

            loadEntities: function (spriter, entities) {
                for (var i = 0; i < entities.length; i++) {
                    var entityElm = entities.item(i);

                    var entity = new SpriterEntity(this.parseInt(entityElm, "id"), entityElm.getAttribute("name"));

                    var bones = entityElm.getElementsByTagName("obj_info");
                    this.loadBones(entity, bones);

                    var animations = entityElm.getElementsByTagName("animation");
                    this.loadAnimations(entity, animations);

                    spriter.addEntity(entity);
                }
            },

            loadBones: function (entity, bones) {
                for (var i = 0; i < bones.length; i++) {
                    var boneElm = bones.item(i);

                    var bone = new SpriterObjectInfo(i,
                        boneElm.getAttribute("name"),
                        SpriterObjectType.getObjectTypeForName(boneElm.getAttribute("type")),
                        this.parseFloat(boneElm, "w"),
                        this.parseFloat(boneElm, "h"));

                    entity.addObjectInfo(bone);
                }
            },

            // -------------------------------------------------------------------------
            loadAnimations: function (entity, animations) {
                for (var i = 0; i < animations.length; i++) {
                    var animationElm = animations.item(i);

                    var animation = new SpriterAnimation(
                        this.parseInt(animationElm, "id"),
                        animationElm.getAttribute("name"),
                        this.parseFloat(animationElm, "length"),
                        this.parseString(animationElm, "looping", "true") === "true" ? SpriterAnimationLooping.LOOPING : SpriterAnimationLooping.NO_LOOPING);

                    // main line keys
                    // var mainLineKeys = animationElm.firstElementChild.getElementsByTagName("key");
                    var mainLineKeys = animationElm.getElementsByTagName("mainline")[0].getElementsByTagName("key");
                    this.loadMainLineKeys(animation, mainLineKeys);

                    // timelines
                    var timelines = animationElm.getElementsByTagName("timeline");
                    this.loadTimelines(animation, timelines);

                    animation.updateCurve();

                    entity.addAnimation(animation);
                }
            },

            loadMainLineKeys: function (animation, mainLineKeys) {
                for (var i = 0; i < mainLineKeys.length; i++) {
                    var keyElm = mainLineKeys.item(i);

                    var mainLineKey = new SpriterMainLineKey(this.parseFloat(keyElm, "time"));
                    // other curve than linear?

                    var curve = this.parseString(keyElm, "curve_type", "linear");
                    // console.log(keyElm)
                    if (curve !== "linear") {
                        mainLineKey.setCurve(ig.SpriterCurveType.getCurveTypeForName(curve),
                            this.parseFloat(keyElm, "c1", 0),
                            this.parseFloat(keyElm, "c2", 0),
                            this.parseFloat(keyElm, "c3", 0),
                            this.parseFloat(keyElm, "c4", 0));
                    }

                    // load bone refs
                    var boneRefs = keyElm.getElementsByTagName("bone_ref");
                    for (var b = 0; b < boneRefs.length; b++) {
                        mainLineKey.addBoneRef(this.loadRef(boneRefs.item(b)));
                    }

                    // load sprite refs (object refs)
                    var spriteRefs = keyElm.getElementsByTagName("object_ref");
                    for (var s = 0; s < spriteRefs.length; s++) {
                        mainLineKey.addObjectRef(this.loadRef(spriteRefs.item(s)));
                    }

                    animation.addMainLineKey(mainLineKey);
                }
            },

            loadRef: function (refElement) {
                var ref = new SpriterRef(this.parseInt(refElement, "id"),
                    this.parseInt(refElement, "parent", -1),
                    this.parseInt(refElement, "timeline"),
                    this.parseInt(refElement, "key"),
                    this.parseInt(refElement, "z_index"));

                return ref;
            },

            // -------------------------------------------------------------------------
            loadTimelines: function (animation, timelines) {
                for (var i = 0; i < timelines.length; i++) {
                    var timelineElm = timelines.item(i);

                    var timeline = new SpriterTimeline(
                        this.parseInt(timelineElm, "id"),
                        timelineElm.getAttribute("name"),
                        timelineElm.getAttribute("object_type") === "bone" ? SpriterObjectType.BONE : SpriterObjectType.SPRITE,
                        this.parseInt(timelineElm, "obj", -1));

                    var keys = timelineElm.getElementsByTagName("key");
                    this.loadTimelineKeys(timeline, keys);

                    animation.addTimeline(timeline);
                }
            },

            loadTimelineKeys: function (timeline, keys) {
                for (var i = 0; i < keys.length; i++) {
                    var keyElm = keys.item(i);

                    // sprite or bone key?
                    var key = null;
                    var keyDataElm = keyElm.firstElementChild;

                    var time = this.parseInt(keyElm, "time");
                    var spin = this.parseInt(keyElm, "spin", 1);

                    var isSprite = false;

                    if (keyDataElm.tagName === "bone") {
                        key = new SpriterBoneTimelineKey(i, time, spin);
                    } else if (keyDataElm.tagName === "object") {
                        key = new SpriterObjectTimelineKey(i, time, spin);
                        isSprite = true;
                    } else {
                        console.warn("Unknown key type: " + keyDataElm.tagName);
                    }

                    // other curve than linear?
                    var curve = this.parseString(keyElm, "curve_type", "linear");
                    // console.log(keyElm)
                    if (curve !== "linear") {
                        key.setCurve(ig.SpriterCurveType.getCurveTypeForName(curve),
                            this.parseFloat(keyElm, "c1", 0),
                            this.parseFloat(keyElm, "c2", 0),
                            this.parseFloat(keyElm, "c3", 0),
                            this.parseFloat(keyElm, "c4", 0));
                    }

                    // spatial info
                    var info = key.info;

                    info.x = this.parseFloat(keyDataElm, "x");
                    info.y = -this.parseFloat(keyDataElm, "y");
                    info.scaleX = this.parseFloat(keyDataElm, "scale_x", 1);
                    info.scaleY = this.parseFloat(keyDataElm, "scale_y", 1);
                    info.angle = 360 - this.parseFloat(keyDataElm, "angle");
                    info.alpha = this.parseFloat(keyDataElm, "a", 1);

                    if (isSprite) {
                        // sprite specific - set file and folder
                        var folderId = this.parseInt(keyDataElm, "folder");
                        var fileId = this.parseInt(keyDataElm, "file");
                        key.setFolderAndFile(folderId, fileId);
                        // set pivot in spatial info different from default (based on pivot in file)
                        var file = this.spriter.getFolderById(folderId).getFileById(fileId);
                        info.pivotX = this.parseFloat(keyDataElm, "pivot_x", file.anchorX);
                        info.pivotY = this.parseFloat(keyDataElm, "pivot_y", file.anchorY);
                    }

                    timeline.addKey(key);
                }
            }
        });
    });                                                                
