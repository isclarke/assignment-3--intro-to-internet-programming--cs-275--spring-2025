const gulp = require(`gulp`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);
const{ src, dest } = require(`gulp`);

// Paths
let paths = {
    js: `scripts/**/*.js`,
    css: `styles/**/*.css`,
    html: `index.html`,
    prod: `prod`
};

// Create directories
let createDirs = (done) => {
    let dirs = [`prod/scripts`, `prod/styles`, `prod/html`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Transpile JavaScript to ES5
let transpileJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(gulp.dest(`prod/scripts`))
        .pipe(browserSync.stream());
};

// Lint CSS
let lintCSS = () => {
    return src(paths.css)
        .pipe(stylelint({
            reporters: [{ formatter: `string`, console: true }]
        }));
};

// Watch files and reload browser
let watchFiles = () => {
    browserSync.init({
        server: { baseDir: `./` }
    });
    gulp.watch(paths.js, gulp.series( transpileJS));
    gulp.watch(paths.css, gulp.series(lintCSS, buildCSS)).on(`change`, browserSync.reload);
    gulp.watch(paths.html).on(`change`, browserSync.reload);
};

// Copy HTML to production and minify
let buildHTML = () => {
    return src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Minify and copy CSS to production
let buildCSS = () => {
    return src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/styles`));
};

// Minify and copy JavaScript to production
let buildJS = () => {
    return src(paths.js)
        .pipe(babel({ presets: [`@babel/env`] }))
        .pipe(uglify())
        .pipe(dest(`prod/scripts`));
};

// Development track
exports.default = gulp.series(gulp.parallel(lintCSS, transpileJS), watchFiles);

// Production track
exports.build = gulp.series(createDirs, gulp.parallel(buildHTML, buildCSS, buildJS));
