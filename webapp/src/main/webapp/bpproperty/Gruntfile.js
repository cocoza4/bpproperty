module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      dev: {
        files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html'],
        tasks: ['jshint', 'karma:unit', 'concat'],
        options: {
          atBegin: true
        }
      },
      min: {
        files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html'],
        tasks: ['jshint', 'karma:unit', 'concat', 'uglify'],
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
        src: ['app/**/*.js'],
        dest: 'build/<%= pkg.name %>.js',
      },
    },

    uglify: {
      options: {
        ASCIIOnly: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['app/**/*.js', '!app/i18n/*.js'], // exclide i18n
        dest: 'build/<%= pkg.name %>.min.js'
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
        singleRun: true
      },
      continuous: {
        singleRun: false,
        autoWatch: true
      }
    },

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
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
