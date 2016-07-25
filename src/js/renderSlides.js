const renderTemplate = (slide) => (`
  <div class="slide" id="${slide.id}">
    <div class="slide__header">
      ${slide.title}
    </div>
    <div class="slide__content">
    </div>
  </div>
`);

/**
* Prepend, or append page slide according to the current one.
* @param {Node} currentSlide
* @param {Array} slides
* @return currentPosition (stupid as f, but I got lazy)
*/
const loadAllSlides = (currentSlide, slides) => {
  if (currentSlide.classList.contains('subPage')) {
    // NEED REFACTO - Ugly, render first div
    document.querySelector('.wrap').innerHTML = renderTemplate(slides[0]);
    currentSlide = document.getElementById('home');
  }

  const currentId = currentSlide.id;
  const currentElement = slides.find(s => s.id === currentId);
  const currentPosition = currentElement ? currentElement.position : -1;

  slides.map((s) => {
    if (s.id === currentId) return false;

    const insertAfter = (s.position > currentPosition);
    const template = renderTemplate(s);

    if (insertAfter) {
      currentSlide.parentNode.insertAdjacentHTML('beforeEnd', template);
    } else {
      currentSlide.insertAdjacentHTML('beforeBegin', template);
    }
  });
  return Promise.resolve();
};

export default loadAllSlides;
