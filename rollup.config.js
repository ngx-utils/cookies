export default {
  entry: './release/index.js',
  dest: './release/bundles/ngx-cookies.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ngx-cookies',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    'rxjs/Observable': 'Rx'
  }
}