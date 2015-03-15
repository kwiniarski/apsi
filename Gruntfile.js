module.exports = function (grunt) {
  'use strict';

  function readCodeclimateTokenFile() {
    var filename = './codeclimate.txt';
    if (grunt.file.exists(filename)) {
      return grunt.file.read('codeclimate.txt', { encoding: 'utf8' }).trim();
    }
  }

  var CODECLIMATE_REPO_TOKEN = process.env.CODECLIMATE_REPO_TOKEN
    || readCodeclimateTokenFile();

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= props.license %> */\n',

    testDir: './test',
    destDir: './.grunt',
    srcDir: './{lib,middleware,services,models}',

    clean: {
      build: '<%= destDir %>'
    },

    copy: {
      library: {
        src: ['./{config,index}.js', '<%= srcDir %>/**'],
        dest: '<%= destDir %>/'
      },
      testFiles: {
        src: '<%= testDir %>/**',
        dest: '<%= destDir %>/'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', '<%= srcDir %>/**/*.js']
    },

    blanket: {
      library: {
        files: {
          '<%= destDir %>/': ['<%= destDir %>']
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'coffee-script/register',
          '<%= testDir %>/bootstrap'
        ]
      },
      test: {
        src: ['<%= destDir %>/test/**/*.coffee']
      },
      coverageLcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          captureFile: '<%= destDir %>/coverage.lcov',
          quiet: true
        },
        src: ['<%= destDir %>/test/**/*.coffee']
      },
      coverageHtml: {
        options: {
          reporter: 'html-cov',
          captureFile: '<%= destDir %>/coverage.html',
          quiet: true
        },
        src: ['<%= destDir %>/test/**/*.coffee']
      }
    },

    codeclimate: {
      options: {
        file: '<%= destDir %>/coverage.lcov',
        token: CODECLIMATE_REPO_TOKEN
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-codeclimate');

  grunt.registerTask('build', ['clean', 'copy:library', 'blanket', 'copy:testFiles']);
  grunt.registerTask('test', ['build', 'mochaTest:test', 'clean']);
  grunt.registerTask('coverage', ['build', 'mochaTest:coverageHtml']);
  grunt.registerTask('travis', ['build', 'mochaTest:coverageLcov', 'clean']);
};

