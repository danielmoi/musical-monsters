var MM = MM || {};

MM.audioContext = new AudioContext();

MM.arrFiles = ['/sounds/loop-1.wav', '/sounds/loop-2.wav'];
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
for (var i = 0; i < MM.arrFiles.length; i++) {
  MM.bufferLoader(MM.arrFiles[i], i);
}

MM.arrGainNodes = [];
MM.arrSourceNodes = [];

MM.processBuffers = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    MM.arrSourceNodes[i] = MM.audioContext.createBufferSource();
    MM.arrGainNodes[i] = MM.audioContext.createGain();
    MM.arrSourceNodes[i].buffer = MM.arrBuffers[i];

    // Don't connect source directly to destination
    // MM.arrSourceNodes[i].connect(MM.audioContext.destination);

    MM.arrSourceNodes[i].connect(MM.arrGainNodes[i]);
    MM.arrGainNodes[i].connect(MM.audioContext.destination);
    MM.arrGainNodes[i].gain.value = 0;
    MM.arrSourceNodes[i].loop = true;
    MM.arrSourceNodes[i].start(0);
  }
};

$('#start-spinning').on('click', function() {
  MM.arrGainNodes[0].gain.value = 1;
});

$('#stop-spinning').on('click', function() {
  for (var i = 0; i < MM.arrGainNodes.length; i++) {
    MM.arrGainNodes[i].gain.value = 0;
  }
});

// console.log(MM.arrGainNodes[0].gain.value);
// MM.arrGainNodes[0].gain.value;
