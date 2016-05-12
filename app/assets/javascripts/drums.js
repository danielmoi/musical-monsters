var MM = MM || {};

// SoundCloud details
MM.soundCloudID = "3b2585ef4a5eff04935abe84aad5f3f3";
MM.clientID = "client_id=3b2585ef4a5eff04935abe84aad5f3f3";
MM.soundcloudURL = 'https://api.soundcloud.com/tracks/293';
MM.trackPermalinkUrl = "https://soundcloud.com/the-outsider/the-outsider-death-by-melody";

/////////////////////////////////////////////////////////////////////////////

// Setup Audio environment
MM.audioContext = new AudioContext();
MM.audioElement = new Audio();
MM.audioElement.crossOrigin = "anonymous";

// Get stream
MM.getStream = $.ajax({
  url: MM.soundcloudURL + '?' + MM.clientID
}).done(function(res){
  MM.streamURL = res.stream_url + '?' + MM.clientID;
  MM.audioElement.src = MM.streamURL;

  MM.source = MM.audioContext.createMediaElementSource(MM.audioElement);
  MM.source.connect(MM.audioContext.destination);



  console.log('end of getStream');
});

$('#start').on('click', function(){
  MM.audioElement.play();
});
$('#pause').on('click', function() {
  MM.audioElement.pause();
});
/////////////////////////////////////////////////////////////////////////////

// Preload sounds for instruments
var arrSounds = [];

function preloadSounds(arr) {
  for (var i = 0; i < arr.length; i++) {
    arrSounds[i] = new Audio();
    arrSounds[i].src = arr[i];
  }
}

//preload 3 images:
preloadSounds(['/sounds/snare.mp3', '/sounds/hi-hat.mp3', '/sounds/bass.mp3', '/sounds/crash.mp3']);

var stickRight = $('#stick-right');
var stickLeft = $('#stick-left');
var pedal = $('#pedal');

/////////////////////////////////////////////////////////////////////////////

var tlStickR = new TimelineLite({
  paused: true
});
tlStickR.to(stickRight, 0.2, {
  rotation: 15,
  transformOrigin: '0% 100%',
  ease: Power0.easeIn
});
tlStickR.to(stickRight, 0.2, {
  rotation: 0,
  transformOrigin: '0% 100%',
  ease: Power0.easeIn
});

var moveStickR = function() {
  tlStickR.restart();
  arrSounds[1].currentTime = 0;
  arrSounds[1].play();
};

/////////////////////////////////////////////////////////////////////////////

var tlStickLdown = new TimelineLite({
  paused: true
});
tlStickLdown.to(stickLeft, 0.2, {
  rotation: -25,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});
tlStickLdown.to(stickLeft, 0.2, {
  rotation: 0,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});


var moveStickLdown = function() {
  tlStickLdown.restart();
  arrSounds[0].currentTime = 0;
  arrSounds[0].play();
};

/////////////////////////////////////////////////////////////////////////////
var tlStickLup = new TimelineLite({
  paused: true
});
tlStickLup.to(stickLeft, 0.2, {
  rotation: 18,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});
tlStickLup.to(stickLeft, 0.2, {
  rotation: 0,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});

var moveStickLup = function() {
  tlStickLup.restart();
  arrSounds[3].currentTime = 0;
  arrSounds[3].play();
};

/////////////////////////////////////////////////////////////////////////////

var tlPedal = new TimelineLite({
  paused: true
});
tlPedal.to(pedal, 0.2, {
  rotation: 30,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});
tlPedal.to(pedal, 0.2, {
  rotation: 0,
  transformOrigin: '100% 100%',
  ease: Power0.easeIn
});


var movePedal = function() {
  tlPedal.restart();
  arrSounds[2].currentTime = 0;
  arrSounds[2].play();
};

/////////////////////////////////////////////////////////////////////////////

var tlFlourish = new TimelineLite({
  paused: true
});
tlFlourish.to([stickLeft, stickRight], 0.4, {
  rotation: 720,
  transformOrigin: '50% 50%',
  ease: Power0.easeIn
});
tlFlourish.to([stickLeft, stickRight], 0.2, {
  y: '-250',
  ease: Power0.easeIn,
  repeat: 1,
  yoyo: true
}, '-=0.4');

var flourish = function() {
  tlFlourish.restart();
};

/////////////////////////////////////////////////////////////////////////////

$('#hi-hat').on('click', moveStickR);
$('#snare').on('click', moveStickLdown);
$('#bass').on('click', movePedal);
$('#cymbal').on('click', moveStickLup);
$('#fini').on('click', flourish);

$(document).on('keydown', function(e) {
  // S key
  if (e.keyCode === 83) {
    $('#snare').trigger('click');
  }

  // H key
  if (e.keyCode === 72) {
    $('#hi-hat').trigger('click');
  }
  if (e.keyCode === 66) {
    $('#bass').trigger('click');
  }
  if (e.keyCode === 87) {
    $('#cymbal').trigger('click');
  }
  if (e.keyCode === 70) {
    // $('#fini').trigger('click');
  }
});
