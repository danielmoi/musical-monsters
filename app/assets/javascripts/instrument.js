var M = M || {};

M.arrNotes = {
  'C3': 130.81,
  'Db3': 138.59,
  'D3': 146.83,
  'Eb3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'G3': 196.00,
  'Ab3': 207.65,
  'A3': 220.00,
  'Bb3': 233.08,
  'B3': 246.94,
  'C4': 261.63,
  'Db4': 277.18,
  'D4': 293.66,
  'Eb4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'Ab4': 415.30,
  'A4': 440.00,
  'Bb4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'Db5': 554.37,
  'D5': 587.33,
  'Eb5': 622.25,
  'E5': 659.26,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'Ab5': 830.61,
  'A5': 880.00,
  'Bb5': 932.33,
  'B5': 987.77,
  'C6': 1046.50

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

// using a proxy because SVG groups have no width
M.monsterWidth = $('#monster')[0].getBoundingClientRect().width;


$('rect').on('mousedown', function() {

  var left = $(this).attr('x'); //offset().left;
  var width = $(this).attr('width');
  var delta = ( M.monsterWidth - width ) / 2; // an approximation
  console.log(delta);
  // console.log(left);

  var tlMonster = new TimelineLite();
  tlMonster.to(M.monster, 0.1, {
      x: left - delta,
      ease: Power0.easeIn
    })
    .to(M.monster, 0.1, {
      y: '-= 10',
      yoyo: true,
      repeat: 2
    })
    .to(M.monster, 0.1, {
      y: '+= 10'
    });

  var freq = M.arrNotes[$(this)[0].id];
  // console.log(freq);
  var noteString = $(this)[0].id;
  M.createOscillator(freq);
  var note = noteString.slice(0, noteString.length - 1);
  $('.piano__note').text(note);
});

$('rect').on('mouseup', function() {
  M.currentGain.gain.value = 0;
});
