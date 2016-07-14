import Hammer from 'hammerjs';

// const reqAnimationFrame = (function() {
//   return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
//     setTimeout(callback, 1000 / 60);
//   };
// })();

/**
* Return correct property according to direction
*/
function dirProp(direction, hProp, vProp) {
  return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp;
}

/**
* Carousel
* @param container
* @param direction
* @constructor
*/
class HammerCarousel {
  constructor(container, currentIndex, direction = Hammer.DIRECTION_HORIZONTAL) {
    this.container = container;
    this.direction = direction;
    this.currentIndex = currentIndex;
    this.prevIndex = null;

    this.panes = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container[dirProp(direction, 'offsetWidth', 'offsetHeight')];

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
    this.hammer.on('panstart panmove panend pancancel', Hammer.bindFn(this.onPan, this));

    this.movePane(this.currentIndex);

    // resize event
    window.addEventListener('resize', () => {
      this.containerSize = this.container[dirProp(direction, 'offsetWidth', 'offsetHeight')];
      this.movePane(this.currentIndex);
    });

    // wrap event cursor
    container.addEventListener('mousedown', function moudedown() {
      this.style.cursor = '-moz-grabbing';
      this.style.cursor = '-webkit-grabbing';
      this.style.cursor = 'grabbing';
    });

    container.addEventListener('mouseup', function mouseup() {
      this.style.cursor = '-moz-grab';
      this.style.cursor = '-webkit-grab';
      this.style.cursor = 'grab';
    });
  }

  /**
  * move a pane
  * @param {Number} showIndex
  * @param {Boolean} [animate]
  * @param {Number} [percent] percentage visible
  */
  movePane(showIndex, animate = false, percent = 0) {
    showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));

    const classList = this.container.classList;
    if (animate) {
      if (!classList.contains('animate')) {
        classList.add('animate');
        console.log(`Current index is ${showIndex}, Old index is ${this.prevIndex}`);
        // Load stuff here.
      }
    } else {
      if (classList.contains('animate')) {
        classList.remove('animate');
      }
    }

    this.panes.map((pane, i) => {
      const pos = (this.containerSize / 100) * (((i - showIndex) * 100) + percent);
      let translate = null;

      if (this.direction & Hammer.DIRECTION_HORIZONTAL) {
        translate = `translate3d(${pos}px, 0, 0)`;
      } else {
        translate = `translate3d(0, ${pos}px, 0)`;
      }
      pane.style.transform = translate;
      pane.style.mozTransform = translate;
      pane.style.webkitTransform = translate;
    });

    this.currentIndex = showIndex;
  }

  /**
  * handle pan
  * @param {Object} ev
  */
  onPan(ev) {
    const delta = dirProp(this.direction, ev.deltaX, ev.deltaY);
    let percent = (100 / this.containerSize) * delta;
    let animate = false;

    if (ev.type === 'panend' || ev.type === 'pancancel') {
      if (Math.abs(percent) > 20 && ev.type === 'panend') {
        this.prevIndex = this.currentIndex;
        this.currentIndex += (percent < 0) ? 1 : -1;
      }
      percent = 0;
      animate = true;
    }

    this.movePane(this.currentIndex, animate, percent);
  }
}

export default HammerCarousel;
