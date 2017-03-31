var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

// Set components directory
var components_directory = '../components/';

// Basic components
var components = [
									'header',
									'initScreen',
									'initSlider',
									'selectTournament',
									'footer',
									'tutorial',
									'tournamentsList',
									'tournament'
									];

// Special components
// Final components = basic components + special components
var template_components = ['../components/svg/'];
var sass_components = [
												'../components/basic/styles/variables&helpers.scss',
												'../components/basic/styles/reset&basic.scss',
												'../components/basic/styles/typography.scss'
											];
var js_components = [
											'../components/vendors/detectVisibility.js',
											'../components/vendors/doScrolling.js',
											'../components/vendors/disableScroll.js'
										];

// Set paths for all components
// path = main components directory + component folder + component name + component type
// Example: path = ../../components + _header + header.scss
function setComponentsPaths(isTemplate, component, type) {
	if( isTemplate ) { // Templates need just directory
		for( i = 0; i < components.length; i++ ) {
			component.push(components_directory + '_' + components[i]);
		}
	} else { // Other components need directory and file name + extensions
		for( i = 0; i < components.length; i++ ) {
			component.push(components_directory + '_' + components[i] + '/' + components[i] + type);
		}
	}
}

// Set paths for components
setComponentsPaths(false, sass_components, '.scss');
setComponentsPaths(false, js_components, '.js');
setComponentsPaths(true, template_components);

///// Build templates /////
gulp.task('buildPage', function () {
	var templateData = {
	}, // Don't remove
	options = {
    ignorePartials: true,
    batch : template_components,
    helpers : {
      capitals : function(str){
        return str.toUpperCase();
      }
    }
	}

	return gulp.src('../index.handlebars') // Set root template file
    .pipe(handlebars(templateData, options))
    .pipe(rename('main_page.html'))
    .pipe(gulp.dest('../../build'));
});

///// Concat Sass /////
gulp.task('concatSass', function() {
  return gulp.src(sass_components)
    .pipe(concat('main_page.scss'))
    .pipe(gulp.dest('../../build/styles'));
});

///// Compile Sass /////
gulp.task('compileSass', ['concatSass'], function () {
  return gulp.src('../../build/styles/main_page.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../../build/styles'));
});

///// Concat JS /////
gulp.task('concatJs', function() {
  return gulp.src(js_components)
    .pipe(concat('main_page.js'))
    .pipe(gulp.dest('../../build/scripts'));
});

///// Watch /////
gulp.task('watch', function() {
	gulp.watch(sass_components, ['concatSass', 'compileSass']);
	gulp.watch(js_components, ['concatJs']);
	gulp.watch(['../components/**/*.handlebars', '../index.handlebars'], ['buildPage']);
});