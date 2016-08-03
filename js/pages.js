import homePage from './pages/home';
import equipePage from './pages/equipe';
import recettePage from './pages/recette';

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

pages.push(createPage(equipePage));

pages.push(createPage(recettePage));

pages.push(createPage({
  position: 3,
  id: 'page-3',
  path: '/page-3/',
}));

pages.push(createPage({
  position: 4,
  id: 'a-propos-de-goood',
  path: '/a-propos-de-goood/',
}));

export default pages;
