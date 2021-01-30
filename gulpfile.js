const { src, dest, series, parallel, watch } = require("gulp"),
  browserSync = require("browser-sync").create(),
  del = require("del"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  concat = require("gulp-concat"),
  fileInclude = require("gulp-file-include"),
  media = require("gulp-group-css-media-queries"),
  imagemin = require("gulp-imagemin"),
  empLineDel = require("gulp-remove-empty-lines"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  minJs = require("gulp-uglify-es").default;

//declaration object "Path" where key: is name; value: is pathway in project
const path = {
  src: {
    html: "./src/html/basic.html",
    scss: "./src/styles/**/*.scss",
    js: "./src/scripts/**/*.js",
    img: "./src/img/**/*.{png,jpg,svg,webp}",
  },
  build: {
    mainFolder: "./dist",
    img: "./dist/img/",
  },
};

//including all files w/ extention "HTML" in one file, renaming etc. it and adding to distribution folder
async function html() {
  return src(path.src.html)
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(empLineDel())
    .pipe(rename("index.html"))
    .pipe(dest("./"))
    .pipe(browserSync.stream());
}

//including all files w/ extention "SCSS" in one file, renaming, adding prefixers, media queris,
//deleted white spaces & minimized it and adding to distribution folder

async function css() {
  return src(path.src.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 version"],
        cascade: false,
      })
    )
    .pipe(empLineDel())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename("style.min.css"))
    .pipe(dest(path.build.mainFolder))
    .pipe(browserSync.stream());
}

//including all files w/ extention "JS" in one file, renaming, minimized it and adding to distribution folder
async function js() {
  return src(path.src.js)
    .pipe(concat("script.min.js"))
    .pipe(minJs())
    .pipe(dest(path.build.mainFolder))
    .pipe(browserSync.stream());
}

//adding images with optimization to main distribution folder
async function images() {
  return src(path.src.img)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

//delete previous, before creating "dist" folder,
async function clearify() {
  return del(path.build.mainFolder);
}

//reloading browser when files are addition
async function livereloade() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    notify: false,
    port: 3000,
  });

  watch(
    ["./src/html/**/*.html", path.src.scss, path.src.js],
    parallel(html, css, js)
  );
  watch("./index.html").on("change", browserSync.reload);
}

//exporting functions(tasks) and named it how we wont (you can also rename it how you whant)
//this task is used in .json file

exports.dev = livereloade;
exports.build = series(clearify, parallel(html, css, js, images));