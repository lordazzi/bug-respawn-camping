const gulp = require('gulp');
const tar = require('gulp-tar');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
let version = '';
let projectName = '';

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json'));
    version = packageJson.version;
    projectName = packageJson.name;
} catch (e) {
    console.error('não foi possível ler a versão contida no package.json');
    throw e;
}

gulp.task('transpile', () => tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
);

gulp.task('packagify', ['transpile'], () => gulp.src('dist/**')
    .pipe(gulp.dest('package/package'))
);

gulp.task('compress', ['packagify'], () => gulp.src(['package/**', 'package.json'])
    .pipe(tar(`tar/${projectName}@${version}.tar`))
    .pipe(gulp.dest('./'))
);

gulp.task('clean', ['compress'], () => gulp.src([
    'dist', 'package'
]).pipe(clean()));

gulp.task('generate-package', ['clean']);
