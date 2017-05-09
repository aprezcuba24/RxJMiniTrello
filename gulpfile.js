var gulp = require('gulp');
var tsc = require('gulp-typescript');
var tsProject = tsc.createProject('tsconfig.json');
var webpack = require('webpack-stream');

gulp.task('compile-all', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject())
        ;
 
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('browser', function() {
  return gulp.src('dist/app/index.js')
    .pipe(webpack(require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch(['server/**/*.ts', 'app/**/*.ts'], ['compile-all']);
    gulp.watch(['dist/app/index.js'], ['browser']);
});

gulp.task('default', ['watch', 'compile-all']);