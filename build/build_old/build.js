// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Gulp tasks for building the project.
 */
import del from 'del';
import gulp from 'gulp';
import gulpUrlAdjuster from 'gulp-css-url-adjuster';
import gulpHtmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import gulpMinifyCss from 'gulp-minify-css';
import revAll from 'gulp-rev-all';
import gulpUglify from 'gulp-uglify';
import gulpUseref from 'gulp-useref';
import path from 'path';
import uglifySaveLicense from 'uglify-save-license';

import conf from './conf';
import {multiDest} from './multidest';


/**
 * Builds production package for current architecture and places it in the dist directory.
 */
gulp.task('build', ['backend:prod', 'build-frontend']);

/**
 * Builds production packages for all supported architectures and places them in the dist directory.
 */
gulp.task('build:cross', ['backend:prod:cross', 'build-frontend:cross']);

/**
 * Builds production version of the frontend application for the default architecture
 * (one copy per locale) and places it under .tmp/dist , preparing it for localization and revision.
 */
gulp.task(
    'frontend-copies',
    ['fonts', 'icons', 'assets', 'dependency-images', 'index:prod', 'clean-dist'], function() {
      return createFrontendCopies([path.join(conf.paths.distPre, conf.arch.default, 'public')]);
    });

/**
 * Copies images from dependencies to the dist directory for current architecture.
 */
gulp.task('dependency-images', ['clean-dist'], function() {
  return dependencyImages([conf.paths.distPublic]);
});

/**
 * Copies images from dependencies to the dist directory for all architectures.
 */
gulp.task('dependency-images:cross', ['clean-dist'], function() {
  return dependencyImages(conf.paths.distPublicCross);
});

/**
 * Builds production version of the frontend application and copies it to all
 * the specified outputDirs, creating one copy per (outputDir x locale) tuple.
 *
 * Following steps are done here:
 *  1. Vendor CSS and JS files are concatenated and minified.
 *  2. index.html is minified.
 *  3. Everything is saved in the .tmp/dist directory, ready to be localized and revisioned.
 *
 * @param {!Array<string>} outputDirs
 * @return {stream}
 */
function createFrontendCopies(outputDirs) {
  // create an output for each locale
  let localizedOutputDirs = outputDirs.reduce((localizedDirs, outputDir) => {
    return localizedDirs.concat(conf.translations.map((translation) => {
      return path.join(outputDir, translation.key);
    }));
  }, []);

  let searchPath = [
    // To resolve local paths.
    path.relative(conf.paths.base, conf.paths.prodTmp),
    // To resolve node_modules/... paths.
    path.relative(conf.paths.base, conf.paths.base),
  ];

  return gulp.src(path.join(conf.paths.prodTmp, '*.html'))
      .pipe(gulpUseref({searchPath: searchPath}))
      .pipe(gulpIf(
          '**/vendor.css',
          gulpMinifyCss({rebase: true, relativeTo: conf.paths.tmp, target: conf.paths.tmp})))
      .pipe(gulpIf('**/vendor.css', gulpUrlAdjuster({
                     // Replace invalid prefix that is added to resolved URLs.
                     replace: ['prod/static/', ''],
                   })))
      .pipe(gulpIf('**/vendor.css', gulpUrlAdjuster({
                     // Replace invalid prefix that is added to resolved URLs.
                     replace: ['prod/', ''],
                   })))
      .pipe(gulpIf('**/vendor.js', gulpUglify({
                     output: {
                       comments: uglifySaveLicense,
                     },
                     // preserveComments: uglifySaveLicense,
                     // Disable compression of unused vars. This speeds up minification a lot (like
                     // 10 times).
                     // See https://github.com/mishoo/UglifyJS2/issues/321
                     compress: {unused: false},
                   })))
      .pipe(gulpIf('*.html', gulpHtmlmin({
                     removeComments: true,
                     collapseWhitespace: true,
                     conservativeCollapse: true,
                   })))
      .pipe(multiDest(localizedOutputDirs));
}

/**
 * Creates revisions of all .js anc .css files at once (for production).
 * Replaces the occurances of those files in index.html with their new names.
 * index.html does not get renamed in the process.
 * The processed files are then moved to the dist directory.
 * @return {stream}
 */
function doRevision() {
  return gulp
      .src([path.join(conf.paths.distPre, '**'), '!**/assets/**/*'])
      // Do not update references other than in index.html. Do not rev index.html itself.
      .pipe(revAll.revision(
          {dontRenameFile: ['index.html'], dontSearchFile: [/^(?!.*index\.html$).*$/]}))
      .pipe(gulp.dest(conf.paths.distRoot));
}

/**
 * Copies the font files to all dist directories per arch and locale.
 * @param {!Array<string>} outputDirs
 * @return {stream}
 */
function dependencyImages(outputDirs) {
  let localizedOutputDirs = createLocalizedOutputs(outputDirs, 'static/img');
  return gulp
      .src(path.join(conf.paths.jsoneditorImages, '*.png'), {base: conf.paths.jsoneditorImages})
      .pipe(multiDest(localizedOutputDirs));
}

/**
 * Returns one subdirectory path for each supported locale inside all of the specified
 * outputDirs. Optionally, a subdirectory structure can be passed to append after each locale path.
 * @param {!Array<string>} outputDirs
 * @param {undefined|string} opt_subdir - an optional sub directory inside each locale directory.
 * @return {!Array<string>} localized output directories
 */
function createLocalizedOutputs(outputDirs, opt_subdir) {
  return outputDirs.reduce((localizedDirs, outputDir) => {
    return localizedDirs.concat(conf.translations.map((translation) => {
      if (opt_subdir) {
        return path.join(outputDir, translation.key, opt_subdir);
      }
      return path.join(outputDir, translation.key);
    }));
  }, []);
}
