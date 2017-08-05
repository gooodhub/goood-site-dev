import homePage from './pages/home';
import equipePage from './pages/equipe';
import careersPage from './pages/recrutement';
import recettePage from './pages/recette';
import referencesPage from './pages/references';
import eventsPage from './pages/evenements';
import contactPage from './pages/contact';
import sousPage from './pages/sous-page';
import formationsPage from './pages/formations';
import toolkitPage from './pages/toolkit';
import savoirPage from './pages/savoir-faire';
import rocketPage from './pages/rocket';

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
pages.push(createPage(savoirPage));
pages.push(createPage(rocketPage));
pages.push(createPage(referencesPage));
pages.push(createPage(equipePage));
pages.push(createPage(careersPage));
pages.push(createPage(formationsPage));
pages.push(createPage(eventsPage));
pages.push(createPage(contactPage));
pages.push(createPage(toolkitPage));

export default pages;
