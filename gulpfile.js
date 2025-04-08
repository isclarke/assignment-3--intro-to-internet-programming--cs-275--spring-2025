const gulp = require(`gulp`);
const { src, dest, series, parallel, watch } = gulp;
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

let lintAndTranspileJS = () => {
    return src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(dest(`temp/scripts`));
};

let lintCSS = () => {
    return src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }))
        .pipe(dest(`temp/styles`));
};


let transpileJSForProd = () => {
    return src(paths.js)
        .pipe(babel({presets: [`@babel/preset-env`]}))
        .pipe(uglify())
        .pipe(dest(`prod/scripts`))
        .pipe(browserSync.stream());
};


let buildHTML = () => {
    return src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(`temp`))
        .pipe(dest(`prod/html`));
};

let buildCSS = () => {
    return src(paths.css)
        .pipe(cleanCSS())
        .pipe(dest(`prod/styles`));
};

let watchFiles = () => {
    browserSync.init({ server: { baseDir: `temp` } });
    watch(paths.js, lintAndTranspileJS);
    watch(paths.css, series(lintCSS, buildCSS)).on(`change`, browserSync.reload);
    watch(paths.html, series(buildHTML)).on(`change`, browserSync.reload);
};

exports.default = series(
    createDirs,
    parallel(lintAndTranspileJS, lintCSS, buildHTML),
    watchFiles
);

exports.build = series(
    createDirs,
    parallel(buildHTML, buildCSS, transpileJSForProd)
);
