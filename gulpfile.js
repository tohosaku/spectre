const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const cleancss = require("gulp-clean-css");
const csscomb = require("gulp-csscomb");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");

const paths = {
  source: "./src/*.scss",
  doc: "./docs/src/scss/*.scss",
};

const watchFunc = () =>
  parallel(
    () => watch("./**/*.scss", ["build"]),
    () => watch("./**/*.scss", ["docs"]),
    () => watch("./**/*.pug", ["docs"])
  );

const build = () =>
  src(paths.source)
    .pipe(
      sass({ outputStyle: "compact", precision: 10 }).on("error", sass.logError)
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

const docs = () =>
  src(paths.doc)
    .pipe(
      sass({ outputStyle: "compact", precision: 10 }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(dest("./docs/dist"))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("./docs/dist"));
src(paths.source)
  .pipe(
    sass({ outputStyle: "compact", precision: 10 }).on("error", sass.logError)
  )
  .pipe(autoprefixer())
  .pipe(csscomb())
  .pipe(dest("./docs/dist"))
  .pipe(cleancss())
  .pipe(
    rename({
      suffix: ".min",
    })
  )
  .pipe(dest("./docs/dist"));
src("docs/src/**/!(_)*.pug")
  .pipe(
    pug({
      pretty: true,
    })
  )
  .pipe(dest("./docs/"));

exports.watch = watchFunc;
exports.docs = docs;

exports.default = build;
