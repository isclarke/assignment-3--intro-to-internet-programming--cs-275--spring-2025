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

let lintJS = () => {
    return src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Transpile JavaScript to ES5
let transpileJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(dest(`scripts`)) // Save in place for dev
        .pipe(browserSync.stream());
};

let lintCSS = () => {
    return src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

let buildJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(dest(`prod/scripts`));
};

let buildCSS = () => {
    return src(paths.css)
        .pipe(cleanCSS())
        .pipe(dest(`prod/styles`));
};

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
