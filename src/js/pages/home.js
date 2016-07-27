import ScrollMagic from 'ScrollMagic';
import TimelineMax from 'TimelineMax';
import MobileDetect from 'mobile-detect';
require('debug.addIndicators'); //eslint-disable-line
require('animation.gsap'); //eslint-disable-line

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = !!md.mobile();
const headerHeight = document.querySelector('.vision__header').clientHeight;

export default {
  position: 0,
  id: 'home',
  path: '/',
  onEnterCompleted,
};

function onEnterCompleted() {
  // init
  const controller = new ScrollMagic.Controller({
    container: '#home',
  });

  const fromToTitle = className => ([
    `.${className} .vision__bloc__title`,
    0.5,
    { x: -20, opacity: 0 },
    { x: 0, opacity: 1 },
  ]);

  const toTitle = className => ([
    `.${className} .vision__bloc__title`,
    0.5,
    { x: 20, opacity: 0, delay: 1 },
  ]);

  const fromToContent = className => ([
    `.${className} .vision__bloc__content`,
    0.5,
    { x: 20, opacity: 0 },
    { x: 0, opacity: 1 },
  ]);

  const toContent = className => ([
    `.${className} .vision__bloc__content`,
    0.5,
    { x: -20, opacity: 0, delay: 1 },
  ]);

  const animationTitle = new TimelineMax()
    .fromTo(...fromToTitle('inspirant'))
    .to(...toTitle('inspirant'))
    .fromTo(...fromToTitle('innovant'))
    .to(...toTitle('innovant'))
    .fromTo(...fromToTitle('performant'))
    .to(...toTitle('performant'));

  const animationContent = new TimelineMax()
    .fromTo(...fromToContent('inspirant'))
    .to(...toContent('inspirant'))
    .fromTo(...fromToContent('innovant'))
    .to(...toContent('innovant'))
    .fromTo(...fromToContent('performant'))
    .to(...toContent('performant'));

  const timeline = new TimelineMax();
  timeline
    .insert(animationTitle)
    .insert(animationContent);

  // create scene to pin and link animation
  new ScrollMagic.Scene({
    triggerElement: '.vision',
    triggerHook: 'onLeave',
    duration: '200%',
    offset: isMobile ? headerHeight : 0,
  })
  .setPin('.vision')
  .setTween(timeline)
  .addIndicators()
  .addTo(controller);
}
