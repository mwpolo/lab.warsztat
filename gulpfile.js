const gulp          = require("gulp");
const sass          = require("gulp-sass");
const sourcemaps    = require("gulp-sourcemaps");
const autoprefixer  = require("gulp-autoprefixer");
const colors        = require("ansi-colors");
const webpack       = require("webpack");

const showError = (err) => {
    console.log(colors.red("==============================="));
    console.log(colors.red(err.messageFormatted));
    console.log(colors.red("==============================="));
    this.emit("end");
}

const sassTask = () => {
    return gulp.src("src/scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed" //nested, expanded, compact, compressed
        }).on('error', showError))
        .pipe(autoprefixer({
            browsers: ["> 5%"]
        })) //autoprefixy https://github.com/browserslist/browserslist#queries
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css"));
};


const es6Task = (cb) => { //https://github.com/webpack/docs/wiki/usage-with-gulp#normal-compilation
    return webpack(require("./webpack.config.js"), function(err, stats) {
        if (err) throw err;
        console.log(stats.toString());
        cb();

    })
};


const watchTask = () => {
    gulp.watch("src/scss/**/*.scss", gulp.series(sassTask));
    gulp.watch("src/js/**/*.js", gulp.series(es6Task));
};


exports.default = gulp.parallel(sassTask, es6Task, sassTask, watchTask);