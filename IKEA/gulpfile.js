var gulp        = require('gulp'),                      //Підключення плагинів
    scss        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer'),
    cssbeautify = require('gulp-cssbeautify');

// компіляція SCSS файлів із папки app/sass в CSS файли в папку app/css з додаванням вендорних префіксів і правильного оформлення  
gulp.task('scss', function() {
    return gulp.src('app/sass/*.scss')
        .pipe(scss())
        .pipe(autoprefixer(['last 5 versions', '> 1%','ie 8','ie 7'], { cuscade:true }))
        .pipe(cssbeautify({
            indent: '    ',
            autosemicolon: true
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

// Створення мініфіцированого файлу main.css
gulp.task('css-min',['scss'], function() {
    return gulp.src('app/css/main.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

// Онлайн релод в браузері
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

//Видалення папки dist якшо вона існує
gulp.task('clean', function() {
    return del.sync('dist');
});

//Очищення кешу картинок, треба визивати через термінал
gulp.task('clear', function() {
    return cache.clearAll();
});

// Оптимізація картинок
gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoplugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

//Онлайн релод
gulp.task('watch',['browser-sync','css-min'], function() {
    gulp.watch('app/sass/**/*.scss', ['css-min']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Створення готового проекут
gulp.task('build',['clean','img','css-min'], function() {
    var buildCss = gulp.src([
        'app/css/*.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src([
        'app/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts'));

    var buildHtml = gulp.src([
        'app/*.html'
    ])
    .pipe(gulp.dest('dist'));
})