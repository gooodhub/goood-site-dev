import 'whatwg-fetch';
import page from 'page';

import createCarousel from './createCarousel';
import renderSlides from './renderSlides';
import pagesData from './pages';
import { toDomElement } from './helpers';

const goood = () => {
  let currentPage = null;
  let previousPage = null;
  let canBindEvents = false;
  let carousel = null;

  const cache = {};
  const firstElement = document.querySelector('.slide') || document.querySelector('.subPage');
  const carouselWrapper = document.querySelector('.wrap');

  cache[document.location.pathname] = document.documentElement.innerHTML; // Save current page to cache
  currentPage =
    pagesData.find((p) => p.id === firstElement.id) ||
    pagesData.find((p) => p.id === firstElement.dataset.parent);

  initRouting();
  bindNavMenu();
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
    bindEvents();
  }

  function bindNavMenu() {
    document.querySelector('.ham').addEventListener('click', () => document.body.classList.toggle('body--hasMenuOpened'));
    [...document.querySelectorAll('.nav a')].forEach(item => item.addEventListener('click', () => document.body.classList.toggle('body--hasMenuOpened')));
  }

  /**
  * Init routing by declaring page.js function
  */
  function initRouting() {
    page('/:slug?', slideTo);
    page({
      popstate: false,
    });

    window.onpopstate = (e) => {
      const path = e.state ? e.state.path : null;
      e.state.popstate = true;
      page.replace(path, e.state);
    };
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

    currentPage.getDOMElement().scrollTop = 0;

    if (previousPage.path !== currentPage.path) {
      changePage(currentPage.path);
    }
  }


  /**
  * Passed to createCarousel on transition pane end
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function onTransitionEnd() {

  }


  /**
  * Bind scripts events for current slide and unbind for previous slide
  */
  function bindEvents() {
    if (previousPage) {
      previousPage.onLeaveCompleted();
      previousPage.getDOMContent().innerHTML = '';
    }
    currentPage.onEnterCompleted();
  }


  /**
  * Triggered on every pushstate/popstate, Slide to pane
  * @param {Object} context
  */
  function slideTo(ctx) {
    if (ctx.init) return;

    const pageItem = pagesData.find((p) => p.path === ctx.pathname);

    if (ctx.pathname !== currentPage.path) {
      carousel.showPane(pageItem.position);
    }
  }


  /**
  * Fetch .slide element from body and append in the currentPage
  * @param {Number} index
  * @param {Number} prevIndex
  */
  function changePage(path) {
    const pageItem = pagesData.find((p) => p.path === path);
    canBindEvents = true;

    fetchPage(path)
      .then(body => {
        const bodyEl = toDomElement(body);
        const content = bodyEl.querySelector('.slide__content').innerHTML;

        document.title = bodyEl.title;
        pageItem.getDOMContent().innerHTML = content;

        if (canBindEvents) {
          bindEvents();
          canBindEvents = false;
        }
      });
  }


  /**
  * Fetch page according to path - If page in cache, return cache instead
  * @param {String} path
  * @return {String} HTMLString
  */
  function fetchPage(path) {
    if (cache[path]) {
      return Promise.resolve(cache[path]);
    }

    document.body.classList.add('body--isLoading');

    return fetch(path)
      .then(response => {
        document.body.classList.remove('body--isLoading');
        cache[path] = response.text();
        return cache[path];
      });
  }
};

// Init App
goood();
