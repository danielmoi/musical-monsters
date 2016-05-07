var MM = MM || {};



// DOM elements
MM.$monster = $('.monster__craig');



// SoundCloud details
MM.clientID = "client_id=3b2585ef4a5eff04935abe84aad5f3f3";
MM.soundcloudURL = 'https://api.soundcloud.com/tracks/293';
MM.trackPermalinkUrl = "https://soundcloud.com/the-outsider/the-outsider-death-by-melody";

/////////////////////////////////////////////////////////////////////////////

// Setup Audio environment
MM.audioContext = new AudioContext();
MM.audioElement = new Audio();
MM.audioElement.controls = true;
MM.audioElement.crossOrigin = "anonymous";

// Function that receives & returns the frequencyData
MM.getFrequencies = function() {
  // Copies the current frequency data into the passed unsigned byte array.
  // The getByteFrequencyData() method of the AnalyserNode interface copies the current frequency data into a Uint8Array (unsigned byte array) passed into it.
  analyser.getByteFrequencyData(frequencyData);

  return frequencyData;
};


MM.getStream = $.ajax({
  url: MM.soundcloudURL + "?" + MM.clientID
}).done(function(response) {
  MM.streamURL = response.stream_url + '?' + MM.clientID;
  MM.audioElement.src = MM.streamURL;

  // Create new elements for Audio environment
  MM.source = MM.audioContext.createMediaElementSource(MM.audioElement);
  MM.analyser = MM.audioContext.createAnalyser();

  // Customise analyser
  MM.analyser.fftSize = 64;
  MM.analyser.smoothingTimeConstant = 0.3;

  // Connect Source > Analyser > audioContext.destination
  MM.source.connect(MM.analyser);
  // MM.analyser.connect(MM.audioContext.destination);

  // Uint8Array = Unsigned Integer 8bit Array
  // Values between 0-255 will be pushed into this array
  // Which represent -1 to +1 (in audio terms)
  MM.arrFrequencyData = new Uint8Array(MM.analyser.frequencyBinCount);

  // Use javascriptNode to process audio
  // < bufferSize, inputChannels, outputChannels >
  MM.javascriptNode = MM.audioContext.createScriptProcessor(1024, 1, 1);

  // Connect analyser > javascriptNode > audioContext.destination
  MM.analyser.connect(MM.javascriptNode);
  MM.javascriptNode.connect(MM.audioContext.destination);

});

/////////////////////////////////////////////////////////////////////////////

// Set up Canvas
MM.canvasContext = $("#canvas").getContext("2d");
MM.canvasWidth = 512;
MM.canvasHeight = 256;

// Draw on Canvas
MM.drawTimeDomain = function() {
  MM.clearCanvas();
  for (var i = 0; i < MM.arrFrequencyData.length; i++) {
    var value = MM.arrFrequencyData[i] / 256;
    var y = MM.canvasHeight - (MM.canvasHeight * value) - 1;
    MM.canvasContext.fillStyle = '#ffffff';

    // upperLeft.x, upperLeft.y, width, height
    MM.canvasContext.fillRect(i * 10 + 100, 200 - y / 2, 5, y / 2);
  }
  // Move monster
  MM.$monster.css('bottom', MM.arrFrequencyData[0] / 3);
};

// Clear Canvas
MM.clearCanvas = function() {
  MM.canvasContext.clearRect(0, 0, MM.canvasWidth, MM.canvasHeight);
};

/////////////////////////////////////////////////////////////////////////////

// Event Handlers
$('#play').on('click', function() {
  MM.audioElement.play();

  // using this setInterval function is a way to display results to the console for viewing. When sending this data for visual processing a ScriptProccessorNode will be used instead.

  MM.samplerID = window.setInterval(function() {
    // Calls getFrequencies, and sets an interval rate.
    // console.log(getFrequencies());
  }, 100);

  // An event listener which is called periodically for audio processing.
  MM.javascriptNode.onaudioprocess = function() {

    // Get the Time Domain data for this sample
    MM.analyser.getByteTimeDomainData(MM.arrFrequencyData);

    // Draw..
    MM.animID = requestAnimationFrame(MM.drawTimeDomain);
  };

});


$('#pause').on('click', function() {
  MM.audioElement.pause();
  clearInterval(MM.samplerID);
  cancelAnimationFrame(MM.animID);
});

/////////////////////////////////////////////////////////////////////////////
