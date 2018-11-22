import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackDevConfig from "./webpack.conf";
import webpackProdConfig from "./webpack.conf.prod";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task("server", ["hugo", "webpack"], (cb) => runServer(cb));
gulp.task("server-preview", ["hugo-preview", "webpack"], (cb) => runServer(cb, "hugo-preview"));

gulp.task("webpack", ["webpack"], (cb) => runServer(cb));

// Build/production tasks
gulp.task("build", ["webpack"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["webpack"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile Javascript, CSS
gulp.task("webpack", (cb) => {
  const config = Object.assign({}, process.env.NODE_ENV === "production" ? webpackProdConfig : webpackDevConfig);

  webpack(config, (err, stats) => {
    if (err) throw new pluginError("webpack", err);
    log(`[webpack] ${stats.toString({colors: true, progress: true})}`);
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
  gulp.watch("./src/js/**/*.js", ["webpack"]);
  gulp.watch("./src/scss/**/*.scss", ["webpack"]);
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
