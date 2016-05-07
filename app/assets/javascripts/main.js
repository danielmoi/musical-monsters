var MM = MM || {};



// DOM elements
MM.$monster = $('.monster__craig');
MM.$canvasEq = $('.canvas__equalizer');
MM.$canvasVol = $('.canvas__volume');



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

  // Create an array (with the size: frequencyBinCount)
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

MM.getAverageVolume = function(arr) {
  var sumVolume = 0;
  var len = arr.length;
  for (i = 0; i < len; i++) {
    sumVolume += arr[i];
  }
  var averageVolume = sumVolume / len;
  return averageVolume;
};

/////////////////////////////////////////////////////////////////////////////

// Set up Canvas for Equalizer
MM.canvasEqContext = $('.canvas__equalizer')[0].getContext('2d');

// Umbrella function for animation
MM.startAnimation = function() {
  MM.drawTimeDomain();
  MM.drawVolume();
};

// Draw on Canvas Equalizer
MM.drawTimeDomain = function() {
  MM.clearCanvasEq();
  for (var i = 0; i < MM.arrFrequencyData.length; i++) {
    var value = MM.arrFrequencyData[i] / 256;
    var y = MM.$canvasEq.height() - (MM.$canvasEq.height() * value);
    MM.canvasEqContext.fillStyle = '#ffffff';

    // upperLeft.x, upperLeft.y, width, height
    MM.canvasEqContext.fillRect(i * 10 + 10, 100 - y / 2, 5, y / 2);
  }

};

// Clear Canvas
MM.clearCanvasEq = function() {
  MM.canvasEqContext.clearRect(0, 0, MM.$canvasEq.width(), MM.$canvasEq.height());
};
MM.clearCanvasVol = function() {
  MM.canvasVolContext.clearRect(0, 0, MM.$canvasVol.width() * 2, MM.$canvasVol.height());
};

// Set up Canvas for Volume
MM.canvasVolContext = $('.canvas__volume')[0].getContext('2d');

// Draw on Canvas Volume
MM.drawVolume = function() {
  MM.clearCanvasVol();
  var width = MM.$canvasVol.width();
  MM.averageVolume = MM.getAverageVolume(MM.arrFrequencyData);
  // console.log(MM.averageVolume);
  MM.canvasVolContext.fillStyle = '#00ffff';
  // MM.canvasVolContext.fillRect(50, 100 - MM.averageVolume / 2, 75, MM.averageVolume / 2);
  MM.canvasVolContext.fillRect(width / 2, 100 - MM.averageVolume / 2, width, MM.averageVolume / 2);

};
MM.timeline = new TimelineLite();

MM.moveMonster = function() {
  // Move monster
  if (MM.averageVolume > 64) {
    TweenLite
    .to(MM.$monster, 0.1, {bottom: MM.arrFrequencyData[0] / 2});
  }
  else {
    TweenLite
    .to(MM.$monster, 0.1, {bottom: MM.arrFrequencyData[0] / 6});

  }
};
/////////////////////////////////////////////////////////////////////////////

// Event Handlers
$('#play').on('click', function() {
  MM.audioElement.play();

  // using this setInterval function is a way to display results to the console for viewing. When sending this data for visual processing a ScriptProccessorNode will be used instead.
  MM.monsterID = setInterval(MM.moveMonster, 100);

  MM.samplerID = window.setInterval(function() {
    // Calls getFrequencies, and sets an interval rate.
    // console.log(getFrequencies());
  }, 100);

  // An event listener which is called periodically for audio processing.
  MM.javascriptNode.onaudioprocess = function() {

    // Get the Time Domain data for this sample
    MM.analyser.getByteTimeDomainData(MM.arrFrequencyData);

    // Draw..
    MM.animID = requestAnimationFrame(MM.startAnimation);

  };

});


$('#pause').on('click', function() {
  MM.audioElement.pause();
  clearInterval(MM.samplerID);
  clearInterval(MM.monsterID);
  cancelAnimationFrame(MM.animID);
});

/////////////////////////////////////////////////////////////////////////////
