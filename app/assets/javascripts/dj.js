var MM = MM || {};

MM.audioContext = new AudioContext();

MM.arrTracks = [
  '/sounds/loop-s1.wav',
  '/sounds/loop-s2.wav',
  '/sounds/loop-s3.wav',
  '/sounds/loop-f1.wav',
  '/sounds/loop-f2.wav',
  '/sounds/loop-f3.wav'
];
MM.arrBuffers = [];
MM.countLoadComplete = 0;

MM.currentSlowTrack = 0;
MM.currentFastTrack = 3;
MM.gainSlow = 1;
MM.gainFast = 0;

MM.tracksReady = false;

MM.bufferLoader = function(url, index) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    MM.audioContext.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.log('error decoding file data: ' + url);
          return;
        }
        MM.arrBuffers[index] = buffer;
        MM.countLoadComplete += 1;
        if (MM.countLoadComplete === MM.arrBuffers.length) {
          console.log('all buffers finished loading!');
          MM.tracksReady = true;
          $('.dj__instructions').text('');          MM.processBuffers(MM.arrBuffers);
        }
      },
      function(error) {
        console.log('decodeAudioData error: ' + error);
      }
    );
  };
  request.onerror = function() {
    console.log('bufferLoader error: XHR error');
  };
  request.send();
};

// Load buffers as page loads
MM.start = function() {
  for (var i = 0; i < MM.arrTracks.length; i++) {
    MM.bufferLoader(MM.arrTracks[i], i);
  }
};

MM.arrGainNodes = [];
MM.arrSourceNodes = [];

MM.processBuffers = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    MM.arrSourceNodes[i] = MM.audioContext.createBufferSource();
    MM.arrGainNodes[i] = MM.audioContext.createGain();
    MM.arrSourceNodes[i].buffer = MM.arrBuffers[i];
    MM.arrSourceNodes[i].loop = true;

    // Don't connect source directly to destination
    // MM.arrSourceNodes[i].connect(MM.audioContext.destination);

    MM.arrSourceNodes[i].connect(MM.arrGainNodes[i]);
    MM.arrGainNodes[i].connect(MM.audioContext.destination);

    MM.arrGainNodes[i].gain.value = 0;
    MM.arrSourceNodes[i].start(0);
  }
  // MM.arrGainNodes[MM.currentSlowTrack].gain.value = 1;
  // MM.arrGainNodes[3].gain.value = 0;
  // MM.arrSourceNodes[0].start(0);
  // MM.arrSourceNodes[3].start(0);
};



MM.crossFade = function(el) {
  // console.log(el.value);
  var num = parseInt(el.value);
  // var max = el.attr('max');
  var max = parseInt(el.max);
  // console.log(max);
  // console.log('val: ' + val + ' typeof: ' + typeof val);
  // console.log('val: ' + val() + ' typeof: ' + typeof val);


  console.log('num: ' + num + ' typeof: ' + typeof num);
  console.log('max: ' + max + ' typeof: ' + typeof max);

  var x = num / max;

  MM.gainSlow = Math.cos(x * 0.5 * Math.PI);
  console.log(MM.gainSlow);
  MM.arrGainNodes[MM.currentSlowTrack].gain.value = MM.gainSlow;

  MM.gainFast = Math.cos((1.0 - x) * 0.5 * Math.PI);
  console.log(MM.gainFast);
  MM.arrGainNodes[MM.currentFastTrack].gain.value = MM.gainFast;

  if (MM.gainSlow > 0.5 && MM.gainSlow <= 1) {
      MM.tlLA.restart();
  }
  else {
    MM.tlLA.stop();
  }

  if (MM.gainFast > 0.5 && MM.gainFast <= 1) {
    MM.tlRA.restart();
  }
  else {
    MM.tlRA.stop();
  }
};


$('.dj-range').on('input', function() {
  // MM.crossFade($(this));
  MM.crossFade(this);
});


MM.rightArm = $('#right-arm');
MM.leftArm = $('#left-arm');
MM.mouth = $('#mouth');

MM.tlMouth = new TimelineLite({ paused: true });
MM.tlMouth.to(MM.mouth, 0.1, { rotation: -10, transformOrigin: '50% 50%', ease: Power0.easeIn, repeat: -1, yoyo: true })
.to(MM.mouth, 0.1, { rotation: 10, transformOrigin: '50% 50%', ease: Power0.easeIn, repeat: -1, yoyo: true }, 0.1);

MM.tlRA = new TimelineLite({ paused: true });
MM.tlRA.to(MM.rightArm, 0.2, { x: '-10%', ease: Power0.easeIn, repeat: -1, yoyo: true });
// .to(MM.rightArm, 0.2, { x: '0%', ease: Power0.easeIn });

MM.tlLA = new TimelineLite({ paused: true });
MM.tlLA.to(MM.leftArm, 0.3, { x: '10%', ease: Power0.easeIn, repeat: -1, yoyo: true });

$('#start-spinning').on('click', function() {
  // MM.start();
  // MM.tlRA.restart();
  if (!MM.tracksReady) {
    return;
  }
  MM.tlLA.restart();
  MM.tlMouth.restart();
  MM.arrGainNodes[MM.currentSlowTrack].gain.value = MM.gainSlow;
  MM.arrGainNodes[MM.currentFastTrack].gain.value = MM.gainFast;

});

$('#mouth').on('click', function() {
  MM.tlMouth.stop();
});

$('#stop-spinning').on('click', function() {
  if (!MM.tracksReady) {
    return;
  }
  MM.countLoadComplete = 0;
  MM.arrGainNodes[MM.currentSlowTrack].gain.value = 0;
  MM.arrGainNodes[MM.currentFastTrack].gain.value = 0;

  // MM.arrSourceNodes[0].stop(0);
  // MM.arrSourceNodes[3].stop(0);
  MM.tlRA.stop();
  MM.tlLA.stop();
  MM.tlMouth.stop();
});

$('input[name=loops-slow]').on('change', function(){
  var val = $(this).val();
  // var currentSlow = MM.currentSlowTrack;
  MM.arrGainNodes[MM.currentSlowTrack].gain.value = 0;
  // MM.arrSourceNodes[MM.currentSlowTrack].stop();
  MM.currentSlowTrack = val;
  MM.arrGainNodes[MM.currentSlowTrack].gain.value = MM.gainSlow;
  // MM.arrSourceNodes[MM.currentSlowTrack].start(0);
});

$('input[name=loops-fast]').on('change', function(){
  var val = $(this).val();
  // var currentSlow = MM.currentSlowTrack;
  MM.arrGainNodes[MM.currentFastTrack].gain.value = 0;
  // MM.arrSourceNodes[MM.currentSlowTrack].stop();
  MM.currentFastTrack = val;
  MM.arrGainNodes[MM.currentFastTrack].gain.value = MM.gainFast;
  // MM.arrSourceNodes[MM.currentSlowTrack].start(0);
});

$(document).ready(function(){
  MM.start();
});
