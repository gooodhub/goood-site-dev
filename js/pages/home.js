import bootstrap from 'bootstrap';
import ScrollMagic from 'ScrollMagic'; //eslint-disable-line
import TimelineMax from 'TimelineMax'; //eslint-disable-line
import MobileDetect from 'mobile-detect';
require('animation.gsap'); //eslint-disable-line

export default {
  position: 0,
  id: 'home',
  path: '/',
  noScrollFix: true,
  onEnterCompleted,
  onLeaveCompleted,
  scrollMagic: {
    scenes: [],
    controller: null,
  },
};

$('#modal-video-dth').on('hidden.bs.modal', function () {
    toggleVideo('pauseVideo');
})

function toggleVideo(state) {
    var div = document.getElementById("modal-body-video-dth");
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : '';
    state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + state + '","args":""}','*');
}

function onLeaveCompleted() {
  this.scrollMagic.controller.destroy(true);
  this.scrollMagic.controller = null;
  this.scrollMagic.scenes = [];
}

function onEnterCompleted() {
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = !!md.mobile();
  const headerHeight = document.querySelector('.vision__header').clientHeight;

  // init
  this.scrollMagic.controller = new ScrollMagic.Controller({
    container: '#home',
  });

  // change behaviour of controller to animate scroll instead of jump
  this.scrollMagic.controller.scrollTo(newpos => {
    new TimelineMax().to('#home', 0.5, { scrollTo: { y: newpos } });
  });

  // Parallax on video container
  if (!isMobile) {
    const moveVideoContainer = new TimelineMax()
    .fromTo('.mission__video', 1, { y: '30%' }, { y: '-30%' });

    // Create scene to pin and link animation
    this.scrollMagic.scenes.push(
      new ScrollMagic.Scene({
        triggerElement: '.mission',
        triggerHook: 'onEnter',
        duration: '200%',
      })
      .setTween(moveVideoContainer)
      .addTo(this.scrollMagic.controller)
    );
  }

  /**
  * Define animation for title
  */
  const fromToTitle = className => ([`.${className} .vision__bloc__title`, 0.5, { x: -20, opacity: 0 }, { x: 0, opacity: 1, delay: 0.3 }]);
  const toTitle = (className, delay = 1) => ([`.${className} .vision__bloc__title`, 0.5, { x: 20, opacity: 0, delay }]);

  const animationTitle = new TimelineMax()
  // First item
  .to(...toTitle('inspirant', 0))

  // Second item
  .fromTo(...fromToTitle('innovant'))
  .to(...toTitle('innovant'))

  // Third item
  .fromTo(...fromToTitle('performant'));

  /**
  * Define animation for content
  */
  const fromToContent = className => ([`.${className} .vision__bloc__content`, 0.5, { x: 20, opacity: 0 }, { x: 0, opacity: 1, delay: 0.3 }]);
  const toContent = (className, delay = 1) => ([`.${className} .vision__bloc__content`, 0.5, { x: -20, opacity: 0, delay }]);

  const animationContent = new TimelineMax()
  // First item
  .to(...toContent('inspirant', 0))

  // Second item
  .fromTo(...fromToContent('innovant'))
  .to(...toContent('innovant'))

  // Third item
  .fromTo(...fromToContent('performant'));


  /*
  * Define svg animation
  */
  const pathPrepare = (el, prepareDashoffset = true) => {
    const lineLength = el.getTotalLength();
    el.style.strokeDasharray = lineLength;
    if (prepareDashoffset) el.style.strokeDashoffset = lineLength;
  };

  const getTotalLength = (className) => document.querySelector(`path#${className}Path`).getTotalLength() + 1;

  pathPrepare(document.querySelector('path#inspirantPath'), false);
  pathPrepare(document.querySelector('path#innovantPath'));
  pathPrepare(document.querySelector('path#performantPath'));

  /**
  * Define animation for icon
  */
  const fromToIcon = className => ([`path#${className}Path`, 0.5, { strokeDashoffset: getTotalLength(className), opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }]);
  const toIcon = (className, delay = 1) => ([`path#${className}Path`, 0.5, { strokeDashoffset: getTotalLength(className), opacity: 0, delay }]);

  const fromToLine = (className) => ([`line#${className}Line`, 0.1, { scale: 0 }, { scale: 1 }]);
  const toLine = (className, delay = 1) => ([`line#${className}Line`, 0.1, { scale: 0, delay }]);

  const animationIcon = new TimelineMax()
    // First item
    .to(...toLine('inspirant', 0))
    .to(...toIcon('inspirant', 0))

    // Second item
    .fromTo(...fromToIcon('innovant'))
    .fromTo(...fromToLine('innovant'))
    .to(...toLine('innovant'))
    .to(...toIcon('innovant', 0))

    // Third item
    .fromTo(...fromToLine('performant'))
    .fromTo(...fromToIcon('performant'));

  // Combine timelines
  const timeline = new TimelineMax();
  timeline
    .insert(animationTitle)
    .insert(animationIcon)
    .insert(animationContent);

  // Create scene
  const visionScene = new ScrollMagic.Scene({
    triggerElement: '.vision',
    triggerHook: 'onLeave',
    duration: '120%',
    offset: isMobile ? headerHeight : 0,
  });

  // Vision button link on inspirant label
  document.querySelector('.btn.btn--vision').addEventListener('click', (e) => {
    e.preventDefault();
    this.scrollMagic.controller.scrollTo(visionScene);
  });

  // Link on inspirant label
  document.querySelector('.vision__leftSquare__label.inspirant').addEventListener('click', () => {
    this.scrollMagic.controller.scrollTo(visionScene);
  });

  // Link on innovant label
  document.querySelector('.vision__leftSquare__label.innovant').addEventListener('click', () => {
    this.scrollMagic.controller.scrollTo(visionScene.scrollOffset() + (visionScene.duration() / 2));
  });

  // Link on performant label
  document.querySelector('.vision__leftSquare__label.performant').addEventListener('click', () => {
    this.scrollMagic.controller.scrollTo(visionScene.scrollOffset() + visionScene.duration());
  });

  // Pin and link animation
  this.scrollMagic.scenes.push(
    visionScene
    .setPin('.vision')
    .setTween(timeline)
    .addTo(this.scrollMagic.controller)
    .on('progress', (e) => {
      const progress = e.progress.toFixed(2);
      [...document.querySelectorAll('.vision__leftSquare__label')].forEach(item => item.classList.remove('active'));
      if (progress <= 0.25) document.querySelector('.vision__leftSquare__label.inspirant').classList.add('active');
      if (progress > 0.25 && progress < 0.75) document.querySelector('.vision__leftSquare__label.innovant').classList.add('active');
      if (progress >= 0.75) document.querySelector('.vision__leftSquare__label.performant').classList.add('active');
    })
  );
}
