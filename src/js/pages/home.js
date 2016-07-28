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

  /**
  * Define animation for title
  */
  const fromToTitle = className => ([`.${className} .vision__bloc__title`, 0.5, { x: -20, opacity: 0 }, { x: 0, opacity: 1, delay: 0.3 }]);
  const toTitle = className => ([`.${className} .vision__bloc__title`, 0.5, { x: 20, opacity: 0, delay: 1 }]);

  const animationTitle = new TimelineMax()
  // First item
  .to(...toTitle('inspirant'))

  // Second item
  .fromTo(...fromToTitle('innovant'))
  .to(...toTitle('innovant'))

  // Third item
  .fromTo(...fromToTitle('performant'));

  /**
  * Define animation for content
  */
  const fromToContent = className => ([`.${className} .vision__bloc__content`, 0.5, { x: 20, opacity: 0 }, { x: 0, opacity: 1, delay: 0.3 }]);
  const toContent = className => ([`.${className} .vision__bloc__content`, 0.5, { x: -20, opacity: 0, delay: 1 }]);

  const animationContent = new TimelineMax()
  // First item
  .to(...toContent('inspirant'))

  // Second item
  .fromTo(...fromToContent('innovant'))
  .to(...toContent('innovant'))

  // Third item
  .fromTo(...fromToContent('performant'));


  /**
  * Define animation for icon
  */
  const fromToIcon = className => ([`.${className} .vision__bloc__icon`, 0.5, { opacity: 0 }, { opacity: 1, delay: 0.3 }]);
  const toIcon = className => ([`.${className} .vision__bloc__icon`, 0.5, { opacity: 0, delay: 1 }]);

  const animationIcon = new TimelineMax()
    // First item
    .to(...toIcon('inspirant'))

    // Second item
    .fromTo(...fromToIcon('innovant'))
    .to(...toIcon('innovant'))

    // Third item
    .fromTo(...fromToIcon('performant'));

  // Combine timelines
  const timeline = new TimelineMax();
  timeline
    .insert(animationTitle)
    .insert(animationIcon)
    .insert(animationContent);

  // Create scene to pin and link animation
  new ScrollMagic.Scene({
    triggerElement: '.vision',
    triggerHook: 'onLeave',
    duration: '150%',
    offset: isMobile ? headerHeight : 0,
  })
  .setPin('.vision')
  .setTween(timeline)
  .addIndicators()
  .addTo(controller)
  .on('progress', (e) => {
    // console.log(e.progress.toFixed(2));

    const progress = e.progress.toFixed(2);
    [...document.querySelectorAll('.vision__leftSquare__label')].forEach(item => item.classList.remove('active'));
    if (progress <= 0.35) document.querySelector('.vision__leftSquare__label.inspirant').classList.add('active');
    if (progress > 0.35 && progress < 0.85) document.querySelector('.vision__leftSquare__label.innovant').classList.add('active');
    if (progress >= 0.85) document.querySelector('.vision__leftSquare__label.performant').classList.add('active');
  });
}
