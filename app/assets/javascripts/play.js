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

var tlPedal = new TimelineLite({ paused: true });
tlPedal.to(pedal, 0.2, { rotation: 30, transformOrigin: '100% 100%', ease: Power0.easeIn });
tlPedal.to(pedal, 0.2, { rotation: 0, transformOrigin: '100% 100%', ease: Power0.easeIn });

var movePedal = function() {
  tlPedal.restart();
};

$('#hi-hat').on('click', moveStickR);
$('#snare').on('click', moveStickL);
$('#bass').on('click', movePedal);

$(document).on('keydown', function(e) {
  // S key
  if (e.keyCode === 83) {
    $('#snare').trigger('click');
  }

  // H key
  if (e.keyCode === 72) {
    $('#hi-hat').trigger('click');
  }
  if (e.keyCode === 66) {
    $('#bass').trigger('click');
  }
});
