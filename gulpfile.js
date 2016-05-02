var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var handlebars = require('gulp-hb');
var connect = require('gulp-connect');

var config = {
  srcDir: './src',
  destDir: './dest',
  miscDirs: ['audio']
};

gulp.task('css', function() {
  return gulp.src('src/css/webaudio.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.destDir + '/css'));
});

gulp.task('js', function() {
  return browserify('src/js/webaudio.js').bundle()
    .pipe(source('webaudio.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.destDir + '/js'));
});

gulp.task('html', function() {
  gulp.src('./src/*.hbs')
    .pipe(handlebars({partials: './src/templates/*.hbs'}))
    .pipe(rename(function(path) {
      path.extname = '.html';
      return path;
    }))
    .pipe(gulp.dest('./dest'));
});

config.miscDirs.forEach(function(taskName) {
  gulp.task(taskName, function() {
    gulp.src('./src/' + taskName + '/**/*')
      .pipe(gulp.dest('./dest/' + taskName));
  });
});

gulp.task('misc', config.miscDirs);

gulp.task('connect', function() {
  connect.server({
    root: 'dest',
    livereload: false
  });
});

gulp.task('watch', function() {
  gulp.watch('src/css/*.scss', ['css']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/**/*.hbs', ['html']);

  // for (var i=0; i < config.miscDirs.length; i++) {
  //   gulp.watch("src/" + config.miscDirs[i] + "/**/*", [config.miscDirs[i]]);
  // }
  config.miscDirs.forEach(function(taskName) {
    gulp.watch('src/' + taskName + '/**/*', [taskName]);
  });
});

gulp.task('default', ['css', 'js', 'html', 'misc', 'connect', 'watch']);
