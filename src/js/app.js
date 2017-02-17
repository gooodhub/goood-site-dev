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

  outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'transform',
    languagePath: ''
  });

function envoiGA(category, action, label){
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  });
};

function envoiGABeacon(category, action, label){
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    transport: 'beacon'
  });
};

envoiGA("AccesPage","acces", window.location.href);

//formations
$('.formation-link').on("click", function(){
  envoiGABeacon('formation','acces','Click depuis /formations/ vers la formation : ' + $(this).data('title'));
});

$('#contact-formation').on("click", function(){
  envoiGA("formation","contact", "Demande contact formation : " + $(this).data('title'));
});

$('.slide-nav-buttons__parent').on("click",function(){
  envoiGA("formation","retour-formations", "Retour vers les formations");
});

$('#contact-celia-page-formations').on("click",function(){
  envoiGA("formations","contact", "contact depuis le listing de toutes les formations");
});

$('#telechargement-catalogue-formation').on("click",function(){
  envoiGA("formations","catalogue", "téléchargement du catalogue de formation");
});

//agenda
$('.cd-timeline-content').on("click", function(){
  envoiGABeacon("agenda","visualisation-evenement", "Accès à l'événement : " + $(this).data('title'));
});

//global
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    envoiGA("scroll","bas de page", "utilisateur en bas de la page : " + window.location.href);
    }
};

//main page
$('#video-dth').on("click", function(){
  envoiGA("home","video", "Ouverture de la pop-in vidéo");
});

//contacts
$('#contact-sandrine').on('click', function(){
  envoiGA("contact","demande-contact", "Demande de contact pour Paris");
});

$('#contact-gregory').on("click", function(){
  envoiGA("contact","demande-contact", "Demande de contact pour Lyon");
});

$('#contact-romain').on("click", function(){
  envoiGA("contact","demande-contact", "Demande de contact pour le Sud");
});
