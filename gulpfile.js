const gulp = require(`gulp`);
const { src, dest, series, watch } = gulp;
const stylelint = require(`gulp-stylelint`);
const eslint = require(`gulp-eslint`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);

let paths = {
    js: `scripts/**/*.js`,
    css: `styles/**/*.css`,
    html: `index.html`,
    prod: `prod`,
    temp: `temp`
};

let createDirs = (done) => {
    [
        `prod/scripts`,
        `prod/styles`,
        `prod/html`,
        `temp/scripts`,
        `temp/styles`
    ].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// DEV TASKS
let validateHTML = () => {
    return src(paths.html)
        .pipe(dest(`temp`));
};

let compileCSSForDev = () => {
    return src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }))
        .pipe(dest(`temp/styles`));
};

let lintJS = () => {
    return src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format());
};

let transpileJSForDev = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(dest(`temp/scripts`));
};

let serve = () => {
    browserSync.init({ server: { baseDir: `temp` } });
    watch(paths.js, series(lintJS, transpileJSForDev)).on(`change`, browserSync.reload);
    watch(paths.css, series(compileCSSForDev)).on(`change`, browserSync.reload);
    watch(paths.html, series(validateHTML)).on(`change`, browserSync.reload);
};

// PROD TASKS
let compressHTML = () => {
    return src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(`prod/html`));
};

let compileCSSForProd = () => {
    return src(paths.css)
        .pipe(cleanCSS())
        .pipe(dest(`prod/styles`));
};

let transpileJSForProd = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(dest(`prod/scripts`));
};

// TASK EXPORTS
exports.serve = series(
    createDirs,
    validateHTML,
    compileCSSForDev,
    lintJS,
    transpileJSForDev,
    serve
);

exports.build = series(
    createDirs,
    compressHTML,
    compileCSSForProd,
    transpileJSForProd,
);

exports.default = exports.serve;
