import 'whatwg-fetch';
import { createHistory } from 'history';

import createCarousel from './createCarousel';
import renderSlides from './renderSlides';
import pagesData from './pages';
import { toDomElement, logToHtml } from './helpers';


let currentPage = null;
let previousPage = null;
let carousel = null;
let canBindEvents = false;

const cache = {};
const currentSlide = document.querySelector('.slide');
const carouselWrapper = document.querySelector('.wrap');

const history = createHistory();
const unlistenHistory = history.listen(changePage);


logToHtml('#log');

renderSlides(currentSlide, pagesData)
.then((currentIndex) => {
  carousel = createCarousel({
    container: carouselWrapper,
    onMovePaneEnd: triggerPushState,
    onTransitionEnd: bindEvents,
    currentIndex,
  });
});

function triggerPushState(index, prevIndex) {
  currentPage = pagesData.find((p) => p.position === index);
  previousPage = pagesData.find((p) => p.position === prevIndex);

  if (history.getCurrentLocation().pathname !== currentPage.path) {
    history.push(currentPage.path);
    canBindEvents = true;
  }
}

function bindEvents() {
  if (canBindEvents) {
    previousPage.getDOMElement().innerHTML = '';
    previousPage.onLeaveCompleted();
    currentPage.onEnterCompleted();
    canBindEvents = false;
  }
}

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
