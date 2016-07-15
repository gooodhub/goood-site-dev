/**
* Prepend, or append page slide according to the current one.
* @param {Node} currentSlide
* @param {Array} slides
* @return currentPosition (stupid as f, but I got lazy)
*/
const loadAllSlides = (currentSlide, slides) => {
  const currentId = currentSlide.id;
  const currentPosition = slides.find(s => s.slug === currentId).position;

  slides.map((s) => {
    if (s.slug === currentId) return false;

    const insertAfter = (s.position > currentPosition);
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
