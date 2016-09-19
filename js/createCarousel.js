import Hammer from 'hammerjs';

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
  /*
    container.addEventListener('mousedown', () => container.classList.add('grabbing'));
    container.addEventListener('mouseup', () => container.classList.remove('grabbing'));
  */
  container.addEventListener('transitionend', () => {
    resetContainers(currentIndex);
    onTransitionEnd(currentIndex, prevIndex);
  });

  // bind();


  /**
  * Bind hammer pan
  */
  function bind() {
    hammer.add(new Hammer.Pan());
    hammer.on('panstart', Hammer.bindFn(onPanStart, this));
    hammer.on('panup pandown panleft panright swipeleft swiperight', Hammer.bindFn(onPan, this));
    hammer.on('panend', Hammer.bindFn(onPanEnd, this));
  }


  /**
  * Unbind hammer pan
  */
  function unbind() {
    hammer.off('panstart', Hammer.bindFn(onPanStart, this));
    hammer.off('panup pandown panleft panright swipeleft swiperight', Hammer.bindFn(onPan, this));
    hammer.off('panend', Hammer.bindFn(onPanEnd, this));
  }


  /**
  * Delete translate, reset position
  * @param {Number} currentIndex
  */
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


  /**
  * Display left and right slight when transitioned
  */
  function displayPrevNextSlides(oldIndex, newIndex) {
    let prevElement = null;
    let nextElement = null;
    const children = [...container.children];

    const next = isNext(oldIndex, newIndex);

    if (next === 1) {
      nextElement = children[newIndex];
    } else {
      prevElement = children[newIndex];
    }

    if (prevElement) {
      prevElement.style.display = 'block';
      prevElement.style.right = '100%';
      prevElement.style.left = '-100%';
    }

    if (nextElement) {
      nextElement.style.display = 'block';
      nextElement.style.right = '-100%';
      nextElement.style.left = '100%';
    }
  }

  function isNext(oldIndex, newIndex) {
    if ((oldIndex === 0) && (newIndex === panesCount - 1)) return -1;
    if ((newIndex === 0) && (oldIndex === panesCount - 1)) return 1;
    if (newIndex === oldIndex) return 0;
    if (newIndex > oldIndex) return 1;
    if (newIndex < oldIndex) return -1;
  }


  /**
  * Show a pane by index
  * @param {Number} showIndex
  */
  function showPane(showIndex, animate = true) {
    if (animate) displayPrevNextSlides(currentIndex, showIndex);

    let distance = null;
    const next = isNext(currentIndex, showIndex);

    if (next === 0) distance = 0;
    if (next === 1) distance = -containerSize; // Forward
    if (next === -1) distance = containerSize; // Backward

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


  /**
  * Handle end pan
  */
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
