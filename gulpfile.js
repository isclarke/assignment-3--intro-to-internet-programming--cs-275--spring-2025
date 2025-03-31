const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const htmlmin = require(`gulp-htmlmin`);
const del = require(`del`);
const fs = require(`fs`);

// Paths
const paths = {
    js: `src/js/**/*.js`,
    css: `src/css/**/*.css`,
    html: `src/**/*.html`,
    prod: `prod`
};

// Create required directories
function createDirs(done) {
    const dirs = [`prod/scripts`, `prod/styles`, `prod/html`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
}

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
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(gulp.dest(`prod/js`))
        .pipe(browserSync.stream());
}

// Lint CSS
function lintCSS() {
    return gulp.src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
}

// Watch files and reload browser
function watchFiles() {
    browserSync.init({
        server: { baseDir: `./` }
    });
    gulp.watch(paths.js, gulp.series(lintJS, transpileJS));
    gulp.watch(paths.css, lintCSS).on(`change`, browserSync.reload);
    gulp.watch(paths.html).on(`change`, browserSync.reload);
}

// Clean production folder
function cleanProd() {
    return del([`prod`]);
}

// Copy HTML to production and minify
function buildHTML() {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod/html`));
}

// Minify and copy CSS to production
function buildCSS() {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`));
}

// Minify and copy JavaScript to production
function buildJS() {
    return gulp.src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`));
}

// Development track
exports.default = gulp.series(gulp.parallel(lintJS, lintCSS, transpileJS), watchFiles);

// Production track
exports.build = gulp.series(cleanProd, createDirs, gulp.parallel(buildHTML, buildCSS, buildJS));
