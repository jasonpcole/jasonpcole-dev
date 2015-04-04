/*
 * jasonco.de
 *
 * jasonpcole
 * https://github.com/jasonpcole/jasonco.de
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),
    bootstrap: '<%= vendor %>/bootstrap',

    // Before generating any new files, remove files from previous build.
    clean: {
      example: ['<%= site.dest %>/*.html']
    },


    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',
        postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },


    // Compile LESS to CSS
    less: {
      options: {
        vendor: 'vendor',
        paths: [
          '<%= site.theme %>',
          '<%= site.theme %>/bootstrap',
          '<%= site.theme %>/components',
          '<%= site.theme %>/custom',
          '<%= site.theme %>/utils'
        ],
      },
      site: {
        src: ['<%= site.theme %>/site.less'],
        dest: '<%= site.assets %>/css/site.css'
      }
    },


    // Copy Bootstrap's assets to site assets
    copy: {
      assets: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/dist/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: '<%= bootstrap %>/dist/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
        ]
      }
    },

    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      },
      site: {
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs'],
        tasks: ['design'],
        options: {
          livereload: true,
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '_gh_pages'
        }
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Build HTML, compile LESS, start server, and watch for changes.
  grunt.registerTask('design', ['clean', 'copy:assets',  'assemble', 'less', 'connect:server', 'watch:site']);

  grunt.registerTask('docs', ['readme', 'sync']);

  grunt.registerTask('default', ['clean', 'jshint', 'copy:assets', 'assemble', 'less', 'docs', 'connect:server', 'watch:site']);

};
