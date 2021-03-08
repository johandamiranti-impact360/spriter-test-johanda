ig.module('plugins.spriter.structure.folder')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterFolder = ig.Class.extend({
            id: 0,
            name: "",
            files: null,

            init: function (id, name) {
                this.id = id;
                this.name = name;
                this.files = new SpriterIdNameMap();

            },

            addFile: function (file) {
                this.files.add(file, file.id, file.name);
            },

            getFileById: function (id) {
                return this.files.getById(id);
            },

            getFileByName: function (name) {
                return this.files.getByName(name);
            }
        });
    });