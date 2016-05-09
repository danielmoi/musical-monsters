var M = M || {};

M.arrNotes = {
  'C4': 261.6,
  'Db4': 277.2,
  'D4': 293.7,
  'Eb4': 311.1,
  'E4': 329.6,
  'F4': 349.2,
  'F#4': 370.0,
  'G4': 392.0,
  'Ab4': 415.3,
  'A4': 440.0,
  'Bb4': 466.2,
  'B4': 493.9,
  'C5': 523.3

};

M.audioContext = new AudioContext();
M.currentOsc = '';
M.currentGain = '';

M.createOscillator = function(id) {
  var oscillator = M.audioContext.createOscillator();
  var gainNode = M.audioContext.createGain();
  if (M.currentOsc) {

    M.currentOsc.stop(0);
  }

  M.currentOsc = oscillator;

  oscillator.type = 'sine';
  oscillator.frequency.value = id;
  M.currentOsc = oscillator;
  gainNode.gain.value = 1;
  M.currentGain = gainNode;

  oscillator.connect(gainNode);
  gainNode.connect(M.audioContext.destination);

  oscillator.start(0);
};

M.monster = $('#monster');


$('rect').on('mousedown', function() {

  var left = $(this).attr('x'); //offset().left;
  console.log(left);
  var tlMonster = new TimelineLite();
  tlMonster.to(M.monster, 1, {x: left });
  // M.monster.css('left', left);





  var freq = M.arrNotes[$(this)[0].id];
  // console.log(freq);
  var noteString = $(this)[0].id;
  M.createOscillator(freq);
  var note = noteString.slice(0, noteString.length - 1  );
  $('.piano__note').text(note);
});

$('rect').on('mouseup', function() {
  M.currentGain.gain.value = 0;
});
