// Special thanks to oscar-g (https://github.com/oscar-g) for starting this at https://github.com/oscar-g/patternlab-node/tree/dev-gulp

var pkg = require('./package.json'),
	gulp = require('gulp'),
	eol = require('os').EOL,
	del = require('del'),
	strip_banner = require('gulp-strip-banner'),
	header = require('gulp-header'),
	nodeunit = require('gulp-nodeunit'),
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	order = require('gulp-order'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	plumber = require('gulp-plumber');

var svgHasRun = true; // disabling SVG task.  change to false to re-enable onetime running.

require('gulp-load')(gulp);
var banner = [ '/** ',
	' * <%= pkg.name %> - v<%= pkg.version %> - <%= today %>',
	' * ',
	' * <%= pkg.author %>, and the web community.',
	' * Licensed under the <%= pkg.license %> license.',
	' * ',
	' * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice.',
	' * ', ' **/'].join(eol);

var aemBanner = ['/**',
	' * <%= pkg.aemName %> - <%= pkg.aemDesc %>',
	' * @version v<%= pkg.aemVersion %>',
	' */',
	'',
	'',
	''].join(eol);

//load patternlab-node tasks
gulp.loadTasks(__dirname+'/builder/patternlab_gulp.js');

//clean patterns dir
gulp.task('clean', function(cb){
	// del.sync(['./public/patterns/*'], {force: true});
	del.sync(['./public/*'], {force: true});
	cb();
});

//clean AEM output dir
gulp.task('aem:clean', function() {
	del.sync(['./aem/*'], {force: true});
});

//build the banner
gulp.task('banner', function(){
	return gulp.src([
		'./builder/patternlab.js',
		'./builder/object_factory.js',
		'./builder/lineage_hunter.js',
		'./builder/media_hunter.js',
		'./builder/patternlab_grunt.js',
		'./builder/patternlab_gulp.js',
		'./builder/parameter_hunter.js',
		'./builder/pattern_exporter.js',
		'./builder/pattern_assembler.js',
		'./builder/pseudopattern_hunter.js',
		'./builder/list_item_hunter.js',
		'./builder/style_modifier_hunter.js'
	])
		.pipe(strip_banner())
		.pipe(header( banner, {
			pkg : pkg,
			today : new Date().getFullYear() }
		))
		.pipe(gulp.dest('./builder'));
});

//copy tasks

//Patternlab JS
gulp.task('pl:js', function(){
	// opted for itemized array of includes for ganular control
	var sourceFiles = [
			'./source/_patternlab-files/js/**/*.js'
		];

	return gulp.src(sourceFiles)
		.pipe(gulp.dest('./public/styleguide/js'))
		.pipe(browserSync.stream());
});

//Patternlab Fonts
gulp.task('pl:fonts', function(){
	// opted for itemized array of includes for ganular control
	var sourceFiles = [
			'./source/_patternlab-files/fonts/*'
		];

	return gulp.src(sourceFiles)
		.pipe(gulp.dest('./public/styleguide/fonts'))
		.pipe(browserSync.stream());
});


//Foundation JS Source Files
var foundationSources = [
	 './node_modules/foundation-sites/js/foundation.core.js'
	, './node_modules/foundation-sites/js/foundation.abide.js'
	, './node_modules/foundation-sites/js/foundation.accordion.js'
	// , './node_modules/foundation-sites/js/foundation.accordionMenu.js'
	// , './node_modules/foundation-sites/js/foundation.drilldown.js'
	, './node_modules/foundation-sites/js/foundation.dropdown.js'
	, './node_modules/foundation-sites/js/foundation.dropdownMenu.js'
	, './node_modules/foundation-sites/js/foundation.equalizer.js'
	, './node_modules/foundation-sites/js/foundation.interchange.js'
	, './node_modules/foundation-sites/js/foundation.magellan.js'
	// , './node_modules/foundation-sites/js/foundation.offcanvas.js'
	// , './node_modules/foundation-sites/js/foundation.orbit.js'
	// , './node_modules/foundation-sites/js/foundation.responsiveMenu.js'
	// , './node_modules/foundation-sites/js/foundation.responsiveToggle.js'
	, './node_modules/foundation-sites/js/foundation.reveal.js'
	// , './node_modules/foundation-sites/js/foundation.slider.js'
	, './node_modules/foundation-sites/js/foundation.sticky.js'
	, './node_modules/foundation-sites/js/foundation.tabs.js'
	, './node_modules/foundation-sites/js/foundation.toggler.js'
	, './node_modules/foundation-sites/js/foundation.tooltip.js'
	, './node_modules/foundation-sites/js/foundation.util.box.js'
	, './node_modules/foundation-sites/js/foundation.util.keyboard.js'
	, './node_modules/foundation-sites/js/foundation.util.mediaQuery.js'
	, './node_modules/foundation-sites/js/foundation.util.motion.js'
	, './node_modules/foundation-sites/js/foundation.util.nest.js'
	, './node_modules/foundation-sites/js/foundation.util.timerAndImageLoader.js'
	, './node_modules/foundation-sites/js/foundation.util.touch.js'
	, './node_modules/foundation-sites/js/foundation.util.triggers.js'
];

//Foundation JS
gulp.task('cp:foundationJS', function(){
	return gulp.src(foundationSources)
		.pipe(concat('foundation_custom.js'))
		.pipe(gulp.dest('./public/js/'))
		.pipe(browserSync.stream());
});

//Foundation JS Output for AEM
gulp.task('aem:foundationJS', function() {
	return gulp.src(foundationSources)
		.pipe(concat('foundation-custom.js'))
		.pipe(gulp.dest('./aem/footerlibs/js/vendor'));
});

//Vendor JS - MISC
gulp.task('cp:vendorJS', function(){
	var includeOrder = [
				'modernizr.js'
			, 'jquery*.js'
			, 'flickity.pkgd.js'
			, '**/*.js'
			];

	return gulp.src(['**/*.js'], {cwd:'./source/js/vendor'})
		.pipe(order(includeOrder))
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.stream());
});

