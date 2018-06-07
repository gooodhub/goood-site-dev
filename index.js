const metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const sitemap = require('metalsmith-mapsite');
const markdown = require('metalsmith-markdown');
const sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const permalinks = require('metalsmith-permalinks');
var ignore = require('metalsmith-ignore');
const collections = require('metalsmith-collections');
const metalSmithRegisterHelpers = require('metalsmith-register-helpers');
const rootPath = require('metalsmith-rootpath');
const dateFormatter = require('metalsmith-date-formatter');
const webpackPlugin = require('metalsmith-webpack');
const buildDate = require('metalsmith-build-date');
const updated = require('metalsmith-updated');

const browserSync = require('./plugins/metalsmith-browser-sync');
const webpackConfig = require('./webpack.conf.js');

const __DEV__ = (process.env.NODE_ENV !== 'production');

const sassParams = () => {
  if (__DEV__) {
    return {
      outputStyle: 'expanded',
      sourceMapEmbed: true,
      sourcemapContents: true,
    };
  }
  return {
    outputStyle: 'compressed',
    sourceMap: false,
  };
};

const buildApp = metalsmith(__dirname)
  .source('./src')
  .destination('./dist')
  .use(rootPath())
  .metadata({paymenturl :"https://www.paypal.com/cgi-bin/webscr"})

  // HTML
  .use(metalSmithRegisterHelpers({
    directory: './layouts/helpers',
  }))

  .use(buildDate({
    key: 'buildDate',
  }))

  .use(updated({
    filePatterns: ["*.md"]
  }))

  .use(collections({
    pages: {
      pattern: 'pages/*.md',
    },
    formations: {
      pattern: 'formations/*.md',
    },
    evenements: {
      pattern: 'evenements/*.md',
      sortBy: 'date',
      reverse: true,
    },
    portraits: {
      pattern: 'portraits/*.md',
    },
    ref_ops: {
      pattern: 'clients/operations/*.md',
    },
    ref_org: {
      pattern: 'clients/organisation/*.md',
    },
    ref_offre: {
      pattern: 'clients/offre/*.md',
    },
    toolkits: {
      pattern: 'toolkits/*.md',
      sortBy: 'order'
    },
    agile_rocket_modules: {
      pattern: 'agile-rocket/*.md',
      sortBy: 'tri',
      reverse: false,
    },
    savoir_faire: {
      pattern: 'pages/savoir-faire/*.md',
    },
  }))

  .use(dateFormatter({
    dates: [
        {
            key: 'date',
            format: 'DD/MM/YYYY'
        },
    ]
  }))

  .use(markdown())

  .use(ignore('evenements/*'))
  .use(ignore('clients/*/*'))
  .use(ignore('portraits/*'))
  .use(ignore('agile-rocket/*'))
  //.use(ignore('toolkits/*'))
  // Routing
  .use(permalinks({
    pattern: ':slug',
    relative: false,
    linksets: [{
        match: { collection: 'subPages' },
        pattern: ':parent/:slug',
      },{
        match: { collection: 'pages' },
        pattern: ':slug',
      },{
        match: { collection: 'formations' },
        pattern: 'formations/:slug',
      },{
        match: { collection: 'toolkits' },
        pattern: 'tools/:slug',
      },
      {
       match: { collection: 'savoir_faire' },
        pattern: 'savoir-faire/:slug',
      }]
  }))

    .use(layouts({
    partials: 'layouts/partials',
    engine: 'handlebars',
    "rename": false
  }))

  // CSS
  .use(sass(sassParams()))
  .use(autoprefixer())

  .use(sitemap({
    hostname: 'https://goood.pro',
    omitIndex: true,
    changefreq: 'weekly',
    priority: 0.5,
  }))

  // JS - app.js to bundle.js using babel transpiler
  .use(webpackPlugin(webpackConfig))
;

// Live reload
if (__DEV__) {
  buildApp.use(browserSync({
    server: 'dist',
    files: [
      'layouts/**/*.html',
      'src/**/*.scss',
      'src/**/*.svg',
      'src/**/*.js',
      'src/**/*.jpg',
    ],
    port: 55555,
  }));
}

buildApp.build((err) => {
  if (err) throw err;
});
