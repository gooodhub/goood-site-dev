export default function handleScrollBehaviour(currentPage) {
  let delta;
  let animating = false;
  const currentElement = currentPage.getDOMElement();
  const currentElementClassList = currentElement.classList;

  window.addEventListener('mousewheel', elementScroll);
  window.addEventListener('DOMMouseScroll', elementScroll); // FF Support
  currentElement.addEventListener('transitionend', toggleScroll);

  function toggleScroll(e) {
    if (e.target.parentNode.classList.contains('slide--isSliding')) {
      animating = false;
      currentElementClassList.add('slide--isSlided');
    } else {
      animating = false;
      currentElement.classList.remove('slide--isSliding');
      currentElementClassList.remove('slide--isSlided');
    }
  }

  function elementScroll(e) {
    // cross-browser wheel delta
    delta = e.detail ? e.detail * (-120) : e.wheelDelta;

    if (!animating) {
      if (delta < 0 && currentPage.getScrollY() === 0 && !currentElementClassList.contains('slide--isSlided')) {
        currentElement.classList.add('slide--isSliding');
        animating = true;
      }
      if (delta > 0 && currentPage.getScrollY() === 0 && currentElementClassList.contains('slide--isSlided')) {
        currentElement.classList.remove('slide--isSliding');
        currentElement.classList.remove('slide--isSlided');
        animating = true;
      }
    }
  }
}
