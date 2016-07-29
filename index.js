const metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const permalinks = require('metalsmith-permalinks');
const collections = require('metalsmith-collections');
const metalSmithRegisterHelpers = require('metalsmith-register-helpers');
const rootPath = require('metalsmith-rootpath');
const webpackPlugin = require('metalsmith-webpack');

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
  .destination('./dist')
  .use(rootPath())

  // HTML
  .use(metalSmithRegisterHelpers({
    directory: './layouts/helpers',
  }))
  .use(collections({
    pages: {
      pattern: 'pages/*.md',
    },
    subPages: {
      pattern: 'subPages/*.md',
      sortyBy: 'date',
      reverse: true,
    },
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials',
  }))

  // CSS
  .use(sass(sassParams()))
  .use(autoprefixer())

  // JS - app.js to bundle.js using babel transpiler
  .use(webpackPlugin(webpackConfig))

  // Routing
  .use(permalinks({
    pattern: ':slug',
    relative: false,

    linksets: [
      {
        match: { collection: 'subPages' },
        pattern: ':parent/:slug',
        date: 'mmddyy',
      },
      {
        match: { collection: 'pages' },
        pattern: ':slug',
      },
    ],
  }))
;

// Live reload
if (__DEV__) {
  buildApp.use(browserSync({
    server: 'dist',
    files: [
      'src/**/*.md',
      'layouts/**/*.html',
      'src/**/*.scss',
      'src/**/*.js',
    ],
    port: 55555,
  }));
}

buildApp.build((err) => {
  if (err) throw err;
});
