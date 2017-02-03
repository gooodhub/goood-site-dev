/* global navigator, document, window */
import $ from 'jquery';

import pagesData from './pages';

const goood = () => {
  let currentPage = null;

  const cache = {};
  const firstElement = document.querySelector('.slide') || document.querySelector('.subPage');

  cache[document.location.pathname] = document.documentElement.innerHTML; // Save current page to cache
  currentPage = pagesData.find((p) => p.id === firstElement.id);

  bindNavMenu();
  bindEvents();

  function bindNavMenu() {
    document.querySelector('.ham').addEventListener('click', () => document.body.classList.toggle('body--hasMenuOpened'));
    [...document.querySelectorAll('.nav a')].forEach(item => item.addEventListener('click', () => document.body.classList.toggle('body--hasMenuOpened')));
  }

  /**
  * Bind scripts events for current slide and unbind for previous slide
  */
  function bindEvents() {
    if (currentPage) {
      currentPage.onEnterCompleted();
    }
  }
};

// Init App
goood();
