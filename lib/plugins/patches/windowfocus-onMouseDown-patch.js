// Jason Low's Window Focus onMouseDown Patch
// adds window.focus() on mouseDown event
// ver 1.0

// How To Use:
// 1- Copy plugin to plugin directory
// 2- include plugin in impact.main

// Usage Examples:
/*
ig.module(
    "game.main"
)
.requires(
    //IMPACT
    "impact.game",
    "plugins.windowfocus-onMouseDown-patch",
)
*/

ig.module(
    "plugins.patches.windowfocus-onMouseDown-patch"
).requires(
).defines(function () {

    //override
    ig.Input.keydown = function( event ) {
        var tag = event.target.tagName;
        if( tag == 'INPUT' || tag == 'TEXTAREA' ) { return; }

        var code = event.type == 'keydown'
            ? event.keyCode
            : (event.button == 2 ? ig.KEY.MOUSE2 : ig.KEY.MOUSE1);

        if( code < 0 ) {
            window.focus();
        }

        if( event.type == 'touchstart' || event.type == 'mousedown' ) {
            this.mousemove( event );
        }

        var action = this.bindings[code];
        if( action ) {
            this.actions[action] = true;
            if( !this.locks[action] ) {
                this.presses[action] = true;
                this.locks[action] = true;
            }
            event.stopPropagation();
            event.preventDefault();
        }
    }

});
