/*
* Game's gamepad, contains the bindings you wish
*/
ig.module(
    'plugins.io.mouse'
)
.requires(
)
.defines(function(){

    Mouse = ig.Class.extend({
        
        bindings:{
            click:[ig.KEY.MOUSE1]
        },
        init:function()
        {
            // Mouse
            ig.input.initMouse();
            for(var key in this.bindings)
            {
                this[key] = key;
                for(var i = 0;i<this.bindings[key].length;i++)
                {
                    ig.input.bind(this.bindings[key][i],key);
                }
            }
        },
        getPos:function()
        {
            if(ig.ua.mobile)
            {
                var currentMousePosX = ig.input.mouse.x / ig.sizeHandler.sizeRatio.x;
                var currentMousePosY = ig.input.mouse.y / ig.sizeHandler.sizeRatio.y;

                //console.log(currentMousePosX + ', ' + currentMousePosY);

                return new Vector2(currentMousePosX/ig.sizeHandler.scaleRatioMultiplier.x,
                                   currentMousePosY/ig.sizeHandler.scaleRatioMultiplier.y);

            }
            else
            {
                var currentMousePosX = ig.input.mouse.x / ig.sizeHandler.sizeRatio.x;
                var currentMousePosY = ig.input.mouse.y / ig.sizeHandler.sizeRatio.y;

                //console.log(currentMousePosX + ', ' + currentMousePosY);

                return new Vector2(currentMousePosX,
                                   currentMousePosY);
            }
        },
    });
});