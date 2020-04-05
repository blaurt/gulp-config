const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const sync = require("browser-sync").create();
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");

function html() {
  return src("src/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/**.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("dist"));
}

function clear() {
  return del("dist");
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**.html", series(html)).on("change", sync.reload);
  watch("src/**.scss", series(html)).on("change", sync.reload);
}

module.exports.build = series(clear, scss, html);
module.exports.clear = clear;
module.exports.default = series(clear, scss, html, serve);
// https://www.npmjs.com/package/gulp-file-include