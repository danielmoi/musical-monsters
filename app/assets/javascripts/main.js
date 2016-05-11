$(document).ready(function() {
  $('.footer__nav-toggle').on('click', function() {
    console.log('hi');
    $('.nav__container').toggle();
  });  
});


$('.footer__list-item').on('click', function() {
  console.log('hi');
  $('.nav__container').toggle();
});