// Vendor JS Misc Outpur for AEM
gulp.task('aem:vendorJS', function() {
	var includeOrder = [
			  'jquery.debounce.js'
			, 'jquery.easing.1.3.js'
			, 'flickity.pkgd.js'
			, '**/*.js'
		];

	return gulp.src(['**/*.js', '!modernizr.js', '!jquery-1.11.2.min.js'], {cwd:'./source/js/vendor'})
		.pipe(order(includeOrder))
		.pipe(concat('vendor-misc.js'))
		.pipe(gulp.dest('./aem/footerlibs/js/vendor'));
});

// Modernizr Outpur for AEM
gulp.task('aem:modernizr', function() {
	return gulp.src(['modernizr.js'], {cwd: './source/js/vendor'})
		.pipe(gulp.dest('./aem/headlibs/js/vendor'));
});

//APP JS 
gulp.task('cp:appJS', function(){
	var includeOrder = [
				'**/*.js'
			, 'init.js'  
			];

	return gulp.src(['**/*.js'], {cwd:'./source/js/app'})
		.pipe(order(includeOrder))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.stream());
});

//APP JS AEM
gulp.task('aem:appJS', function() {
	var includeOrder = [
			  '**/*.js'
			, 'init.js'  
		];

	return gulp.src(['**/*.js'], {cwd:'./source/js/app'})
		.pipe(order(includeOrder))
		.pipe(concat('pl.js'))
		.pipe(header(aemBanner, { pkg : pkg } ))
		.pipe(gulp.dest('./aem/footerlibs/js'));
});

//Generic JS
gulp.task('cp:js', ['cp:foundationJS', 'cp:vendorJS', 'cp:appJS'], function(){
	// return gulp.src(['**/*.js'], {cwd:'./source/js'})
	//   .pipe(gulp.dest('./public/js'))
});

//Generic JS AEM
gulp.task('aem:js', ['aem:modernizr', 'aem:foundationJS', 'aem:vendorJS', 'aem:appJS']);

gulp.task('cp:img', function(){
	return gulp.src(
		[ '**/*.gif', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '!flags/*' ],
		{cwd:'./source/images'} )
		.pipe(gulp.dest('./public/images'));

});

// Image Output for AEM
gulp.task('aem:img', function() {
	return gulp.src([
			'**/*.gif', 
			'**/*.png', 
			'**/*.jpg', 
			'**/*.jpeg', 
			'**/*.svg', 
			'!flags/*', 
			'!flags.svg', 
			'!hero/*', 
			'!sample/*'
		], {cwd:'./source/images'})
		.pipe(gulp.dest('./aem/headlibs/images'));
});

