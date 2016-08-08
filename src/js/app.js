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
  // let isSubPageOpened = false;

  const cache = {};
  const firstElement = document.querySelector('.slide') || document.querySelector('.subPage');
  const carouselWrapper = document.querySelector('.wrap');

  cache[document.location.pathname] = document.documentElement.innerHTML; // Save current page to cache
  currentPage =
    pagesData.find((p) => p.id === firstElement.id) ||
    pagesData.find((p) => p.id === firstElement.dataset.parent);
  // if (firstElement.classList.contains('subPage')) isSubPageOpened = true;

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
    bindEvents(currentPage);

    // @TODO - Delete for prod
    // document.getElementById('next').addEventListener('click', carousel.nextPane);
    // document.getElementById('prev').addEventListener('click', carousel.prevPane);
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
    // page('/:slug/:subSlug', changeSubPage);
    page({
      popstate: false,
    });

    window.onpopstate = (e) => {
      const path = e.state.path;
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
      previousPage.onLeaveCompleted();
      previousPage.getDOMElement().scrollTop = 0;
      previousPage.getDOMContent().innerHTML = '';
    }
    // handleScrollBehaviour(currentPage);
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
      });
  }


  /**
  * Fetch page according to path - If page in cache, return cache instead
  * @param {String} path
  * @return {String} HTMLString
  */
  function fetchPage(path) {
    if (cache[path]) {
      console.log(`${path} data from cache`);
      return Promise.resolve(cache[path]);
    }
    return fetch(path)
      .then(response => {
        console.log(`${path} data from fetching`);
        cache[path] = response.text();
        return cache[path];
      });
  }


  // function changeSubPage(ctx) {
  //   // If subpage
  //   loadPage(ctx.pathname)
  //   .then(body => {
  //     const bodyEl = toDomElement(body);
  //     const content = bodyEl.querySelector('.subPageContainer').innerHTML;
  //
  //     document.title = bodyEl.title;
  //     document.querySelector('.subPageContainer').innerHTML = content;
  //
  //     isSubPageOpened = true;
  //   });
  // }
};


// Init App
goood();
