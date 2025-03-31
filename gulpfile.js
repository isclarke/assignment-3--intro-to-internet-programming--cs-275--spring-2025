const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    js: 'src/scripts/**/*.js',
    css: 'src/styles/**/*.css',
    html: 'src/**/*.html'
};

// Lint JavaScript
function lintJS() {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Transpile JavaScript to ES5
function transpileJS() {
    return gulp.src(paths.js)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
}

// Lint CSS
function lintCSS() {
    return gulp.src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: 'string', console: true }]
        }));
}

// Watch files and reload browser
function watchFiles() {
    browserSync.init({
        server: { baseDir: './' }
    });
    gulp.watch(paths.js, gulp.series(lintJS, transpileJS));
    gulp.watch(paths.css, lintCSS).on('change', browserSync.reload);
    gulp.watch(paths.html).on('change', browserSync.reload);
}

// Default task
exports.default = gulp.series(gulp.parallel(lintJS, lintCSS, transpileJS), watchFiles);
