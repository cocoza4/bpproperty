module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        src: ['build']
      }
    },

    watch: {
      dev: {
        files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html', '!app/build/*.js'],
        tasks: ['jshint', 'karma:unit', 'clean', 'concat'],
        options: {
          atBegin: true
        }
      },
      min: {
        files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html', '!app/build/*.js'],
        tasks: ['jshint', 'karma:unit', 'clean', 'uglify'],
        options: {
          atBegin: true
        }
      }
    },

    concat: {
      options: {
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        files: {
          'build/<%= pkg.name %>.js': ['app/**/*.js'],
          'build/<%= pkg.name %>-authentication.js': ['app/authentication/authentication-service.js',
            'app/authentication/authentication-controller.js', 'app/authentication/main.js'
          ]
        }
      },
    },

    uglify: {
      options: {
        ASCIIOnly: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'build/<%= pkg.name %>.min.js': ['app/**/*.js', '!app/i18n/*.js'], // exclide i18n
          'build/<%= pkg.name %>-authentication.min.js': ['app/authentication/authentication-service.js',
            'app/authentication/authentication-controller.js', 'app/authentication/main.js'
          ]
        }

      }
    },

    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js']
    },

    karma: {
      options: {
        configFile: 'test/karma.conf.js'
      },
      unit: {
        singleRun: true,
        browsers: ['PhantomJS'],
      },
      continuous: {
        singleRun: false,
        autoWatch: true
      }
    },

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');


  // Default task(s).
  grunt.registerTask('test', ['jshint', 'karma:continuous']);
  grunt.registerTask('dev', ['watch:dev']);
  grunt.registerTask('minified', ['watch:min']);
  grunt.registerTask('default', ['minified']);

};
