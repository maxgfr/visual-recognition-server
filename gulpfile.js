var gulp = require('gulp');
var bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower({ cmd: 'update'})
    .pipe(gulp.dest('vendor/'))
});

gulp.task('icons', function() {
    return gulp.src('./vendor/components-font-awesome/webfonts/**.*')
        .pipe(gulp.dest('./assets/fonts'));
});
