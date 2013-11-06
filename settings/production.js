// GENERATED BY SERVER CODE

/* API USE CASE
   For games with no levels, use Endgame (inject add score code, etc)
   For games with levels use Level events (Begin,End,Win,Lose,Draw)
*/
var _SETTINGS = {
	'API':{
		'Enabled':true,
		'Log':{
			'Events':{
				'InitializeGame':true,
				'EndGame':true,
				'Level':{
					'Begin':true,
					'End':true,
					'Win':true,
					'Lose':true,
					'Draw':true,
				},
			},
		},
	},
	'Ad':{
		'Mobile':{
			'Preroll':{
				'Enabled':true,	
				'Duration':5,
				'Width':300,
				'Height':250,
				'Rotation':{
					'Enabled':true,
					'Weight':{
						'MobileAdInGamePreroll':40,
						'MobileAdInGamePreroll2':40,
						'MobileAdInGamePreroll3':20,
					},
				},			
			},
			'Header':{
				'Enabled':false,	
				'Duration':5,
				'Width':320,
				'Height':50,	
				'Rotation':{
					'Enabled':true,
					'Weight':{
						'MobileAdInGameHeader':40,
						'MobileAdInGameHeader2':40,
						'MobileAdInGameHeader3':20,
					},
				},							
			},	
			'Footer':{
				'Enabled':false,	
				'Duration':5,
				'Width':320,
				'Height':50,
				'Rotation':{
					'Enabled':true,
					'Weight':{
						'MobileAdInGameFooter':40,
						'MobileAdInGameFooter2':40,
						'MobileAdInGameFooter3':20,
					},
				},								
			},	
			'End':{
				'Enabled':false,	
				'Duration':1,
				'Width':300,
				'Height':250,	
				'Rotation':{
					'Enabled':true,
					'Weight':{
						'MobileAdInGameEnd':40,
						'MobileAdInGameEnd2':40,
						'MobileAdInGameEnd3':20,
					},
				},							
			},								
		},		
	},

	'Language':{
		'Default':'en',		
	},
		
	'Branding':{
		'Splash':{
			'Enabled':false,
		},
		'Logo':{
			'Enabled':false,
			'Link':'http://google.com',
			'Width':280,
			'Height':34,
		}
	},	
	
	'Gamecenter':{
		'Enabled':true,
	},
};
