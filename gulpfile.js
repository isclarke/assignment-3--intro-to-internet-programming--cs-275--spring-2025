const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const htmlmin = require(`gulp-htmlmin`);

// Paths
const paths = {
    js: `src/js/**/*.js`,
    css: `src/css/**/*.css`,
    html: `src/**/*.html`,
    dist: `dist`,
    prod: `prod`
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
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(gulp.dest(paths.dist + `/js`))
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



// Copy HTML to production and minify
function buildHTML() {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.prod));
}

// Minify and copy CSS to production
function buildCSS() {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.prod + `/css`));
}

// Minify and copy JavaScript to production
function buildJS() {
    return gulp.src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.prod + `/js`));
}

// Copy assets if any
function copyAssets() {
    return gulp.src(`src/assets/**/*`)
        .pipe(gulp.dest(paths.prod + `/assets`));
}

// Development track
exports.default = gulp.series(gulp.parallel(lintJS, lintCSS, transpileJS), watchFiles);

// Production track
exports.build = gulp.series(gulp.parallel(buildHTML, buildCSS, buildJS, copyAssets));
