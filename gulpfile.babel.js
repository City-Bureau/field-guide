import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import swPrecache from "sw-precache";
import webpackDevConfig from "./webpack.conf";
import webpackProdConfig from "./webpack.conf.prod";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];

/**
 * Run hugo and build the site
 */
function buildHugo(cb) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  return spawn(hugoBin, hugoArgsDefault, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}

function buildWebpack(cb) {
  const config = Object.assign({}, process.env.NODE_ENV === "production" ? webpackProdConfig : webpackDevConfig);

  webpack(config, (err, stats) => {
    if (err) throw new pluginError("webpack", err);
    log(`[webpack] ${stats.toString({colors: true, progress: true})}`);
    browserSync.reload();
    cb();
  });
}

function buildSW(cb) {
  const rootDir = "dist";

  swPrecache.write(`${rootDir}/service-worker.js`, {
    cacheId: "docs-field-guide",
    staticFileGlobs: [
      "dist/assets/app.*.{css,js}",
      "dist/**/*.html",
      "dist/icons/**.*",
      "dist/img/**.*",
    ],
    stripPrefix: "dist",
    dontCacheBustUrlsMatching: /\.*assets\.*/,
    runtimeCaching: [{
      default: "networkFirst",
    }],
    navigateFallback: "/offline",
  }, cb);
}

function browsersync(done) {
  browserSync.init({server: {baseDir: "./dist"}});
  done();
}

function watchFiles() {
  gulp.watch(["./src/js/**/*.js", "./src/scss/**/*.scss"], buildWebpack);
  gulp.watch("./site/**/*", buildHugo);
}

// Development tasks
gulp.task("hugo", buildHugo);
gulp.task("webpack", buildWebpack);
gulp.task("service-worker", buildSW);

// Build/production tasks
gulp.task("build", gulp.series("webpack", "hugo", "service-worker"));
gulp.task("build-preview", gulp.parallel("webpack"));

// Run server tasks
gulp.task("server", gulp.series(buildWebpack, buildHugo, gulp.parallel(watchFiles, browsersync)));
