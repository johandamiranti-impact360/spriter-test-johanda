ig.module('game.entities.button-more-games')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityButtonMoreGames = ig.Entity.extend({
		gravityFactor:0,
		logo: new ig.AnimationSheet('media/graphics/sprites/btn_more_games.png',64,66),
		size:{x:64,
			y:66,
		},
		zIndex: 750,

		init:function(x,y,settings){
			this.parent(x,y,settings);
			
			// init stuff here
			if(typeof(wm)=='undefined'){
				if(!_SETTINGS['MoreGames']['Enabled']){
					this.kill();
				}else{
					// NEW FUNCTION
					var div_layer_name;
					if(settings.div_layer_name){
						console.log('settings found ... using that div layer name')
						div_layer_name = settings.div_layer_name;
					}else{
						div_layer_name = 'more-games'
					}
					// BUILD CLICKABLE LAYER
					console.log('div_layer_name:',div_layer_name)
					this.checkClickableLayer(div_layer_name,_SETTINGS['MoreGames']['Link'],_SETTINGS['MoreGames']['NewWindow']);					
				}
			}
			
			this.anims.idle = new ig.Animation(this.logo,0,[0], true);
			this.currentAnim = this.anims.idle;			
		},

		doesClickableLayerExist:function(id){
			for(k in dynamicClickableEntityDivs){
				
				if(k==id){
					console.log('clickable layer already exists ...')
					return true;
				}
			}			
			console.log('doesnt exist yet ...')
			return false;	
		},

		checkClickableLayer:function(divID,outboundLink,open_new_window){
			if(typeof(wm)=='undefined'){				
				// IF LAYER ALREADY EXISTS, SHOW OVERLAY. ELSE, CREATE CLICKABLE LAYER
				if(this.doesClickableLayerExist(divID)){
					// SHOW OVERLAY
					ig.game.showOverlay([divID]);
					
					// REINJECT NEW LINK
					$('#'+divID).find('[href]').attr('href',outboundLink);
					
				}else{
					this.createClickableOutboundLayer(divID,outboundLink,'media/graphics/misc/invisible.png',open_new_window);
				}							
			}			
		},
								
		// WORKAROUND BECAUSE CANVAS CANNOT BE CLICKED TO AN OUTBOUND LINK. TOLERATES RESIZING
		createClickableOutboundLayer:function(id,outbound_link,image_path,open_new_window){			
			// CREATE LAYER
		    var div = ig.$new('div');
		    div.id = id;
		    document.body.appendChild(div);
    		
			// ADJUST LAYER
			$('#'+div.id).css('float','left');
			$('#'+div.id).css('position','absolute');
			
			if(ig.ua.mobile){//w == mobileWidth){
				var heightRatio = window.innerHeight / mobileHeight ;
				var widthRatio = window.innerWidth / mobileWidth ;
				$('#'+div.id).css('left',this.pos.x*widthRatio);
				$('#'+div.id).css('top',this.pos.y*heightRatio);
				$('#'+div.id).css('width',this.size.x*widthRatio);
				$('#'+div.id).css('height',this.size.y*heightRatio);
			}else{
				var offsetLeft = document.getElementById('game').offsetLeft ;
				var offsetTop = document.getElementById('game').offsetTop ;
				$('#'+div.id).css('left',offsetLeft + this.pos.x*multiplier);
				$('#'+div.id).css('top',offsetTop + this.pos.y*multiplier);		
				$('#'+div.id).css('width',this.size.x*multiplier);
				$('#'+div.id).css('height',this.size.y*multiplier);
			}
			
			// INJECT LINK AND IMAGE
			if(open_new_window){
				$('#'+div.id).html('<a target=\'_blank\' href=\'' + outbound_link + '\'><img style=\'width:100%;height:100%\' src=\'' + image_path + '\'></a>');
			}else{
				$('#'+div.id).html('<a href=\'' + outbound_link + '\'><img style=\'width:100%;height:100%\' src=\'' + image_path + '\'></a>');				
			}

			// ADD TO HANDLER FOR RESIZING
			dynamicClickableEntityDivs[id] = {};
			dynamicClickableEntityDivs[id]['width'] = this.size.x*multiplier;
			dynamicClickableEntityDivs[id]['height'] = this.size.y*multiplier;
			dynamicClickableEntityDivs[id]['entity_pos_x'] = this.pos.x; 
			dynamicClickableEntityDivs[id]['entity_pos_y'] = this.pos.y; 
		},	
	});
});