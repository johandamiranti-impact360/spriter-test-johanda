ig.module(
    'plugins.audio.webaudio-music-player'
)
.requires(
    'plugins.audio.sound-player'
)
.defines(function(){
    WebaudioMusicPlayer = SoundPlayer.extend({
        tagName:"WebaudioMusicPlayer",
        bgmPlaying:false,
        isSupported:false,

        pausedTime: 0,
        webaudio: null,

        soundList:{

        },

        init: function(list,options) {
            this.parent(list,options);

            this.webaudio = {
                compatibility: {},
                gainNode: null,
                buffer: null,
                source_loop: {},
                source_once: {}
            };

            //References:
            // https://forestmist.org/blog/web-audio-api-loops
            // http://www.html5rocks.com/en/tutorials/webaudio/intro/

            try {
                // More info at http://caniuse.com/#feat=audio-api
                this.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.webaudio.context = new this.AudioContext();
                this.isSupported = true;

            } catch(e) {
                console.log('Web Audio API not supported in this browser.');
                return;
            }

            if(ig.ua.iOS){
                this.initIOSWebAudioUnlock();
            }

            this.webaudio.gainNode = this.webaudio.context.createGain();
            this.webaudio.gainNode.connect(this.webaudio.context.destination);

            //---------------
            // Compatibility
            //---------------
            var start = 'start',
                stop = 'stop',
                buffer = this.webaudio.context.createBufferSource();

            if (typeof buffer.start !== 'function') {
                start = 'noteOn';
            }
            this.webaudio.compatibility.start = start;

            if (typeof buffer.stop !== 'function') {
                stop = 'noteOff';
            }
            this.webaudio.compatibility.stop = stop;

            //-------------------------------
            // Setup Audio File
            //-------------------------------
            for(var soundName in list)
            {
                this.soundList[soundName] = soundName;

                var soundPath = list[soundName].path;
                var pathOgg = soundPath+"."+ig.Sound.FORMAT.OGG.ext;
                var pathMp3 = soundPath+"."+ig.Sound.FORMAT.MP3.ext;

                var path = pathOgg;
                if(ig.ua.iOS){
                    path = pathMp3;
                }

                var req = new XMLHttpRequest();
                req.open('GET', path, true);
                req.responseType = 'arraybuffer';
                req.onload = function() {
                    this.webaudio.context.decodeAudioData(
                        req.response,
                        function(buffer) {
                            this.webaudio.buffer = buffer;
                            this.webaudio.source_loop = {};
                            if(this.bgmPlaying){
                                this.play();
                            }else{
                                this.stop();
                            }
                        }.bind(this),
                        function() {
                            console.log('Error decoding audio "' + path + '".');
                        }
                    );
                }.bind(this);
                req.send();

                // limit 1 file for now
                return;
            }
        },
        initIOSWebAudioUnlock:function(){
            // call this method on touch end to create and play a buffer,
            // then check if the audio actually played to determine if
            // audio has now been unlocked on iOS
            var unlock = function() {
                var ctx = ig.soundHandler.bgmPlayer.webaudio.context;
                // create an empty buffer
                var buffer = ctx.createBuffer(1, 1, 22050);
                var source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);

                // play the empty buffer
                if (typeof source.start === 'undefined') {
                  source.noteOn(0);
                } else {
                  source.start(0);
                }

                // setup a timeout to check that we are unlocked on the next event loop
                setTimeout(function() {
                  if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
                    // update the unlocked state and prevent this check from happening again
                    //self._iOSEnabled = true;
                    //self.iOSAutoEnable = false;

                    // remove the touch start listener
                    window.removeEventListener('touchend', unlock, false);
                  }
                }, 0);
            };

            // setup a touch start listener to attempt an unlock in
            window.addEventListener('touchend', unlock, false);
        },
        play:function(id)
        {
            if(!this.isSupported) return;
            if(!this.webaudio.buffer) {
                this.bgmPlaying = true;
                return;
            }

            if(!this.muteFlag)
            {
                this.bgmPlaying = true;

                if (this.webaudio.source_loop._playing) {
                    //this.stop();
                } else {
                    this.webaudio.source_loop = this.webaudio.context.createBufferSource();
                    this.webaudio.source_loop.buffer = this.webaudio.buffer;
                    this.webaudio.source_loop.loop = true;
                    this.webaudio.source_loop.connect(this.webaudio.gainNode);

                    var offset = 0;
                    if(this.pausedTime){
                        offset = this.pausedTime;
                    }
                    this.webaudio.source_loop._startTime = this.webaudio.context.currentTime;

                    if (this.webaudio.compatibility.start === 'noteOn') {
                        /*
                        The depreciated noteOn() function does not support offsets.
                        Compensate by using noteGrainOn() with an offset to play once and then schedule a noteOn() call to loop after that.
                        */
                        this.webaudio.source_once = this.webaudio.context.createBufferSource();
                        this.webaudio.source_once.buffer = this.webaudio.buffer;
                        this.webaudio.source_once.connect(this.webaudio.gainNode);
                        this.webaudio.source_once.noteGrainOn(0, offset, this.webaudio.buffer.duration - offset); // currentTime, offset, duration
                        /*
                        Note about the third parameter of noteGrainOn().
                        If your sound is 10 seconds long, your offset 5 and duration 5 then you'll get what you expect.
                        If your sound is 10 seconds long, your offset 5 and duration 10 then the sound will play from the start instead of the offset.
                        */

                        // Now queue up our looping sound to start immediatly after the source_once audio plays.
                        this.webaudio.source_loop[this.webaudio.compatibility.start](this.webaudio.context.currentTime + (this.webaudio.buffer.duration - offset));
                    } else {
                        this.webaudio.source_loop[this.webaudio.compatibility.start](0, offset);
                    }

                    this.webaudio.source_loop._playing = true;
                }
            }
        },
        stop:function(id)
        {
            this.bgmPlaying = false;
            if(!this.isSupported) return;

            if (this.webaudio.source_loop._playing) {
                this.webaudio.source_loop[this.webaudio.compatibility.stop](0);
                this.webaudio.source_loop._playing = false;
                this.pausedTime = this.webaudio.context.currentTime % this.webaudio.source_loop.buffer.duration;
                this.webaudio.source_loop._startTime = 0;
                if (this.webaudio.compatibility.start === 'noteOn') {
                    this.webaudio.source_once[this.webaudio.compatibility.stop](0);
                }
            }
        },
        volume:function(value)
        {
            if(!this.isSupported) return;
            if(!this.webaudio.gainNode) return;

            this.webaudio.gainNode.gain.value = value;
        },
        getVolume:function()
        {
            if(!this.isSupported) return 0;
            if(!this.webaudio.gainNode) return 0;

            return this.webaudio.gainNode.gain.value;
        },

        mute:function(option)
        {
            this.parent(option);
            if(this.bgmPlaying)
            {
                this.stop();
            }
        },
        unmute:function(option)
        {
            this.parent(option);
            this.play();
        }

    });
});

