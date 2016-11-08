/**
 * Created by lvche on 2016/11/08.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
gulp.task('default', function() {
    return gulp.src('./src/*.js')
        .pipe(concat('date-picker.js'))
        .pipe(gulp.dest('./dist/'))
});