gulp.task('pl:img', function(){
	return gulp.src(
		[ '**/*.gif', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'  ],
		{cwd:'./source/_patternlab-files/images'} )
		.pipe(gulp.dest('./public/styleguide/images'));

});

gulp.task('cp:font', function(){
	return gulp.src('*', {cwd:'./source/fonts'})
		.pipe(gulp.dest('./public/fonts'));
});

// Font Output for AEM
gulp.task('aem:font', function(){
	return gulp.src('*', {cwd:'./source/fonts'})
		.pipe(gulp.dest('./aem/headlibs/fonts'));
});

gulp.task('cp:data', function(){
	return gulp.src('annotations.js', {cwd:'./source/_data'})
		.pipe(gulp.dest('./public/data'));
});

gulp.task('cp:css', function(){
	return gulp.src('./source/css/style.css')
		.pipe(gulp.dest('./public/css'))
		.pipe(browserSync.stream());
});

//server and watch tasks
gulp.task('connect', ['lab'], function(){
	browserSync.init({
		server: {
			baseDir: './public/'
		},
		notify: false,
		online: false
	});
	gulp.watch('./source/css/style.css', ['cp:css']);

	//suggested watches if you use scss
	gulp.watch('./source/css/**/*.scss', ['sass:style']);
	gulp.watch('./source/_patternlab-files/scss/**/*.scss', ['sass:patternlab']);

	gulp.watch([
		'./source/_patterns/**/*.mustache',
		'./source/_patterns/**/*.json',
		'./source/_data/**/*.js',
		'./config.json',
		'./source/_data/*.json' ],
		 ['lab-pipe'], function(){
			 // browserSync.reload();
			 // removed reload as is this also handled by [lab-pipe]
		 });

	gulp.watch(['./source/js/**/*.js'], ['cp:js'], function(){
		browserSync.reload();
	});
	gulp.watch([
			'./source/images/**/*.gif', 
			'./source/images/**/*.png', 
			'./source/images/**/*.jpg', 
			'./source/images/**/*.jpeg', 
			'./source/images/**/*.svg'
		], ['cp:img'], function(){
		browserSync.reload();
	});
	gulp.watch([
			'./source/_patternlab-files/images/**/*.gif', 
			'./source/_patternlab-files/images/**/*.png', 
			'./source/_patternlab-files/images/**/*.jpg', 
			'./source/_patternlab-files/images/**/*.jpeg', 
			'./source/_patternlab-files/images/**/*.svg'
		], ['pl:img'], function(){
		browserSync.reload();
	});
});

//unit test
gulp.task('nodeunit', function(){
	return gulp.src('./test/**/*_tests.js')
		.pipe(nodeunit());
});

// sass tasks, turn on if you want to use
gulp.task('sass:style', ['svg'], function(){
	return gulp.src('./source/css/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['./source/scss/*.scss', './node_modules/foundation-sites/scss'],
			outputStyle: 'expanded',
			precision: 8
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions']})]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Style Output for AEM
gulp.task('aem:styles', function() {
	return gulp.src('./source/css/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['./source/scss/*.scss', './node_modules/foundation-sites/scss'],
			outputStyle: 'expanded',
			precision: 8
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions']})]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./aem/headlibs/css'));
});

gulp.task('sass:patternlab', function(){
	return gulp.src('./source/_patternlab-files/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			precision: 8
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions']})]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/styleguide/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('lab-pipe', ['lab'], function(cb){
	cb();
	browserSync.reload();
});

gulp.task('default', ['lab']);

gulp.task('assets', ['cp:js', 'cp:img', 'cp:font', 'cp:data', 'sass:style', 'sass:patternlab', 'pl:img', 'pl:js', 'pl:fonts']);
gulp.task('prelab', ['clean', 'banner', 'assets']);
gulp.task('lab', ['prelab', 'patternlab'], function(cb){cb();});
gulp.task('patterns', ['patternlab:only_patterns']);
gulp.task('serve', ['lab', 'connect']);
gulp.task('aem', ['aem:clean', 'aem:assets']);
gulp.task('aem:assets', ['aem:js', 'aem:img', 'aem:font', 'aem:styles']);
gulp.task('travis', ['lab', 'nodeunit']);

gulp.task('version', ['patternlab:version']);
gulp.task('help', ['patternlab:help']);

gulp.task('svg', [], function(){
	var svgSprite = require('gulp-svg-sprite');

	var config = {
			mode: {
				sprite: {         
					mode: 'view',
					sprite: '../../../../images/flags.svg',
					bust: false,
					render: {
							scss: true      // Activate Sass output (with default options)
					}
				}
			},
			shape: {
				dimension: {
					maxWidth: 20,
					maxHeight: 14
				},
				spacing: {
					padding: 1,
					box: 'icon'
				}
			}
	};

	if (!svgHasRun) {
		svgHasRun = true;
		console.log('Building SVG Sprites...');
		return gulp.src('./source/images/flags/*.svg')
					.pipe(svgSprite(config))
					.pipe(gulp.dest('./source/css/scss/objects'));
	}
	else {
		console.log('Skipping Build of SVG Sprits for performance reasons. Restart build or run \'gulp svg\'');
	}
});
