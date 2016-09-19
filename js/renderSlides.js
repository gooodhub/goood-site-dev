import headerTemplate from './headerTemplate';

const htmlSlide = (slide) =>
`
  <div class="slide" id="${slide.id}">
    ${headerTemplate({ title: slide.title, isHome: slide.id === 'home' })}
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
