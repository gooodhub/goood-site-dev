import 'whatwg-fetch';
import { createHistory } from 'history';

import createCarousel from './createCarousel';
import renderSlides from './renderSlides';
import pagesData from './pages';
import { toDomElement, logToHtml } from './helpers';

const goood = () => {
  let currentPage = null;
  let previousPage = null;
  let canBindEvents = false;
  let carousel = null;

  const history = createHistory();
  // Trigger changePage() on every PushState
  history.listen(changePage);

  const cache = {};
  const currentSlide = document.querySelector('.slide');
  const carouselWrapper = document.querySelector('.wrap');

  logToHtml('#log'); // @TODO - Delete for prod

  // Save current page to cache
  cache[document.location.pathname] = document.documentElement.innerHTML;

  renderSlides(currentSlide, pagesData)
  .then((currentIndex) => {
    carousel = createCarousel({
      container: carouselWrapper,
      onMovePaneEnd: triggerPushState,
      onTransitionEnd: bindEvents,
      currentIndex,
    });

    console.log(carousel);
  });

  /**
  * Passed to createCarousel on move pane end
  * Trigger pushState, then changePage()
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function triggerPushState(index, prevIndex) {
    currentPage = pagesData.find((p) => p.position === index);
    previousPage = pagesData.find((p) => p.position === prevIndex);

    if (history.getCurrentLocation().pathname !== currentPage.path) {
      history.push(currentPage.path);
      canBindEvents = true;
    }
  }

  /**
  * Passed to createCarousel on transition pane end
  * Bind scripts events for current slide and unbind for previous slide
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function bindEvents() {
    if (canBindEvents) {
      previousPage.getDOMElement().innerHTML = '';
      previousPage.onLeaveCompleted();
      currentPage.onEnterCompleted();
      canBindEvents = false;
    }
  }

  /**
  * Triggered on every pushState
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function changePage(location) {
    loadPage(location.pathname)
    .then(body => {
      const bodyEl = toDomElement(body);
      const content = bodyEl.querySelector('.slide').innerHTML;

      document.title = bodyEl.title;
      currentPage.getDOMElement().innerHTML = content;
    })
    ;
  }

  function loadPage(path) {
    if (cache[path]) {
      console.log(`${path} data from cache`);
      return Promise.resolve(cache[path]);
    }
    return fetch(location.pathname)
    .then(response => {
      console.log(`${path} data from fetching`);
      cache[path] = response.text();
      return cache[path];
    });
  }
};


// Init App
goood();
