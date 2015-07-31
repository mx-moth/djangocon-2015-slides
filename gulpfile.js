var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');

var srcDir = './src';
var dstDir = './build';
var src = function(end) { return './' + path.join(srcDir, end); };
var dst = function(end) { return './' + path.join(dstDir, end); };

gulp.task('build', ['javascript', 'styles', 'images', 'html']);
gulp.task('default', ['watch', 'build']);

// Watch for changes, and rebuild the relevant files
gulp.task('watch', function() {
	gulp.watch(src('javascript/**'), ['javascript']);
	gulp.watch(src('styles/**'), ['styles']);
	gulp.watch(src('images/**'), ['images']);
	gulp.watch(src('**/*.jade'), ['html']);

	staticServer();
});

function staticServer() {

	var port = 7000;
	var express = require('express');
	var expressDirectory = require('express-directory');
	var app = express();
	app.use(express.query())
		.use(express.static(dst('')))
		.listen(port, function() {
			gutil.log('Listening on http://localhost:' + port + '/');
		});

	return app;
};


/*
 * Javascript tasks
 */
gulp.task('javascript', ['compile-js']);

gulp.task('compile-js', function() {
	var browserify = require('browserify');
	var source = require('vinyl-source-stream');

	return browserify(src('javascript/app.js'))
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(dst('js')));
});

/*
 * Style tasks
 */
gulp.task('styles', ['compile-sass']);

gulp.task('compile-sass', function() {
	var sass = require('gulp-sass');
	var sourcemaps = require('gulp-sourcemaps');
	var autoprefixer = require('gulp-autoprefixer');
	var minifyCSS = require('gulp-minify-css');

	return gulp.src(src('styles/app.scss'))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			errLogToConsole: true
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(dst('css')));

});

/*
 * Image tasks
 */
gulp.task('images', ['compress-images']);

gulp.task('compress-images', function() {
	var changed  = require('gulp-changed');
	var imagemin = require('gulp-imagemin');
	return gulp.src('./src/images/**')
		.pipe(changed(dst('img')))
		.pipe(imagemin())
		.pipe(gulp.dest(dst('img')));
});

/*
 * HTML tasks
 */
gulp.task('html', ['compile-jade']);
gulp.task('compile-jade', function() {
	var jade = require('gulp-jade');
	return gulp
		.src(src('index.jade'))
		.pipe(jade())
		.pipe(gulp.dest(dst('')));
});
