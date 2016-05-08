var stickRight = $('#stick-right');


var tlStickR = new TimelineLite({ paused: true });
tlStickR.to(stickRight, 0.2, {x: 0, rotation: 10, ease: Power0.easeIn });
tlStickR.to(stickRight, 0.2, {x: 0, rotation: 0, ease: Power0.easeIn });


var moveStickR = function() {
  console.log('hi');
  tlStickR.restart();
};

$('#hi-hat').on('click', moveStickR);
