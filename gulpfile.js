let buildPath = "dist";
let buildPathAs = "dist/assets";

let srcPath = "_src";
let srcPathAs = "_src/assets";


const path = {
   build: {
      html: buildPath + "/",
      css: buildPathAs + "/style/",
      js: buildPathAs + "/js/",
      img: buildPathAs + "/img/",
      fonts: buildPathAs + "/fonts/",
   },
   src: {
      html: srcPath + "/index.html",
      css: srcPathAs + "/style/style.scss",
      js: srcPathAs + "/js/app.js",
      img: srcPathAs + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
      fonts: srcPathAs + "/fonts/*.+(ttf|otf|woff|woff2)",
   },
   watch: {
      html: srcPath + "/**/*.html",
      css: srcPathAs + "/style/**/*.scss",
      js: srcPathAs + "/js/**/*.js",
      img: srcPathAs + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
      fonts: srcPathAs + "/fonts/*.+(ttf|otf|woff|woff2)",
   },
   clean: "./" + buildPath + "/"
}

const { src, dest } = require('gulp'),
   gulp = require('gulp'),
   browsersync = require('browser-sync').create(),
   fileinclude = require('gulp-file-include'),
   gcmq = require('gulp-group-css-media-queries'),
   rename = require("gulp-rename"),
   cleancss = require('gulp-clean-css'),
   autoprefixer = require('gulp-autoprefixer'),
   scss = require('gulp-sass'),
   imagemin = require("gulp-imagemin"),
   uglify = require("gulp-uglify"),
   webp = require("gulp-webp"),
   webphtml = require("gulp-webp-html"),
   webpcss = require("gulp-webpcss"),
   svgSprite = require("gulp-svg-sprite"),
   ttf2woff = require("gulp-ttf2woff"),
   ttf2woff2 = require("gulp-ttf2woff2"),
   fonter = require("gulp-fonter"),
   del = require('del');

// !! npm i --seve-dev browser-sync gulp-file-include gulp-group-css-media-queries gulp-rename gulp-clean-css gulp-autoprefixer gulp-sass gulp-imagemin gulp-uglify gulp-webp gulp-webp-html gulp-webpcss gulp-svg-sprite gulp-ttf2woff gulp-ttf2woff2 gulp-fonter del
// !! для работы с npm install webp-converter@2.2.3 --save-dev

//  cssbeautify = require("gulp-cssbeautify"),
//  removeComments = require('gulp-strip-css-comments'),
//  cssnano = require("gulp-cssnano"),
//  plumber = require("gulp-plumber"),
//  panini = require("panini"),
//  notify = require("gulp-notify"),
//  webpack = require('webpack'),
//  webpackStream = require('webpack-stream'),

function browserSync(params) {
   browsersync.init({
      server: {
         baseDir: "./" + buildPath + "/",
      },
      port: 3000,
      // notify: false

   })
}

function html() {
   return src(path.src.html)
      .pipe(fileinclude())
      // .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function css() {
   return src(path.src.css)
      .pipe(
         scss({
            outputStyle: "expanded"
         })
      )
      .pipe(
         gcmq()
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 5 version"],
            cascade: true
         }))
      .pipe(webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))
      .pipe(dest(path.build.css))
      .pipe(
         rename({
            suffix: ".min",
            extname: ".css"
         }))
      .pipe(cleancss())
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}
function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(
         rename({
            basename: "script"
         }))
      // .pipe(uglify())
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function img() {
   src([srcPathAs + '/img/' + 'icons/*.svg'])
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: "../icons/icon.svg",
               example: true
            }
         },
      }))
      .pipe(dest(path.build.img))
   return src(path.src.img)
      .pipe(
         webp({
            quality: 75 // 0-100
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 4, // 0-7
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}

function fonts() {
   src(path.src.fonts)
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts));
   return src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts))
      .pipe(browsersync.stream());
}

// ?? само выполняется в imagemin ... как, а хз 
// gulp.task('svgSprite', function () {
//    return src([srcPathAs + '/img/' + 'icons/*.svg'])
//       .pipe(svgSprite({
//          mode: {
//             stack: {
//                sprite: "../icons/icon.svg",
//                example: false
//             }
//          },
//       }))
//       .pipe(dest(path.build.img))
// })

// ?? запилино в fonts
// gulp.task('otf2ttf', function () {
//    return src([srcPathAs + '/fonts/*.otf'])
//       .pipe(fonter({
//          subset: [66, 67, 68, 69, 70, 71],
//          formats: ['ttf']
//       }))
//       .pipe(dest(srcPathAs + '/fonts/'));
// })

// function fontsStyle(params) {
//    let file_content = fs.readFileSync(srcPathAs + '/' + 'style/fonts/fonts.scss');
//    if (file_content == '') {
//       fs.writeFile(srcPathAs + '/' + 'style/fonts/fonts.scss', '', cb);
//       return fs.readdir(path.build.fonts, function (err, items) {
//          if (items) {
//             let c_fontname;
//             for (var i = 0; i < items.length; i++) {
//                let fontname = items[i].split('.');
//                fontname = fontname[0];
//                if (c_fontname != fontname) {
//                   fs.appendFile(srcPathAs + '/' + 'style/fonts/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "normal", "normal", "swap");\r\n', cb);
//                }
//                c_fontname = fontname;
//             }
//          }
//       })
//    }
// }


let fs = require('fs');
function fontsStyle(params) {
   let file_content = fs.readFileSync(srcPathAs + '/' + 'style/fonts/fonts.scss');
   if (file_content == '') {
      fs.writeFile(srcPathAs + '/' + 'style/fonts/fonts.scss', '', cb);
      return fs.readdir(path.build.fonts, function (err, items) {
         if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
               let fontname = items[i].split('.');
               fontname = fontname[0];
               if (c_fontname != fontname) {
                  fs.appendFile(srcPathAs + '/' + 'style/fonts/fonts.scss',
                     `@font-face {
                           font-family:${fontname};
                           src: url("../fonts/${fontname}.woff") format("woff"), 
                              url("../fonts/${fontname}.woff2") format("woff2");
                           font-weight: "normal";
                           font-style: "normal";
                           font-display: "swap";
                        }
                        `, cb);
               }
               c_fontname = fontname;
            }
         }
      })
   }
}
function cb() {
}

function watchFile(params) {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], img);
   gulp.watch([path.watch.fonts], fonts);
}

function clean(params) {
   return del(path.clean);
}
let build = gulp.series(clean, gulp.parallel(html, css, img, js, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFile, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;