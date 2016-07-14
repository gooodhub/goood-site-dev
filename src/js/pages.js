const Page = {
  position: null,

  slug: '',

  path: '/',

  getDOMElement() {
    return document.getElementById(this.slug);
  },

  onEnterCompleted() {
    console.info(`${this.slug} onEnterCompleted`);
  },

  onLeaveCompleted() {
    console.info(`${this.slug} onLeaveCompleted`);
  },
};

const pages = [];

pages.push({
  ...Page,
  position: 0,
  slug: 'home',
  path: '/',
});

pages.push({
  ...Page,
  position: 1,
  slug: 'page-1',
  path: '/page-1/',
});

pages.push({
  ...Page,
  position: 2,
  slug: 'page-2',
  path: '/page-2/',
});

pages.push({
  ...Page,
  position: 3,
  slug: 'page-3',
  path: '/page-3/',
});

pages.push({
  ...Page,
  position: 4,
  slug: 'a-propos-de-goood',
  path: '/a-propos-de-goood/',
});

export default pages;
