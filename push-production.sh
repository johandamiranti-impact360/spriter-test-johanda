#
# MarketJS Deployment System
# -----------------------------------------------------------------------
# Copyright (c) 2012 MarketJS Limited. Certain portions may come from 3rd parties and
# carry their own licensing terms and are referenced where applicable. 
# -----------------------------------------------------------------------

#! /bin/bash
# Usage: sh push.sh [options]
# Example: sh push.sh -b -d (bake, then deploy)

CURRENT_DIRECTORY=${PWD}/

bake (){
	echo ""
	echo "Baking ..."
	echo ""
	
	cd tools
	./bake.sh
	cd ..
	
	echo ""
	echo "Baking Done!"
	echo ""
}

secure (){
	echo ""
	echo "Preparing domainlock ..."
	echo ""		
	rm domainlock.js
	python prep_domainlock.py

	echo ""
	echo "Preparing factory domainlock ..."
	echo ""	
	prep_factory_domainlock

	echo ""
	echo "Injecting framebreaker into domainlock.js ..."
	echo ""
	python inject_framebreaker.py

	echo ""
	echo "Prep MarketJS GameCenter API ..."
	echo ""	
	prep_marketjs_gamecenter_api
		
	echo ""
	echo "Securing by obscuring ..."
	echo ""	
	php secure_production.php domainlock.js

	echo ""
	echo "Injecting domainlock ..."
	echo ""
	python inject_domainlock.py
	
	echo ""
	echo "Securing Done!"
	echo ""	
	
	rm domainlock.js
}

# Replaces to blank API, so server can autogen
prep_marketjs_gamecenter_api(){
	cp _factory/domainlock/raw.js temp.js
	sed "s/MarketJS.Initialize.*/MarketJS.Initialize('INSERT_MARKETJS_API_KEY');/g" temp.js > _factory/domainlock/raw.js
	rm temp.js
}

prep_factory_domainlock(){
	echo "Copying domainlock.js to raw.js ..."
	cp domainlock.js _factory/domainlock/temp.js
	
	echo "Removing framebreaking reference in raw.js ..."
	sed "s/this.FRAMEBREAKER.*//g" _factory/domainlock/temp.js > _factory/domainlock/raw.js
	rm _factory/domainlock/temp.js
}

compile_test_game (){
	echo "Compiling game.js for testing ..."		
	java -jar compiler.jar \
	--warning_level=QUIET \
	--js=media/text/strings.js \
	--js=settings/production.js \
	--js=settings/ad/mobile/preroll/themes/light/ad.js \
	--js=settings/ad/mobile/header/themes/light/ad.js \
	--js=settings/ad/mobile/footer/themes/light/ad.js \
	--js=settings/ad/mobile/end/themes/light/ad.js \
	--js=_factory/game/game.js \
	--js_output_file=game.js \
	--language_in=ECMASCRIPT5	
	echo "Done!"
	
	echo "Compiling game.css for testing ..."
	sh css-append.sh
	sh css-minify.sh temp.css > game.css
	sed -i.bak 's/..\/..\/..\/..\/..\/..\///g' game.css
	rm temp.css
	rm *.bak
	
	echo "Done!"
}

prep_production (){
	echo "Zipping up media files for target language ..."

	#echo '$1:' $1
	#echo '$2:' $2
	#echo '$3:' $3
	#echo '$4:' $4

	sh zip-media-folder.sh $1
	echo "Done ..."
	
	echo "Create basic index.html ..."
	cp dev.html index.html
	echo "Done ..."
	
	echo "Cleaning up paths ..."
	# Clean CSS paths
	sed -n '/settings\/ad\/mobile\/preroll\/themes\/light\/ad.css/!p' index.html > temp && mv temp index.html
	sed -n '/settings\/ad\/mobile\/header\/themes\/light\/ad.css/!p' index.html > temp && mv temp index.html
	sed -n '/settings\/ad\/mobile\/footer\/themes\/light\/ad.css/!p' index.html > temp && mv temp index.html
	sed -n '/settings\/ad\/mobile\/end\/themes\/light\/ad.css/!p' index.html > temp && mv temp index.html
	sed -n '/settings\/debug\/debug.css/!p' index.html > temp && mv temp index.html
	sed -i.bak 's/main.css/game.css/g' index.html	
	
	# Clean JS paths	
	sed -n '/glue\/jquery\/jquery-1.8.2.min.js/!p' index.html > temp && mv temp index.html
	sed -i.bak 's/glue\/load\/load.js/game.js/g' index.html
	
	# Remove temp files
	echo "Removing temp files ..."
	rm *.bak
	rm temp	
	echo "Done!"
	
	# Transfer to _factory	
	# Make 2 versions of index.html (raw and customized)
	# Raw
	sed '/<!-- SECTION GENERATED BY CODE -->/,/<!-- END OF SECTION GENERATED BY CODE -->/d' index.html > _factory/index/raw.html
	# Customized
	cp index.html _factory/index/custom.html
	
	echo "Compiling game.js for _factory ..."		
	java -jar compiler.jar \
	--warning_level=QUIET \
	--js=glue/jquery/jquery-1.8.2.min.js \
	--js=glue/orientation/handler.js \
	--js=glue/ie/ie.js \
	--js=glue/jukebox/Player.js \
	--js=glue/jukebox/Manager.js \
	--js=glue/analytics/market.js \
	--js=glue/soundjs/EventDispatcher.js \
	--js=glue/soundjs/Sound.js \
	--js=glue/soundjs/WebAudioPlugin.js \
	--js=glue/soundjs/HTMLAudioPlugin.js \
	--js=glue/soundjs/sound-manager.js \
	--js=game.min.js \
	--js_output_file=_factory/game/game.js \
	--language_in=ECMASCRIPT5
	echo "Done!"

	# Remove temp files
	echo "Removing game.min.js ..."
	rm game.min.js
	echo "Done!"		
}

deploy (){
	echo ""
	echo "Deploying ..."
	echo ""

	python2.7 boto-s3-upload-production.py -l $2 $1
	
	echo ""
	echo "Deploying Done!"
	echo ""	
}

gitpush (){
	git add .
	git commit -m $1
	git push origin master
}

# NOTE: CANNOT COMMIT TO REPOSITORY, THIS IS PRODUCTION. ONLY TRANSFER DATA TO S3
while getopts "l:bnahs:" opt; do
  case $opt in
	h)
		echo "Usage: sh push.sh [option]"
		echo "Deploy Options"
		echo "\t -b \t Build all files"
		echo "\t -l \t Select language by code (en,jp,kr,zh,de,es, etc ...)"
		echo "\t -a \t Upload all files"
		echo "\t -n \t Upload new (recent) files up to 12 hrs"
		echo "Working example (copy paste directly): sh push-production.sh -b -l en -a"
	  ;;
    l)
		echo "language to use:" $3
      ;;
    b)
		bake
		prep_production $3
		compile_test_game
		secure
      ;;
    n)
		deploy --new $3
      ;;
    a)
		deploy --all $3
      ;;
    \?)
		echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
