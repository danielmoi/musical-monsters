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
          MM.processBuffers(MM.arrBuffers);
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
  }
  MM.arrGainNodes[3].gain.value = 0;
  MM.arrSourceNodes[0].start(0);
  MM.arrSourceNodes[3].start(0);
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

  var gain0 = Math.cos(x * 0.5 * Math.PI);
  console.log(gain0);
  MM.arrGainNodes[0].gain.value = gain0;

  var gain1 = Math.cos((1.0 - x) * 0.5 * Math.PI);
  console.log(gain1);
  MM.arrGainNodes[3].gain.value = gain1;

  if (gain0 > 0.5 && gain0 <= 1) {
      MM.tlLA.restart();
  }
  else {
    MM.tlLA.stop();
  }

  if (gain1 > 0.5 && gain1 <= 1) {
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

MM.tlRA = new TimelineLite({ paused: true });
MM.tlRA.to(MM.rightArm, 0.2, { x: '-10%', ease: Power0.easeIn, repeat: -1, yoyo: true });
// .to(MM.rightArm, 0.2, { x: '0%', ease: Power0.easeIn });

MM.tlLA = new TimelineLite({ paused: true });
MM.tlLA.to(MM.leftArm, 0.3, { x: '10%', ease: Power0.easeIn, repeat: -1, yoyo: true });

$('#start-spinning').on('click', function() {
  MM.start();
  // MM.tlRA.restart();
  MM.tlLA.restart();
});

$('#stop-spinning').on('click', function() {
  MM.countLoadComplete = 0;
  MM.arrSourceNodes[0].stop(0);
  MM.arrSourceNodes[3].stop(0);
  MM.tlRA.stop();
  MM.tlLA.stop();
});
