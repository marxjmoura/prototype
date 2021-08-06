var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var rename = require("gulp-rename");
var sass = require('gulp-sass')(require('node-sass'));
var sourcemaps = require('./sourcemaps');
var uglify = require('gulp-uglify');
var handlebars = require('./handlebars');
var connect = require('gulp-connect');
var htmlmin = require('gulp-htmlmin');

function printError(error) {
  console.log(error);
}

gulp.task('scss', function () {
  var paths = [
    'assets/scss/app.scss'
  ];

  return gulp.src(paths)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', printError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }))
    .pipe(rename({ basename: 'app', extname: '.min.css' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js-vendor', function () {
  var paths = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js',
    'node_modules/numeral/min/numeral.min.js',
    'node_modules/autonumeric/dist/autoNumeric.min.js',
    'node_modules/cleave.js/dist/cleave.min.js'
  ];

  return gulp.src(paths, { base: 'assets/js' })
    .pipe(sourcemaps().on('error', printError))
    .pipe(concat('vendor.js'))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('js-bundle', function () {
    var paths = [
      'assets/js/**/*.js'
    ];

    return gulp.src(paths, { base: 'assets/js' })
      .pipe(uglify().on('error', printError))
      .pipe(concat('app.js'))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist/js'));
  });

gulp.task('js-pages', function () {
  var paths = [
    'app/**/*.js'
  ];

  return gulp.src(paths)
    .pipe(uglify().on('error', printError))
    .pipe(rename({ dirname: '', extname: '.app.min.js' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
  var paths = [
    'node_modules/@fortawesome/fontawesome-free/webfonts/*.{eot,svg,ttf,woff,woff2}',
    'assets/webfonts/*.{eot,svg,ttf,woff,woff2}'
  ];

  return gulp.src(paths)
    .pipe(gulp.dest('dist/webfonts'));
});

gulp.task('img', function () {
  var paths = [
    'assets/**/*.{svg,jpg,png,ico}'
  ];

  return gulp.src(paths, { base: 'assets' })
    .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  return gulp.src(['app/**/_*.hbs', 'app/**/*.hbs'], { base: 'app' })
    .pipe(handlebars())
    .pipe(rename({ extname: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true })
      .on('error', (e) => console.log(e)))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.parallel('scss', 'js-vendor', 'js-bundle', 'js-pages', 'fonts', 'img', 'html'));

gulp.task('watch', function (done) {
  gulp.watch('assets/webfonts/**/*.{eot,svg,ttf,woff,woff2}', gulp.series('fonts'));
  gulp.watch('assets/**/*.{svg,jpg,png,ico}', gulp.series('img'));
  gulp.watch('assets/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('assets/js/**/*.js', gulp.series('js-bundle'));
  gulp.watch('app/**/*.js', gulp.series('js-pages'));
  gulp.watch('app/**/*.hbs', gulp.series('html'))

  done();
});

gulp.task('serve', done => {
  connect.server({ root: 'dist', port: 8888, fallback: 'dist/404.html' })
  connect.serverClose()

  done()
})

gulp.task('start', gulp.series('serve', 'watch', 'build'))
