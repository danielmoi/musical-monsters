var stickRight = $('#stick-right');
var stickLeft = $('#stick-left');
var pedal = $('#pedal');

var tlStickR = new TimelineLite({ paused: true });
tlStickR.to(stickRight, 0.2, {rotation: 15, transformOrigin: '0% 100%', ease: Power0.easeIn });
tlStickR.to(stickRight, 0.2, {rotation: 0, transformOrigin: '0% 100%', ease: Power0.easeIn });

var moveStickR = function() {
  console.log('hi');
  tlStickR.restart();
};

var tlStickL = new TimelineLite({ paused: true });
tlStickL.to(stickLeft, 0.2, { rotation: -25, transformOrigin: '100% 100%', ease: Power0.easeIn });
tlStickL.to(stickLeft, 0.2, { rotation: 0, transformOrigin: '100% 100%', ease: Power0.easeIn });

var moveStickL = function() {
  tlStickL.restart();
};


$('#hi-hat').on('click', moveStickR);
$('#snare').on('click', moveStickL);
