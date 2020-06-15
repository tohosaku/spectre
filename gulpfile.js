const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const cleancss = require("gulp-clean-css");
const csscomb = require("gulp-csscomb");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const Fibers = require('fibers');
sass.compiler = require('sass');
const options = { precision: 10, fiber: Fibers }

const paths = {
  source: "./src/*.scss",
  doc: "./docs/scss/*.scss",
};

const doc_dist = "./docs/html/dist"

const watchFunc = () =>
  parallel(
    () => watch("./**/*.scss", ["build"]),
    () => watch("./**/*.scss", ["docs"]),
    () => watch("./**/*.pug", ["docs"])
  );

const build = () =>
  src(paths.source)
    .pipe(
      sass(options).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(dest("./dist"))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("./dist"));

const docs_scss = (done) => {
  src(paths.doc)
    .pipe(
      sass(options).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(dest(doc_dist))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest(doc_dist));
  done();
}

const docs_scss_min = (done) => {
  src(paths.source)
    .pipe(
      sass(options).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(dest(doc_dist))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest(doc_dist));
  done();
}

const pugs = (done) => {
  src("docs/**/!(_)*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("./docs/html"));
  done();
}

exports.watch = watchFunc;
exports.docs = parallel(docs_scss, docs_scss_min, pugs);
exports.build = build;
exports.default = build;
