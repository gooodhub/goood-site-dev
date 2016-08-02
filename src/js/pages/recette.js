import ScrollMagic from 'ScrollMagic'; //eslint-disable-line
require('debug.addIndicators'); //eslint-disable-line
import TimelineMax from 'TimelineMax'; //eslint-disable-line


export default {
  position: 2,
  id: 'recette-magique',
  title: 'Recette magique',
  path: '/recette-magique/',
  onEnterCompleted,
  onLeaveCompleted,
  scrollMagic: {
    scenes: [],
    controller: null,
  },
};

function onEnterCompleted() {
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
    .fromTo('path#gearPath', 1, { strokeDashoffset: getTotalLength('path#gearPath') }, { strokeDashoffset: 0 });

  // Create scene to pin and link animation
  this.scrollMagic.scenes.push(
    new ScrollMagic.Scene({
      triggerElement: '.be-agile',
      triggerHook: 'onEnter',
      duration: '300%',
      offset: 200,
    })
    .setTween(animationIcon)
    .addIndicators()
    .addTo(this.scrollMagic.controller)
  );

  this.scrollMagic.scenes.push(
    new ScrollMagic.Scene({
      triggerElement: '.be-agile',
      triggerHook: 'onLeave',
      duration: '250%',
    })
    .setPin('.be-agile')
    .addIndicators()
    .addTo(this.scrollMagic.controller)
  );
}

function onLeaveCompleted() {

}
