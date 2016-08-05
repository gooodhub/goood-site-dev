import Flickity from 'flickity';

export default {
  position: 3,
  id: 'references',
  path: '/references/',
  title: 'Références',
  onEnterCompleted,
  onLeaveCompleted,
};

function onEnterCompleted() {
  // Demarche section

  const carouselOptions = {
    accessibility: true,
    resize: true,
    pageDots: true,
    prevNextButtons: false,
    dragThreshold: 30,
    watchCSS: true,
  };

  const refCarousel1 = new Flickity('.slide__carousel--operations', carouselOptions);
  const refCarousel2 = new Flickity('.slide__carousel--organisation', carouselOptions);
  const refCarousel3 = new Flickity('.slide__carousel--offre', carouselOptions);
}

function onLeaveCompleted() {

}
