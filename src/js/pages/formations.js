export default {
  position: 5,
  id: 'formations',
  path: '/formations/',
  title: 'Formations',
};

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