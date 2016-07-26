import 'whatwg-fetch';
import page from 'page';

import createCarousel from './createCarousel';
import renderSlides from './renderSlides';
import pagesData from './pages';
import { toDomElement } from './helpers';
// import handleScrollBehaviour from './scrollBehaviour';

const goood = () => {
  let currentPage = null;
  let previousPage = null;
  let canBindEvents = false;
  let carousel = null;
  let isSubPageOpened = false;

  const cache = {};
  const firstElement = document.querySelector('.slide') || document.querySelector('.subPage');
  const carouselWrapper = document.querySelector('.wrap');

  // Init routing
  page('/:slug?', changePage);
  page('/:slug/:subSlug', changeSubPage);
  page({
    popstate: false,
  });

  window.onpopstate = (e) => {
    const path = e.state.path;
    e.state.popstate = true;
    page.replace(path, e.state);
  };


  cache[document.location.pathname] = document.documentElement.innerHTML; // Save current page to cache
  currentPage =
    pagesData.find((p) => p.id === firstElement.id) ||
    pagesData.find((p) => p.id === firstElement.dataset.parent);

  if (firstElement.classList.contains('subPage')) {
    isSubPageOpened = true;
  }

  renderSlides(firstElement, pagesData)
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
    // logToHtml('#log');
    document.getElementById('next').addEventListener('click', carousel.nextPane);
    document.getElementById('prev').addEventListener('click', carousel.prevPane);
  }

  /**
  * Passed to createCarousel on move pane end
  * Trigger pushState, then changePage()
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function onTransitionStart(index, prevIndex) {
    currentPage = pagesData.find((p) => p.position === index);
    previousPage = pagesData.find((p) => p.position === prevIndex);

    const path = currentPage.path;

    if (document.location.pathname !== path) {
      page(path);
    }
  }

  /**
  * Passed to createCarousel on transition pane end
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function onTransitionEnd() {
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
    // handleScrollBehaviour(currentPage);
    currentPage.onEnterCompleted();
  }

  /**
  * Triggered on every pushState
  * Select .slide element from body and append in the currentPage
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function changePage(ctx) {
    if (isSubPageOpened) {
      document.querySelector('.subPageContainer').innerHTML = '';
      isSubPageOpened = false;
    }

    const pageItem = pagesData.find((p) => p.path === ctx.pathname);

    if (ctx.state.popstate && !isSubPageOpened) carousel.showPane(pageItem.position);
    canBindEvents = true;

    loadPage(ctx.pathname)
    .then(body => {
      const bodyEl = toDomElement(body);
      const content = bodyEl.querySelector('.slide__content').innerHTML;

      document.title = bodyEl.title;
      pageItem.getDOMContent().innerHTML = content;
    });
  }

  function changeSubPage(ctx) {
    // If subpage
    loadPage(ctx.pathname)
    .then(body => {
      const bodyEl = toDomElement(body);
      const content = bodyEl.querySelector('.subPageContainer').innerHTML;

      document.title = bodyEl.title;
      document.querySelector('.subPageContainer').innerHTML = content;

      isSubPageOpened = true;
    });
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
