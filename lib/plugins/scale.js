/*
 * Scale Individual Entities Plugin
 * Written By Abraham Walters
 * June 2012
 *
 * Added if(this.currentAnim != null) to fix the null current anim issue
 * 
 * Feb 2018
 * Added autoUpdateScale property to call setScale() on each draw cycle, so the scale can be tweened easily
 * 
 */
ig.module(
	'plugins.scale'
)
	.requires(
		'impact.entity'
	)
	.defines(function () {
		ig.Entity.inject({

			autoUpdateScale: true,		//whether it called setScale when current scale is different (useful when tweening scale)

			scale: { x: 1, y: 1 },		//user-defined scale
			_offset: { x: 0, y: 0 },	//cached offset prior to scaling
			_scale: { x: 1, y: 1 },		//scale relative to ig.system.scale
			_size: { x: 0, y: 0 },		//cached size prior to scaling
			_prevScale: { x: 0, y: 0 },		//previous user-defined scale, to detect whether it has changed.

			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this._offset.x = this.offset.x;
				this._offset.y = this.offset.y;
				this._size.x = this.size.x;
				this._size.y = this.size.y;
				this.setScale(this.scale.x, this.scale.y);
			},

			draw: function () {
				if (this.autoUpdateScale && (this.scale.x != this._prevScale.x || this.scale.y != this._prevScale.y)) {
					this._scale.x = this.scale.x;
					this._scale.y = this.scale.y;
					this.setScale(this.scale.x, this.scale.y);
				}

				//calculate/draw if it has animation
				if (this.currentAnim != null) {

					//if it's scaled, calculate scaling and then draw
					if (this.scale.x != 1 || this.scale.y != 1) {
						var ctx = ig.system.context;
						ctx.save();
						ctx.translate(
							ig.system.getDrawPos(this.pos.x.round() - this.offset.x - ig.game.screen.x),
							ig.system.getDrawPos(this.pos.y.round() - this.offset.y - ig.game.screen.y)
						);

						ctx.scale(this._scale.x, this._scale.y);
						this.currentAnim.draw(0, 0);

						ctx.restore();
					}
					//if not scaled, then just draw
					else {
						this.currentAnim.draw(
							this.pos.x - this.offset.x - ig.game._rscreen.x,
							this.pos.y - this.offset.y - ig.game._rscreen.y
						);
					}
				}

			},

			setScale: function (x, y) {

				//cache size prior to scaling
				var oX = this.size.x,
					oY = this.size.y;

				//set scale
				this.scale.x = x || this.scale.x;
				this.scale.y = y || this.scale.y;

				//set scale relative to game scale
				this._scale.x = this.scale.x / ig.system.scale;
				this._scale.y = this.scale.y / ig.system.scale;

				//scale offset
				this.offset.x = this._offset.x * this._scale.x;
				this.offset.y = this._offset.y * this._scale.y;

				//scale size
				this.size.x = this._size.x * this._scale.x;
				this.size.y = this._size.y * this._scale.y;

				//offset entity's position by the change in size
				this.pos.x += (oX - this.size.x) / 2;
				this.pos.y += (oY - this.size.y) / 2;

			},

		});

	});
