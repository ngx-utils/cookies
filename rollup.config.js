export default {
  entry: './release/index.js',
  dest: './release/bundles/cookies.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ngx-utils.cookies',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    'rxjs/Observable': 'Rx'
  }
}