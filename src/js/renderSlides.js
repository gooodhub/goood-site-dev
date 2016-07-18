/**
* Prepend, or append page slide according to the current one.
* @param {Node} currentSlide
* @param {Array} slides
* @return currentPosition (stupid as f, but I got lazy)
*/
const loadAllSlides = (currentSlide, slides) => {
  const currentId = currentSlide.id;
  const currentPosition = slides.find(s => s.id === currentId).position;

  slides.map((s) => {
    if (s.id === currentId) return false;

    const insertAfter = (s.position > currentPosition);
    const template = (
      `
        <div class="slide" id="${s.id}">
          <div class="slide__header">
            ${s.title}
          </div>
          <div class="slide__content">
          </div>
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
