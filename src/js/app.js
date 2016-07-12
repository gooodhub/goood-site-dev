import HammerCarousel from './HammerCarousel';


const carousel = new HammerCarousel(document.querySelector('.wrap'));

// wrap event cursor
document.querySelector('.wrap').addEventListener('mousedown', function moudedown() {
  this.style.cursor = '-moz-grabbing';
  this.style.cursor = '-webkit-grabbing';
  this.style.cursor = 'grabbing';
});
document.querySelector('.wrap').addEventListener('mouseup', function mouseup() {
  this.style.cursor = '-moz-grab';
  this.style.cursor = '-webkit-grab';
  this.style.cursor = 'grab';
});

// document.addEventListener('click', () => {
//   carousel.show(1, true);
// });
