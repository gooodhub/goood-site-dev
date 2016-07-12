const metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const browserSync = require('metalsmith-browser-sync');
const sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const permalinks = require('metalsmith-permalinks');
const path = require('path');
const rootPath = require('metalsmith-rootpath');
const webpackPlugin = require('metalsmith-webpack');
const webpack = require('webpack');


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
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials',
  }))

  // CSS
  .use(sass(sassParams()))
  .use(autoprefixer())

  // JS - app.js to bundle.js using babel transpiler
  .use(webpackPlugin({
    devtool: __DEV__ ? 'inline-source-map' : 'cheap-module-source-map',
    context: path.resolve(__dirname, 'src/js/'),
    entry: './app.js',
    output: {
      path: path.resolve(__dirname, 'dist/js/'),
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel?presets[]=es2015',
        },
      ],
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  }))

  // Routing
  .use(permalinks({
    pattern: ':title',
    relative: false,
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
