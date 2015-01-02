module.exports = function (grunt) {
  'use strict';

  var CODECLIMATE_REPO_TOKEN = process.env.CODECLIMATE_REPO_TOKEN
    || grunt.file.read('codeclimate.txt', { encoding: 'utf8' }).trim();

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= props.license %> */\n',

    testDir: './test',
    destDir: './.grunt',
    srcDir: './{lib,middleware}',

    clean: {
      build: '<%= destDir %>'
    },

    copy: {
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
      srcFiles: {
        files: {
          '<%= destDir %>/lib/': ['./lib'],
          '<%= destDir %>/middleware/': ['./middleware']
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'coffee-script/register',
          '<%= testDir %>/bootstrap',
        ]
      },
      test: {
        src: ['<%= destDir %>/test/**/*.coffee']
      },
      coverage: {
        options: {
          reporter: 'mocha-lcov-reporter',
          captureFile: '<%= destDir %>/coverage.lcov',
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

  grunt.registerTask('build', ['clean', 'copy', 'blanket']);
  grunt.registerTask('test', ['build', 'mochaTest', 'clean']);
  grunt.registerTask('travis', ['build', 'mochaTest', 'codeclimate', 'clean']);
};

