import Flickity from 'flickity';
import ScrollMagic from 'ScrollMagic'; //eslint-disable-line
import TimelineMax from 'TimelineMax'; //eslint-disable-line


export default {
  position: 1,
  id: 'recette-magique',
  title: 'Recette magique',
  path: '/recette-magique/',
  noScrollFix: true,
  onEnterCompleted,
  onLeaveCompleted,
  scrollMagic: {
    scenes: [],
    controller: null,
  },
};

function onLeaveCompleted() {
  this.scrollMagic.controller.destroy(true);
  this.scrollMagic.controller = null;
  this.scrollMagic.scenes = [];
}

function onEnterCompleted() {
  // Fixed section
  this.scrollMagic.controller = new ScrollMagic.Controller({
    container: '#recette-magique',
  });


  /*
  * Define svg animation
  */
  const pathPrepare = (el, prepareDashoffset = true) => {
    const lineLength = el.getTotalLength();
    el.style.strokeDasharray = lineLength;
    if (prepareDashoffset) el.style.strokeDashoffset = lineLength;
  };

  const getTotalLength = (className) => document.querySelector(className).getTotalLength() + 1;
  pathPrepare(document.querySelector('path#gearPath'));

  const animationIcon = new TimelineMax()
    .fromTo('path#gearPath', 2.9, { strokeDashoffset: getTotalLength('path#gearPath') }, { strokeDashoffset: 0 })
    .fromTo('line#gearLine', 0.1, { opacity: 0 }, { opacity: 1 });

  const animationText = new TimelineMax()
    .fromTo('.be-agile__sentence--left', 0.3, { opacity: 0 }, { opacity: 1, delay: 0.3 })
    .fromTo('.be-agile__sentence--bottom', 0.3, { opacity: 0 }, { opacity: 1, delay: 0.3 })
    .fromTo('.be-agile__sentence--right', 0.3, { opacity: 0 }, { opacity: 1, delay: 0.3 });

  // Combine timelines
  const timeline = new TimelineMax();
  timeline
    .insert(animationText)
    .insert(animationIcon);

  // Create scene to pin and link animation
  this.scrollMagic.scenes.push(
    new ScrollMagic.Scene({
      triggerElement: '.be-agile',
      triggerHook: 'onEnter',
      duration: '200%',
      offset: 200,
    })
    .setTween(timeline)
    .addTo(this.scrollMagic.controller)
  );

  this.scrollMagic.scenes.push(
    new ScrollMagic.Scene({
      triggerElement: '.be-agile',
      triggerHook: 'onLeave',
      duration: '150%',
    })
    .setPin('.be-agile')
    .addTo(this.scrollMagic.controller)
  );


  // Demarche section
  const demarcheCarousel = new Flickity('.demarche__carousel', {
    accessibility: true,
    resize: true,
    pageDots: false,
    prevNextButtons: false,
    dragThreshold: 30,
  });

  const onCarouselSelect = () => {
    [...document.querySelectorAll('.demarche-circle')].forEach(item => item.classList.remove('active'));
    [...document.querySelectorAll('.demarche-circle')][demarcheCarousel.selectedIndex].classList.add('active');

    [...document.querySelectorAll('.demarche__label')].forEach(item => item.classList.remove('demarche__label--active'));
    [...document.querySelectorAll('.demarche__label')][demarcheCarousel.selectedIndex].classList.add('demarche__label--active');
  };

  demarcheCarousel.on('select', onCarouselSelect);

  [...document.querySelectorAll('.demarche__item__prev')].forEach(item => item.addEventListener('click', () => demarcheCarousel.previous(true)));
  [...document.querySelectorAll('.demarche__item__next')].forEach(item => item.addEventListener('click', () => demarcheCarousel.next(true)));

  [...document.querySelectorAll('.demarche-circle')].forEach((item, i) => {
    if (i === 0) item.classList.add('active');
    item.addEventListener('click', () => demarcheCarousel.select(i));
  });

  [...document.querySelectorAll('.demarche__label')].forEach((item, i) => {
    if (i === 0) item.classList.add('demarche__label--active');
    item.addEventListener('click', () => demarcheCarousel.select(i));
  });


  // Benefice section
  [...document.querySelectorAll('.benefices__circle')].forEach((item, i) => item.addEventListener('click', () => {
    // Remove active on all items
    [...document.querySelectorAll('.benefices__circle')].forEach(it => it.classList.remove('benefices__circle--active'));
    [...document.querySelectorAll('.benefices__title')].forEach(it => it.classList.remove('benefices__title--active'));
    [...document.querySelectorAll('.benefices__descr')].forEach(it => it.classList.remove('benefices__descr--active'));

    // Add class on specific items
    item.classList.add('benefices__circle--active');
    [...document.querySelectorAll('.benefices__title')][i].classList.add('benefices__title--active');
    [...document.querySelectorAll('.benefices__descr')][i].classList.add('benefices__descr--active');
  }));

  // Trigger click for first element
  [...document.querySelectorAll('.benefices__circle')][0].click();
}
