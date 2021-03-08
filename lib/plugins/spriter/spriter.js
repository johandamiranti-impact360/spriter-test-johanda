ig.module('plugins.spriter.spriter')
    .requires(
        'impact.impact',
        'plugins.spriter.structure.animation',
        'plugins.spriter.structure.bone-timeline-key',
        'plugins.spriter.structure.curve-type',
        'plugins.spriter.structure.entity',
        'plugins.spriter.structure.file',
        'plugins.spriter.structure.folder',
        'plugins.spriter.structure.main-line-key',
        'plugins.spriter.structure.object-info',
        'plugins.spriter.structure.object-timeline-key',
        'plugins.spriter.structure.object-type',
        'plugins.spriter.structure.ref',
        'plugins.spriter.structure.spatial-info',
        'plugins.spriter.structure.spatial-timeline-key',
        'plugins.spriter.structure.timeline-key',
        'plugins.spriter.structure.timeline',
        'plugins.spriter.id-name-map',
        'plugins.spriter.loader',
        'plugins.spriter.scml',
        'plugins.spriter.spriter-bone',
        'plugins.spriter.spriter-display',
        'plugins.spriter.spriter-object'
    )
    .defines(function () {
        Spriter = ig.Class.extend({
            folders: null,
            entities: null,
            path: "",

            init: function () {
                this.folders = new SpriterIdNameMap();
                this.entities = new SpriterIdNameMap();
            },

            addFolder: function (folder) {
                this.folders.add(folder, folder.id, folder.name);
            },


            getFolderById: function (id) {
                return this.folders.getById(id);
            },


            getFolderByName: function (name) {
                return this.folders.getByName(name);
            },


            addEntity: function (entitiy) {
                this.entities.add(entitiy, entitiy.id, entitiy.name);
            },


            getEntityById: function (id) {
                return this.entities.getById(id);
            },


            getEntityByName: function (name) {
                return this.entities.getByName(name);
            },

        });
    });