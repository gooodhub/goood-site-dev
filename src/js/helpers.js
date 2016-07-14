export const toDomElement = (html) => (new DOMParser).parseFromString(html, 'text/html');

export const logToHtml = (selector) => {
  const log = document.querySelector(selector);

  ['log', 'warn', 'error', 'info'].forEach((verb) => {
    console[verb] = ((method, verb, log) => {
      return (text) => {
        method(text);
        // handle distinguishing between methods any way you'd like
        const msg = document.createElement('code');
        msg.classList.add(verb);
        msg.textContent = `${verb} : ${text}`;
        log.appendChild(msg);
      };
    })(console[verb].bind(console), verb, log);
  });
};
