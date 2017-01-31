const metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const permalinks = require('metalsmith-permalinks'); 
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
  .ignore('./static', './files')
  .use(rootPath())

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

  .use(dateFormatter({
    dates: [
        {
            key: 'date',
            format: 'YYYY-MM'
        },
    ]
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
  }))
  .use(markdown())

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
      }]
  }))

  // Contenu et mise en forme
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials',
  }))

  // CSS
  .use(sass(sassParams()))
  .use(autoprefixer())


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
