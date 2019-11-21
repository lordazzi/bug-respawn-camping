const gulp = require('gulp');
const tar = require('gulp-tar');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const tsLibraryBuild = ts.createProject('./tsconfig.json');
const jsLibraryBuild = ts.createProject('./tsconfig.tojs.json');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
let version = '';
let projectName = '';

//  COLLECT PACKAGE DATA
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json'));
    version = packageJson.version;
    projectName = packageJson.name;
} catch (e) {
    console.error('não foi possível ler a versão contida no package.json');
    throw e;
}

// TRANSPILE AS TYPESCRIPT LIBRARY
gulp.task('transpile-typescript-lib', () => tsLibraryBuild.src()
    .pipe(sourcemaps.init())
    .pipe(tsLibraryBuild())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
);

// TRANSPILE AS JAVASCRIPT LIBRARY
gulp.task('transpile-javascript-lib', () => jsLibraryBuild.src()
    .pipe(jsLibraryBuild())
);

gulp.task('javascript-concat', ['transpile-javascript-lib'], () => gulp.src(['./js-build-head.js', 'build/**'])
    .pipe(concat(`js/${projectName}.${version}.min.js`))
    .pipe(concat(`js/${projectName}.min.js`))
    .pipe(gulp.dest('./dist'))
);

// BUILD TAR
gulp.task('packagify', ['transpile', 'javascript-concat'], () => gulp.src('dist/**')
    .pipe(gulp.dest('package/package'))
);

gulp.task('compress', ['packagify'], () => gulp.src(['package/**', 'package.json'])
    .pipe(tar(`tar/${projectName}@${version}.tar`))
    .pipe(gulp.dest('./'))
);

gulp.task('clean', ['compress'], () => gulp.src([
    'dist', 'build', 'package'
]).pipe(clean()));

gulp.task('generate-package', ['clean']);