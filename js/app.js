import HammerCarousel from './HammerCarousel';
import loadAllSlides from './loadAllSlides';
import pagesData from './pages';


const currentSlide = document.querySelector('.slide');
const carouselWrapper = document.querySelector('.wrap');

loadAllSlides(currentSlide, pagesData)
  .then((currentIndex) => {
    new HammerCarousel(carouselWrapper, currentIndex);
  });
