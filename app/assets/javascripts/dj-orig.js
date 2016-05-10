var MM = MM || {};

MM.audioContext = new AudioContext();

MM.BufferLoader = function(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
};

MM.BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  var loader = this;

  request.onload = function() {

    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.log('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    console.log('BufferLoader: XHR error');
  };

  request.send();
};

MM.BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
};




MM.loadingComplete = function(bufferList) {
  // Create two sources and play them both together.
  var source1 = MM.audioContext.createBufferSource();
  var gainNode1 = MM.audioContext.createGain();

  var source2 = MM.audioContext.createBufferSource();
  var gainNode
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(MM.audioContext.destination);
  source2.connect(MM.audioContext.destination);
};

MM.bufferLoader = new MM.BufferLoader(
  MM.audioContext, ['/sounds/loop-1.wav', '/sounds/loop-2.wav'],
  MM.loadingComplete

);

MM.bufferLoader.load();
