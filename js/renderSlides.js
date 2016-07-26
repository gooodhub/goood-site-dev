const htmlSlide = (slide) =>
`
  <div class="slide" id="${slide.id}">
    <div class="slide__header">
      ${slide.title}
    </div>
    <div class="slide__content">
    </div>
  </div>
`;

/**
* Prepend, or append page slide according to the current one.
* @param {Node} currentSlide
* @param {Array} slides
* @return currentPosition (stupid as f, but I got lazy)
*/
const loadAllSlides = (currentSlide, slides) => {
  // NEED REFACTO - Ugly, render first div
  if (currentSlide.classList.contains('subPage')) {
    document.querySelector('.wrap').innerHTML = htmlSlide(slides[0]);
    currentSlide = document.getElementById('home');
  }

  const currentId = currentSlide.id;
  const currentElement = slides.find(s => s.id === currentId);
  const currentPosition = currentElement.position;

  slides.map((slide) => {
    if (slide.id === currentId) return false;

    currentElement.renderTemplate({
      insertAfter: slide.position > currentPosition,
      template: htmlSlide(slide),
    });
  });
  return Promise.resolve();
};

export default loadAllSlides;
