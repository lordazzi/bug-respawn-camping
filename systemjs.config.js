/**
 * This guy is used to run the unit tests
 */
System.config({
  transpiler: 'typescript',
  paths: {
    'typescript': 'node_modules/typescript/lib/typescript.js',
    'systemjs': 'node_modules/systemjs/dist/system.js'
  },
  packages: {
    'src': {
      defaultExtension: 'ts'
    }
  }
});