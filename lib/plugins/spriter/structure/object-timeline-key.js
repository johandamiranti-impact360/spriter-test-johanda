ig.module('plugins.spriter.structure.object-timeline-key')
    .requires(
        'plugins.spriter.structure.spatial-timeline-key'
    )
    .defines(function () {
        SpriterObjectTimelineKey = SpriterSpatialTimelineKey.extend({
            folder: 0,
            file: 0,
            init: function (id, time, spin) {
                this.parent(id, time, spin);
            },
            setFolderAndFile: function (folder, file) {
                this.folder = folder;
                this.file = file;
            }
        });
    });