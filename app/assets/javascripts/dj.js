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

for (var i = 0; i < MM.arrFiles.length; i++) {
  MM.bufferLoader(MM.arrFiles[i], i);
}
