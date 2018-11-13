import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import postcss from "gulp-postcss";
import sass from "gulp-sass";
import postcssPresetEnv from "postcss-preset-env";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import nodeSass from "node-sass";

sass.compiler = nodeSass;

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task("server", ["hugo", "css", "js"], (cb) => runServer(cb));
gulp.task("server-preview", ["hugo-preview", "css", "js"], (cb) => runServer(cb, "hugo-preview"));

// Build/production tasks
gulp.task("build", ["css", "js"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["css", "js"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile CSS with PostCSS
gulp.task("css", () => (
  gulp.src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([postcssPresetEnv()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new pluginError("webpack", err);
    log(`[webpack] ${stats.toString({
      colors: true,
      progress: true
    })}`);
    browserSync.reload();
    cb();
  });
});

// Development server with browsersync
function runServer(cb, hugoTask = "hugo") {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/scss/**/*.scss", ["css"]);
  gulp.watch("./site/**/*", [hugoTask]);
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
