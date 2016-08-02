import Flickity from 'flickity';

export default {
  position: 1,
  id: 'equipe',
  title: 'Équipe et culture',
  path: '/equipe-et-culture/',
  onEnterCompleted,
  onLeaveCompleted,
};

let portraitSlide = null;
let portraitCarousel = null;


function onEnterCompleted() {
  portraitSlide = createPortraitSlide();
  bindPortraits();
}

function onLeaveCompleted() {
  document.body.classList.remove('body--hasOverlay');
}

function bindPortraits() {
  [...document.querySelectorAll('#equipe .portrait')].forEach(item => item.addEventListener('click', portraitSlide.open));
}

const createPortraitSlide = () => {
  const element = document.querySelector('.portrait__slides-container');
  const container = document.querySelector('#equipe');

  document.querySelector('.portrait__slides__close').addEventListener('click', close);
  document.querySelector('.portrait__slides__overlay').addEventListener('click', close);

  [...document.querySelectorAll('.portrait__slick-item__prev')].forEach(item => item.addEventListener('click', () => portraitCarousel.previous(true)));
  [...document.querySelectorAll('.portrait__slick-item__next')].forEach(item => item.addEventListener('click', () => portraitCarousel.next(true)));

  function open(e) {
    const nodeList = Array.prototype.slice.call(document.querySelector('.portraits__container .row').children);
    const index = nodeList.indexOf(e.target);

    element.style.display = 'block';
    element.style.top = `${container.scrollTop}px`;
    document.body.classList.add('body--hasOverlay');
    window.carousel.unbind();

    portraitCarousel = new Flickity('.portrait__slick', {
      accessibility: true,
      resize: true,
      pageDots: false,
      dragThreshold: 30,
      prevNextButtons: false,
    });

    portraitCarousel.select(index, true, true);
  }

  function close() {
    element.style.display = 'none';
    document.body.classList.remove('body--hasOverlay');

    window.carousel.bind();
    portraitCarousel.destroy();
  }

  return {
    open,
    close,
  };
};
