const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);

// Paths
let paths = {
    js: `src/js/**/*.js`,
    css: `src/css/**/*.css`,
    html: `src/**/*.html`,
    prod: `prod`
};

// Create required directories
let createDirs = (done) => {
    let dirs = [`prod/scripts`, `prod/styles`, `prod/html`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Lint JavaScript
let lintJS = () => {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Transpile JavaScript to ES5
let transpileJS = () => {
    return gulp.src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(gulp.dest(`prod/scripts`))
        .pipe(browserSync.stream());
};

// Lint CSS
let lintCSS = () => {
    return gulp.src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

// Watch files and reload browser
let watchFiles = () => {
    browserSync.init({
        server: { baseDir: `./` }
    });
    gulp.watch(paths.js, gulp.series(lintJS, transpileJS));
    gulp.watch(paths.css, lintCSS).on(`change`, browserSync.reload);
    gulp.watch(paths.html).on(`change`, browserSync.reload);
};

// Copy HTML to production and minify
let buildHTML = () => {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Minify and copy CSS to production
let buildCSS = () => {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/styles`));
};

// Minify and copy JavaScript to production
let buildJS = () => {
    return gulp.src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/scripts`));
};

// Development track
exports.default = gulp.series(gulp.parallel(lintJS, lintCSS, transpileJS), watchFiles);

// Production track
exports.build = gulp.series(createDirs, gulp.parallel(buildHTML, buildCSS, buildJS));
