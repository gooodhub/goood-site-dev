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
      onTransitionStart: triggerPushState,
      onTransitionEnd: bindEvents,
      currentIndex,
    });
  });

  /**
  * Passed to createCarousel on move pane end
  * Trigger pushState, then changePage()
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function triggerPushState(index) {
    const path = pagesData.find((p) => p.position === index).path;

    if (history.getCurrentLocation().pathname !== path) {
      history.push(path);
    }
  }

  /**
  * Passed to createCarousel on transition pane end
  * Bind scripts events for current slide and unbind for previous slide
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function bindEvents(index, prevIndex) {
    currentPage = pagesData.find((p) => p.position === index);
    previousPage = pagesData.find((p) => p.position === prevIndex);

    if (canBindEvents) {
      previousPage.getDOMElement().innerHTML = '';
      previousPage.onLeaveCompleted();
      currentPage.onEnterCompleted();
      canBindEvents = false;
    }
  }

  /**
  * Triggered on every pushState
  * Select .slide element from body and append in the currentPage
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function changePage(location) {
    const page = pagesData.find((p) => p.path === location.pathname);

    if (location.action === 'POP') carousel.showPane(page.position);
    canBindEvents = true;

    loadPage(location.pathname)
    .then(body => {
      const bodyEl = toDomElement(body);
      const content = bodyEl.querySelector('.slide').innerHTML;

      document.title = bodyEl.title;
      page.getDOMElement().innerHTML = content;
    })
    ;
  }

  /**
  * Fetch page according to path - If page in cache, return cache instead
  * @param {String} path
  * @return {String} HTMLString
  */
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
