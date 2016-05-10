var MM = MM || {};

MM.audioContext = new AudioContext();

MM.request = new XMLHttpRequest();
MM.request.open('GET', '/sounds/loop-1.wav', true);
MM.request.responseType = 'arraybuffer';

MM.request.onload = function() {
  MM.audioContext.decodeAudioData(MM.request.response, function(buffer) {
    MM.source = MM.audioContext.createBufferSource();
    MM.source.buffer = buffer;
    MM.source.connect(MM.audioContext.destination);
    MM.source.start(0);
  });
};
MM.request.send();
