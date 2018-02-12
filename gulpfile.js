const gulp = require('gulp')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const del = require('del')

const COPY_FILES = ['src/**/*.html']
const DEST = 'dist'

gulp.task('del', () => {
  return del.sync(['dist/**/*'])
})

gulp.task('ts', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(DEST))
})

gulp.task('copy', () => {
  return gulp.src(COPY_FILES)
    .pipe(gulp.dest(DEST))
})

gulp.task('default', ['copy', 'ts'])