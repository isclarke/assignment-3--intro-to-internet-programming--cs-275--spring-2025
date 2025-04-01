const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);

const { src, dest } = require(`gulp`);

let paths = {
    js: `scripts/**/*.js`,
    css: `styles/**/*.css`,
    html: `index.html`,
    prod: `prod`
};

// Create directories
let createDirs = (done) => {
    let dirs = [`prod/scripts`, `prod/styles`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Lint JavaScript without modifying files
let lintJS = () => {
    return src(paths.js)
        .pipe(eslint({ fix: false })) // Ensure no auto-fixing
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Transpile JavaScript for development
let transpileJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(dest(`scripts`)) // Keep in `scripts/`
        .pipe(browserSync.stream());
};

// Lint CSS
let lintCSS = () => {
    return src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

// Minify JavaScript for production
let buildJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(dest(`prod/scripts`));
};

// Minify CSS for production
let buildCSS = () => {
    return src(paths.css)
        .pipe(cleanCSS())
        .pipe(dest(`prod/styles`));
};

// Minify HTML for production
let buildHTML = () => {
    return src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(`prod`));
};

// Watch files and reload browser
let watchFiles = () => {
    browserSync.init({
        server: { baseDir: `./` }
    });
    gulp.watch(paths.js, gulp.series(lintJS, transpileJS));
    gulp.watch(paths.css, gulp.series(lintCSS, buildCSS)).on(`change`, browserSync.reload);
    gulp.watch(paths.html).on(`change`, browserSync.reload);
};

// Development track
exports.default = gulp.series(gulp.parallel(lintJS, lintCSS, transpileJS, buildCSS), watchFiles);

// Production track
exports.build = gulp.series(createDirs, gulp.parallel(buildHTML, buildCSS, buildJS));
