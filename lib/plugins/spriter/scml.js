ig.module('plugins.spriter.scml')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterScml = ig.Class.extend({
            data: null,
            spriter: null,
            loaded: false,
            failed: false,
            loadCallback: null,
            path: '',


            staticInstantiate: function (path) {
                return SpriterScml.cache[path] || null;
            },


            init: function (path) {
                this.path = path;
                this.load();
            },


            load: function (loadCallback) {
                if (this.loaded) {
                    if (loadCallback) {
                        loadCallback(this.path, true);
                    }
                    return;
                }
                else if (!this.loaded && ig.ready) {
                    this.loadCallback = loadCallback || null;
                    $.ajax(ig.prefix + this.path + ig.nocache, {
                        dataType: 'text',
                        success: function (data) {
                            this.loaded = true;
                            this.data = data;
                            this.spriter = new SpriterLoader().load(this);
                            //TODO: load all the image too
                            if (this.loadCallback) {
                                loadCallback(this.path, true)
                            }
                        }.bind(this),
                        error: function () {
                            this.failed = true;
                            if (this.loadCallback) {
                                this.loadCallback(this.path, false);
                            }
                        }.bind(this)
                    });
                }
                else {
                    ig.addResource(this);
                }

                SpriterScml.cache[this.path] = this;
            },
        });

        SpriterScml.cache = {};
    });