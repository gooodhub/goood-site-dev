import homePage from './pages/home';
import equipePage from './pages/equipe';
import recettePage from './pages/recette';
import referencesPage from './pages/references';

const protoPage = {
  position: null,

  id: '',

  path: '/',

  title: 'Titre manquant',

  getDOMElement() {
    return document.getElementById(this.id);
  },

  getDOMHeader() {
    return document.getElementById(this.id).querySelector('.slide__header');
  },

  getDOMContent() {
    return document.getElementById(this.id).querySelector('.slide__content');
  },

  getScrollY() {
    return document.getElementById(this.id).scrollTop;
  },

  onEnterCompleted() {
    console.info(`${this.id} onEnterCompleted`);
  },

  onLeaveCompleted() {
    console.info(`${this.id} onLeaveCompleted`);
  },

  renderTemplate({ insertAfter, template }) {
    if (insertAfter) {
      this.getDOMElement().parentNode.insertAdjacentHTML('beforeEnd', template);
    } else {
      this.getDOMElement().insertAdjacentHTML('beforeBegin', template);
    }
  },
};

const createPage = (obj) => Object.assign(Object.create(protoPage), obj);

const pages = [];

pages.push(createPage(homePage));
pages.push(createPage(recettePage));
pages.push(createPage(referencesPage));
pages.push(createPage(equipePage));
pages.push(createPage({
  position: 4,
  id: 'contact',
  path: '/contact/',
  title: 'Contact',
}));

export default pages;
