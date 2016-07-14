/**
* Prepend, or append page slide according to the current one.
* @param {Node} currentSlide
* @param {Array} slides
* @return currentPosition (stupid as f, but I got lazy)
*/
const loadAllSlides = (currentSlide, slides) => {
  const currentId = currentSlide.id;
  const currentPosition = slides.findIndex(s => s.slug === currentId);

  slides.map((s, i) => {
    if (s.slug === currentId) return false;

    const insertAfter = (i > currentPosition);
    const template = (
      `
        <div class="slide" id="${s.slug}">
        </div>
      `
    );

    if (insertAfter) {
      currentSlide.parentNode.insertAdjacentHTML('beforeEnd', template);
    } else {
      currentSlide.insertAdjacentHTML('beforeBegin', template);
    }
  });
  return Promise.resolve(currentPosition);
};

export default loadAllSlides;
