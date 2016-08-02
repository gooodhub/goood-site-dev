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

  container.style.width = `${document.documentElement.offsetWidth * panesCount}px`;
  showPane(currentIndex, false);

  // Resize event
  window.addEventListener('resize', () => {
    container.style.width = `${document.documentElement.offsetWidth * panesCount}px`;
    containerSize = document.documentElement.offsetWidth;
  });

  // Add Event cursor
  container.addEventListener('mousedown', () => container.classList.add('grabbing'));
  container.addEventListener('mouseup', () => container.classList.remove('grabbing'));
  container.addEventListener('transitionend', () => onTransitionEnd(currentIndex, prevIndex));

  bind();

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

  /**
  * Show a pane by index
  * @param {Number} showIndex
  */
  function showPane(showIndex, animate = true) {
    showIndex = Math.max(0, Math.min(showIndex, panesCount - 1));
    prevIndex = currentIndex;
    currentIndex = showIndex;

    const percent = -((100 / panesCount) * currentIndex);

    if (animate) {
      onTransitionStart(currentIndex, prevIndex);
    }
    moveContainer(percent, animate);
  }

  function nextPane() { showPane(currentIndex + 1, true); }
  function prevPane() { showPane(currentIndex - 1, true); }

  /**
  * Move the container
  * @param {Number} [percent] percentage visible
  * @param {Boolean} [animate]
  */
  function moveContainer(percent, animate) {
    const classList = container.classList;
    classList.remove('animate');
    if (animate) {
      classList.add('animate');
    }

    container.style.transform = `translate3d(${percent}%,0,0) scale3d(1,1,1)`;
  }

  function onPanStart(ev) {
    if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') isScrolling = true;
  }

  /**
  * Handle pan
  * @param {Object} ev
  */
  function onPan(ev) {
    const delta = ev.deltaX;

    if (isScrolling) return;

    if (ev.type === 'panleft' || ev.type === 'panright') {
      // Stick to the finger
      const paneOffset = - (100 / panesCount) * currentIndex;
      let dragOffset = ((100 / containerSize) * delta) / panesCount;

      // Slow down at the first and last pane
      const maxPaneOffset = - (100 / panesCount) * (panesCount - 1);
      if ((paneOffset + dragOffset) > 0 || (paneOffset + dragOffset) < maxPaneOffset) {
        dragOffset *= 0.2;
      }

      moveContainer(paneOffset + dragOffset);
    }

    if (ev.type === 'swipeleft') nextPane();
    if (ev.type === 'swiperight') prevPane();
  }

  function onPanEnd(ev) {
    const delta = ev.deltaX;
    isScrolling = false;

    if (Math.abs(delta) > containerSize * (20 / 100)) {
      if (ev.direction === Hammer.DIRECTION_RIGHT) {
        prevPane();
      } else {
        nextPane();
      }
    } else {
      showPane(currentIndex, true);
    }
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
