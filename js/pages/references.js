import Flickity from 'flickity';

let refCarousel1 = null;
let refCarousel2 = null;
let refCarousel3 = null;

export default {
  position: 4,
  id: 'references',
  path: '/references/',
  title: 'Références',
  onEnterCompleted,
  onLeaveCompleted,
};

function onEnterCompleted() {
  const carouselOptions = {
    adaptiveHeight: true,
    accessibility: true,
    resize: true,
    pageDots: true,
    prevNextButtons: false,
    dragThreshold: 30,
    watchCSS: true,
  };

  setTimeout(() => {
    refCarousel1 = new Flickity('.slide__carousel--operations', carouselOptions);
    refCarousel2 = new Flickity('.slide__carousel--organisation', carouselOptions);
    refCarousel3 = new Flickity('.slide__carousel--offre', carouselOptions);
  }, 0);
}

function onLeaveCompleted() {
  refCarousel1.destroy();
  refCarousel2.destroy();
  refCarousel3.destroy();
}
