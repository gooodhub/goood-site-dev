import Hammer from 'hammerjs';

// const reqAnimationFrame = (function() {
//   return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
//     setTimeout(callback, 1000 / 60);
//   };
// })();

/**
* Carousel
* @param container
* @param direction
* @constructor
*/
const createCarousel = ({ container, currentIndex, onTransitionStart, onTransitionEnd }) => {
  const panesCount = [...container.children].length;
  const hammer = new Hammer.Manager(container);
  let isScrolling = false;

  let prevIndex = null;
  let containerSize = document.documentElement.offsetWidth;

  showPane(currentIndex, false);
  resetContainers(currentIndex);

  // Resize event
  window.addEventListener('resize', () => {
    containerSize = document.documentElement.offsetWidth;
  });

  // Add Event cursor
  // container.addEventListener('mousedown', () => container.classList.add('grabbing'));
  // container.addEventListener('mouseup', () => container.classList.remove('grabbing'));
  container.addEventListener('transitionend', () => {
    resetContainers(currentIndex);
    onTransitionEnd(currentIndex, prevIndex);
  });

  // bind();

  function bind() {
    hammer.add(new Hammer.Pan());
    hammer.on('panstart', Hammer.bindFn(onPanStart, this));
    hammer.on('panup pandown panleft panright swipeleft swiperight', Hammer.bindFn(onPan, this));
    hammer.on('panend', Hammer.bindFn(onPanEnd, this));
  }

  function unbind() {
    hammer.off('panstart', Hammer.bindFn(onPanStart, this));
    hammer.off('panup pandown panleft panright swipeleft swiperight', Hammer.bindFn(onPan, this));
    hammer.off('panend', Hammer.bindFn(onPanEnd, this));
  }

  function resetContainers(currI) {
    container.style.transform = null;
    container.classList.remove('animate');

    [...container.children].forEach(item => {
      item.style.display = 'none';
      item.style.left = null;
      item.style.right = null;
    });

    const element = [...container.children][currI];
    element.style.display = 'block';
  }

  function displayPrevNextSlides() {
    const prevElement = [...container.children][currentIndex - 1] ? [...container.children][currentIndex - 1] : [...container.children][panesCount - 1];
    const nextElement = [...container.children][currentIndex + 1] ? [...container.children][currentIndex + 1] : [...container.children][0];

    prevElement.style.display = 'block';
    prevElement.style.right = '100%';
    prevElement.style.left = '-100%';

    nextElement.style.display = 'block';
    nextElement.style.right = '-100%';
    nextElement.style.left = '100%';
  }

  /**
  * Show a pane by index
  * @param {Number} showIndex
  */
  function showPane(showIndex, animate = true) {
    if (animate) displayPrevNextSlides();

    let distance = null;

    if (showIndex === currentIndex) distance = 0;
    if (showIndex > currentIndex) distance = -containerSize;
    if (showIndex < currentIndex) distance = containerSize;

    if (showIndex > panesCount - 1) showIndex = 0;
    if (showIndex < 0) showIndex = panesCount - 1;

    prevIndex = currentIndex;
    currentIndex = showIndex;


    if (animate) {
      onTransitionStart(currentIndex, prevIndex);
    }
    moveContainer(distance, animate);
  }

  function nextPane() { showPane(currentIndex + 1, true); }
  function prevPane() { showPane(currentIndex - 1, true); }

  /**
  * Move the container
  * @param {Number} [percent] percentage visible
  * @param {Boolean} [animate]
  */
  function moveContainer(distance, animate) {
    const classList = container.classList;
    classList.remove('animate');
    if (animate) {
      classList.add('animate');
    }

    container.style.transform = `translate3d(${distance}px,0,0) scale3d(1,1,1)`;
  }

  function onPanStart(ev) {
    if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') isScrolling = true;

    if (!isScrolling) displayPrevNextSlides();
  }

  /**
  * Handle pan
  * @param {Object} ev
  */
  function onPan(ev) {
    const delta = ev.deltaX;

    if (isScrolling) return;

    if (ev.type === 'panleft' || ev.type === 'panright') {
      moveContainer(delta);
    }

    if (ev.type === 'swipeleft') nextPane();
    if (ev.type === 'swiperight') prevPane();
  }

  function onPanEnd(ev) {
    const delta = ev.deltaX;

    if (!isScrolling) {
      if (delta > containerSize * (20 / 100)) {
        prevPane();
      } else if (delta < -containerSize * (20 / 100)) {
        nextPane();
      } else {
        showPane(currentIndex, true);
      }
    }

    isScrolling = false;
  }

  return {
    showPane,
    nextPane,
    prevPane,
    bind,
    unbind,
  };
};


export default createCarousel;
