module.exports = function(grunt) {
 
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        mochaTest: {
          test: {
            options: {
              reporter: 'spec',
              captureFile: 'results.txt', // Optionally capture the reporter output to a file
              clearRequireCache: true, // Optionally clear the require cache before running tests (defaults to false)
              quiet: false,
              require: 'blanket'
            },
            src: ['./tests/**/*.js']
          },
          coverage: {
            options: {
              reporter: 'html-cov',
              // use the quiet flag to suppress the mocha console output
              quiet: true,
              // specify a destination file to capture the mocha
              // output (the quiet option does not suppress this)
              captureFile: 'coverage.html'
            },
            src: ['./tests/**/*.js']
          }
        },
        watch: {
          js: {
            options: {
              spawn: false,
            },
            files: ['./app_api/**/*.js', './tests/**/*.js'],
            tasks: ['mochaTest']
          }
        }
    });

     // On watch events, if the changed file is a test file then configure mochaTest to only 
    // run the tests from that file. Otherwise run all the tests 
    var defaultTestSrc = grunt.config('mochaTest.test.src');
    grunt.event.on('watch', function(action, filepath) {
      grunt.config('mochaTest.test.src', defaultTestSrc);
      if (filepath.match('test/')) {
        grunt.config('mochaTest.test.src', filepath);
      }
    });

    grunt.registerTask('default', ['mochaTest', 'watch']);
};