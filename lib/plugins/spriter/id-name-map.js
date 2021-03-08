ig.module('plugins.spriter.id-name-map')
    .requires(
        'impact.impact'
    )
    .defines(function () {
        SpriterIdNameMap = ig.Class.extend({

            items: [],
            itemNames: [],

            add: function (item, id, name) {
                if (id === undefined) {
                    id = this.items.length;
                }

                if (name === undefined || name === null) {
                    name = "item_" + id;
                }

                this.items[id] = item;
                this.itemNames[name] = id;
            },

            getById: function (id) {
                return this.items[id];
            },

            getByName: function (name) {
                var id = this.itemNames[name];
                return this.getById(id);
            },

            getLength: function () {
                return this.items.length;
            }
        });
    })
