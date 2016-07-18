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

  const cache = {};
  const currentSlide = document.querySelector('.slide');
  const carouselWrapper = document.querySelector('.wrap');
  const history = createHistory();

  history.listen(changePage); // Trigger changePage() on every PushState
  cache[document.location.pathname] = document.documentElement.innerHTML; // Save current page to cache
  currentPage = pagesData.find((p) => p.id === currentSlide.id);

  renderSlides(currentSlide, pagesData)
  .then(() => init());

  /**
  * Once renderSlides is done, init app
  */
  function init() {
    carousel = createCarousel({
      container: carouselWrapper,
      currentIndex: currentPage.position,
      onTransitionStart,
      onTransitionEnd,
    });
    bindEvents(currentPage);

    // @TODO - Delete for prod
    logToHtml('#log');
    document.getElementById('next').addEventListener('click', carousel.nextPane);
    document.getElementById('prev').addEventListener('click', carousel.prevPane);
  }

  /**
  * Passed to createCarousel on move pane end
  * Trigger pushState, then changePage()
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function onTransitionStart(index) {
    const path = pagesData.find((p) => p.position === index).path;

    if (history.getCurrentLocation().pathname !== path) {
      history.push(path);
    }
  }

  /**
  * Passed to createCarousel on transition pane end
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function onTransitionEnd(index, prevIndex) {
    currentPage = pagesData.find((p) => p.position === index);
    previousPage = pagesData.find((p) => p.position === prevIndex);

    if (canBindEvents) {
      bindEvents(currentPage, previousPage);
      canBindEvents = false;
    }
  }

  /**
  * Bind scripts events for current slide and unbind for previous slide
  */
  function bindEvents() {
    if (previousPage) {
      previousPage.getDOMContent().innerHTML = '';
      previousPage.onLeaveCompleted();
    }
    handleScrollBehaviour(currentPage);
    currentPage.onEnterCompleted();
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
      const content = bodyEl.querySelector('.slide__content').innerHTML;

      document.title = bodyEl.title;
      page.getDOMContent().innerHTML = content;
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

  function handleScrollBehaviour() {
    let delta;
    let animating = false;
    const currentElement = currentPage.getDOMElement();
    const currentElementClassList = currentElement.classList;

    window.addEventListener('mousewheel', elementScroll);
    window.addEventListener('DOMMouseScroll', elementScroll); // FF Support
    currentElement.addEventListener('transitionend', toggleScroll);

    function toggleScroll(e) {
      if (e.target.parentNode.classList.contains('slide--isSliding')) {
        animating = false;
        currentElementClassList.add('slide--isSlided');
      } else {
        animating = false;
        currentElement.classList.remove('slide--isSliding');
        currentElementClassList.remove('slide--isSlided');
      }
    }

    function elementScroll(e) {
      // cross-browser wheel delta
      delta = e.detail ? e.detail * (-120) : e.wheelDelta;

      if (!animating) {
        if (delta < 0 && currentPage.getScrollY() === 0 && !currentElementClassList.contains('slide--isSlided')) {
          currentElement.classList.add('slide--isSliding');
          animating = true;
        }
        if (delta > 0 && currentPage.getScrollY() === 0 && currentElementClassList.contains('slide--isSlided')) {
          currentElement.classList.remove('slide--isSliding');
          currentElement.classList.remove('slide--isSlided');
          animating = true;
        }
      }
    }
  }
};


// Init App
goood();
