var context = new AudioContext();

var oscillator = context.createOscillator();

oscillator.connect(context.destination);

var monster = $('.monster__craig');

var audio = new Audio();
audio.controls = true;
audio.crossOrigin = "anonymous";

var clientID = "client_id=3b2585ef4a5eff04935abe84aad5f3f3";

// var soundcloudURL = 'https://api.soundcloud.com/tracks/139590122';
var soundcloudURL = 'https://api.soundcloud.com/tracks/262738653';
var soundcloudURL = 'https://api.soundcloud.com/tracks/293';

var streamURL;
var trackPermalinkUrl = "https://soundcloud.com/the-outsider/the-outsider-death-by-melody";

var source;
var analyser;
var frequencyData;
// Function that receives & returns the frequencyData
var getFrequencies = function() {
  // Copies the current frequency data into the passed unsigned byte array.
  // The getByteFrequencyData() method of the AnalyserNode interface copies the current frequency data into a Uint8Array (unsigned byte array) passed into it.
  analyser.getByteFrequencyData(frequencyData);

  return frequencyData;
};
var javascriptNode;
var offlineContext = new OfflineAudioContext(1, 2, 44100);
var request = new XMLHttpRequest();
// request.open('GET', soundcloudURL + '?' + clientID, true);
request.open('GET', "http://api.soundcloud.com/resolve.json?url=" + trackPermalinkUrl + '&' + clientID, true);
request.responseType = 'arraybuffer';
request.onload = function() {
  console.log(typeof request.response);

  // offlineContext.decodeAudioData(request.response, function(buffer) {
  //   console.log(typeof buffer);
  // });
};
request.send();

$.ajax({
  // url: "https://api.soundcloud.com/resolve.json?url=" + trackPermalinkUrl + "&" + clientID
  url: soundcloudURL + "?" + clientID
}).done(function(response) {
  console.log(typeof response);
  streamURL = response.stream_url + '?' + clientID;
  audio.src = streamURL;

  // audio[0].src = streamURL;
  // console.log('hello');
  // $('body').append(audio);

  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.3;
  source.connect(analyser);
  analyser.connect(context.destination);





  // Uint8Array = Unsigned Integer 8bit Array
  // Values between 0-255 will be pushed into this array
  // Which represent -1 to +1 (in audio terms)
  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // audio.play() works


  // This interface is an AudioNode which can generate, process, or analyse audio directly using JavaScript.

  javascriptNode = context.createScriptProcessor(1024, 1, 1);

  // This node also need to be connected to the analyserNode and the destination:

  analyser.connect(javascriptNode);
  javascriptNode.connect(context.destination);

});

var samplerID;

$('#pause').on('click', function() {
  audio.pause();

  clearInterval(samplerID);
  cancelAnimationFrame(animID);
});


// 2D rendering context for a drawing surface of a `<canvas>` element.
var ctx = $("#canvas")[0].getContext("2d");

var canvasWidth  = 512;
var canvasHeight = 256;

var drawTimeDomain = function() {
  clearCanvas();
  for (var i = 0; i < frequencyData.length; i++) {
    var value = frequencyData[i] / 256;
    var y = canvasHeight - (canvasHeight * value) - 1;
    ctx.fillStyle = '#ffffff';

    // upperLeft.x, upperLeft.y, width, height
    ctx.fillRect(i * 10 + 100, 200 - y/2, 5, y/2);
  }
  monster.css('bottom', frequencyData[0] / 3);
};

var clearCanvas = function() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

var animID;
$('#play').on('click', function() {
  audio.play();

  // using this setInterval function is a way to display results to the console for viewing. When sending this data for visual processing a ScriptProccessorNode will be used instead.

  samplerID = window.setInterval(function() {
    // Calls getFrequencies, and sets an interval rate.
    // console.log(getFrequencies());
  }, 100);

  // An event listener which is called periodically for audio processing.
  javascriptNode.onaudioprocess = function () {

    // Get the Time Domain data for this sample
    analyser.getByteTimeDomainData(frequencyData);

    // Draw..
    animID = requestAnimationFrame(drawTimeDomain);
  };

});
