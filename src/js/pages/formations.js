export default {
  position: 5,
  id: 'formations',
  path: '/formations/',
  title: 'Formations',
};

ga('send', {
  hitType: 'event',
  eventCategory: 'AccesPage',
  eventAction: 'acces',
  eventLabel: 'Ouverture page' + window.location.href
});

$('.formation-link').on("click", function()
{
	ga('send', 
	{
	  hitType: 'event',
	  eventCategory: 'Click',
	  eventAction: 'Accès formation',
	  eventLabel: 'Ouverture page'
	});
});