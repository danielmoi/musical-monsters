var MM = MM || {};

MM.audioContext = new AudioContext();

MM.arrTracks = ['/sounds/loop-1.wav', '/sounds/loop-2.wav'];
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
  MM.arrGainNodes[1].gain.value = 0;
  MM.arrSourceNodes[0].start(0);
  MM.arrSourceNodes[1].start(0);
};

$('#start-spinning').on('click', function() {
  MM.start();
});

$('#stop-spinning').on('click', function() {
  MM.countLoadComplete = 0;
  MM.arrSourceNodes[0].stop(0);
  MM.arrSourceNodes[1].stop(0);
});

MM.crossFade = function(val) {
  console.log(typeof val);
  var num = parseInt(val);
  MM.arrGainNodes[0].gain.value = Math.cos(num * 0.5 * Math.PI);
  MM.arrGainNodes[1].gain.value = Math.cos( (1.0 - num) * 0.5 * Math.PI );
  // var gain1 = Math.cos(x * 0.5*Math.PI);
  // var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
};


$('.dj-range').on('input', function() {
  MM.crossFade($(this).val());

});
// console.log(MM.arrGainNodes[0].gain.value);
// MM.arrGainNodes[0].gain.value;
