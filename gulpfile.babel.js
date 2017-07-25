'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';
import plumber from 'gulp-plumber';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config.babel.js';
import stylus from 'gulp-stylus';
import cssnano from 'cssnano';
import postcss from 'gulp-postcss';
import poststylus from 'poststylus';
import lost from 'lost';
import gulpLoadPlugins from 'gulp-load-plugins';
const plugins = gulpLoadPlugins();
import { spawn } from 'child_process';

import rupture from 'rupture';
import bootstrap from 'bootstrap-styl';
import fs from 'fs';
// old ie support for postcss
import cssgrace from 'cssgrace';
import rename from 'gulp-rename';

import WebpackWriteFilePlugin from 'write-file-webpack-plugin';

const PATHS = {
  site: '_site',
  build: '_site/cdn/dist',
  images: 'static/images/',
  css: '_site/cdn/css/min/',
  stylus: '_stylus/**/*.styl',
  js: 'scripts/**/*.js'
};

const supported = {
    browsers: [
    'last 2 version',
    'safari 5',
    'ie 8',
    'ie 9',
    'opera 12.1',
    'ios 6',
    'android 4']
};
//TODO: Look at other options for cssnano

/*
=========================
2        Dev tasks
       (npm start)
=========================
*/
gulp.task('default', ['webpack-dev-server', 'jekyll-dev', 'watcher', 'css:dev']);
gulp.task('webpack-dev-server', [], (cb) => {
  var myConfig = Object.create(webpackConfig);
  myConfig.devServer = {
    stats : 'errors-only',
    outputPath: PATHS.build,
    hot: true
  };

   myConfig.stats = 'errors-only';
   myConfig.devtool = '#eval-source-map';
  var compiler = webpack(myConfig, function(err,stats){
    if(err) throw new gutil.PluginError("webpack", err);
    cb();
  });
  new WebpackDevServer(compiler, {
    devServer: {
      outputPath: PATHS.build,
      stats : 'errors-only'
    },
    stats: 'errors-only',
    hot: true,
    contentBase: PATHS.site,
    plugins: [
      new WebpackWriteFilePlugin({log:false, stats:'errors-only'}),
      new webpack.HotModuleReplacementPlugin()
    ]
  }).listen(8080, "0.0.0.0", (err) => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    //gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/');
  });
});
gulp.task('jekyll-dev', (gulpCallBack) => {
  var jekyll = spawn('jekyll', [
    'build',
    '--watch',
    '--source',
    '_jekyll',
    '--config',
    '_jekyll/_config_dev.yml'
  ], {stdio: 'inherit'});
  jekyll.on('exit', (code) => {
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll exited with code' + code);
  });
});
gulp.task('watcher', () => {
  plugins.livereload.listen();
  gulp.watch(PATHS.stylus, ['css:dev']);
  gulp.watch([PATHS.site + '**/*.html', PATHS.css + '**/*.css', PATHS.js], function(event){
    gulp.src(event.path)
      .pipe(plugins.plumber())
      .pipe(plugins.livereload());
  });
});
gulp.task('css:dev', () => {
  return gulp.src(PATHS.stylus)
    .pipe( plumber())
    .pipe( sourcemaps.init() )
    .pipe( stylus({
      use: [
        bootstrap(),
        rupture(),
        poststylus(['lost'])
      ]
    }))
    .pipe( plugins.rename({ suffix: '.min'}))
    .pipe( sourcemaps.write('.'))
    .pipe( gulp.dest(PATHS.css));
});
/*===== End Dev Tasks =====*/
/*
============================
 3       Build Tasks
       (npm run build)
============================
*/
gulp.task('build', ['clean', 'clean-staging', 'webpack','stage', 'clean-styleguide', 'css:production', 'copy-static', 'copy-cdn-js', 'copy-cdn-css']);
gulp.task('stage', ['jekyll-build', 'jekyll-stage']);
//Compile the jekyll site for the staging site
gulp.task('jekyll-stage',['clean-staging'], (gulpCallBack) => {
  var jekyll = spawn('jekyll', [
    'build',
    '--source',
    '_jekyll',
    '--config',
    '_jekyll/_config_staging.yml'
  ], {stdio: 'inherit'});
  jekyll.on('exit', function(code){
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll exited with code' + code);
  });
});
// Compile the jekyll site for the live environment
// webpack, css:production, jekyll-stage, jekyll build
gulp.task('jekyll-build',['clean'], function(gulpCallBack){
  var jekyll = spawn('jekyll', [
    'build',
    '--source',
    '_jekyll',
    '--config',
    '_jekyll/_config.yml'
  ], {stdio: 'inherit'});
  jekyll.on('exit', function(code){
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll exited with code' + code);
  });
});

gulp.task('webpack', ['clean'], function(cb){
  var myConfig = Object.create(webpackConfig);
  myConfig.stats = "errors-only";
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // this has an effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
  webpack(myConfig, function(err,stats){
    if(err) throw new gutil.PluginError("webpack", err);
      gutil.log("[webpack]", stats.toString({
        colors: true
      }));
    cb();
  });
});
gulp.task('copy-cdn-css', ['clean-staging', 'css:production'], function() {
  return gulp.src(['_site/cdn/css/**/*']).pipe(gulp.dest('_staging/cdn/css'));
});
gulp.task('copy-cdn-js', ['clean-staging', 'webpack'], function() {
  return gulp.src(['_site/cdn/dist/**/*']).pipe(gulp.dest('_staging/cdn/dist'));
});
gulp.task('copy-static', ['clean-staging'], function() {
  return fs.access('_staging/static/', fs.R_OK, function(err){
    if(err)
      gutil.log('I can\'t find /_staging/static/, attempting copy anyways...');
    gutil.log('copying static...');
    gulp.src(['_site/static/**/*']).pipe(gulp.dest('_staging/static'));
  });
});
gulp.task('css:production',['clean'], function() {
  return gulp.src(PATHS.stylus)
    .pipe(stylus({
      use: [
        bootstrap(),
        rupture()
      ]
    }))
    .pipe( postcss([cssnano({ normalizeUrl: false }), lost()]) )
    .pipe( plugins.rename({ suffix: '.min'}) )
    .pipe( gulp.dest(PATHS.css) );
});
gulp.task('clean', function(){
  return gulp.src('_site/cdn/dist/')
    .pipe(clean());
});
gulp.task('clean-staging', function(){
  return gulp.src('_staging/cdn/')
    .pipe(clean());
});
gulp.task('clean-styleguide', function(){
  return fs.access('_site/style/index.html', fs.R_OK, function(err){
    if(err){
      gutil.log("No style guide to delete!");
    }else{
      gutil.log("Found style guide. Deleting...");
      fs.unlink('_site/style/index.html');
      gutil.log("Deleted _site/style/index.html. Removing style directory...");
      fs.rmdirSync('_site/style');
      gutil.log("Deleted style directory.");
    }
  });
});
/*=====End Build Tasks=====*/
/*
  One-off Tasks
*/
// Gulp task for generating IE styles
gulp.task('iefix', function(){
  var processors = [
    cssgrace
  ];
  gulp.src(PATHS.css + 'screen.min.css')
    .pipe(postcss(processors))
    .pipe(rename('ie.min.css'))
    .pipe(gulp.dest(PATHS.css + '/ie/'));
});
//Imagemin
gulp.task('images', [], function() {
  var imgStream = gulp.src(PATHS.images + '**/*')
    .pipe(plugins.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(PATHS.images));
  return imgStream;
});
