/**
 *  Vector
 *
 *  Created by Justin Ng on 2015-03-05.
 *  Copyright (c) 2015 __MyCompanyName__. All rights reserved.
 */
ig.module('plugins.data.vector')
.requires(
)
.defines(function () {
    Vector2 = ig.Class.extend({
		x:null,
		y:null,
		valType:"number",
		init: function (x,y)
		{
			if(typeof(x) === this.valType
				&& typeof(y) === this.valType)
			{
				this.x=x;
				this.y=y;
			}
        },
		row:function(y)
		{
			if(typeof(y)===this.valType)
			{
				this.y = y;
			}
			return this.y;
		},
		col:function(x)
		{
			if(typeof(x)===this.valType)
			{
				this.x=x;
			}
			return this.x;
		},
    });
});