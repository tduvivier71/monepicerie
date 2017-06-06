/**
 * Created by Thierry on 2016/10/21.
 */
(function () {

    'use strict';

    var pkgjson = require('./package.json');

    var config = {
        pkg: pkgjson,
        app: 'client',
        dev: 'www-dev',
        prod: 'www-prod',
        bower: 'bower_components'
    };

    module.exports = function(grunt) {

        /**
         * Initialisation de grunt
         */
        grunt.config.init({

            config: config,
            pkg: config.pkg,

            copy: {
                "www-dev": {
                    src: ['index.html','app/**', 'assets/**'],
                    expand: true,
                    cwd: 'client',
                    dest: 'www-dev/client'
                },
            },

            jshint: {
                dist: {
                    src: ['client/assets/*.js' ,
                          'client/app/**/*.js']
                }
            },

            cssmin: {
                target: {
                    files: {
                        //target file : source file
                        'working/client/assets/style/style.min.css': 'client/assets/style/app.css'
                    }
                }
            },

            sass: {                              // Task
                dist: {                            // Target
                    options: {                       // Target options
                        style: 'expanded'
                    },
                    files: {                         // Dictionary of files
                                                     // dest : source
                      "working/client/assets/style/style.css": "client/assets/style/app.scss"
                    }
                }
            },

            bowerInstall: {
                dist: {
                    src: ['client/index.html'],
                    dependencies: true,
                    devDependencies: true,
                    exclude: ["material-design-icons"]
                }
            },


            bowercopy: {
                libs: {
                    options: {
                        destPrefix: 'client/vendors/js'
                    },
                    files: {
                        'angular.js': 'angular/angular.js',
                        'angular-animate.js': 'angular-animate/angular-animate.js',
                        'angular-boostrap.js': 'angular-boostrap/angular-boostrap.js',
                        'angular-boostrap-toggle.js': 'angular-boostrap-toogle/angular-boostrap-toogle.js',
                        'jquery.js': 'jquery/dist/jquery.js'
                    },
                },
            },

            bower: {
                "www-dev": {
                    dest: 'www-dev/client/vendors/',
                    js_dest: 'www-dev/client/vendors/js/',
                    css_dest: 'www-dev/client/vendors/styles/',
                    fonts_dest: 'www-dev/client/vendors/fonts/',
                    options: {
                        keepExpandedHierarchy: false,
                        expand: false
                    }
                }
            },

            "bower-install-simple": {
                options: {
                    color: true,
                    directory: "lib"
                },
                "prod": {
                    options: {
                        production: true
                    }
                },
                "dev": {
                    options: {
                        production: false
                    }
                }
            }

        });

        /**
         * watch
         */
        grunt.loadNpmTasks( 'grunt-contrib-watch' );
        grunt.config( 'watch' , {
            scripts: {
                files: [  'client/index.html' , 'client/assets/*.js' , 'client/app/**/*.js' ],
                tasks: [ 'jshint' ], // deploy
                options: {
                    spawn: false
                }
            },

            interface: {
                files: [ 'client/index.html' ]
            },
            options: {
                livereload: true
            }

        });

        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-jshint');

        // grunt.loadNpmTasks("grunt-bower-install-simple");
        // grunt.loadNpmTasks('grunt-bower-install');
         grunt.loadNpmTasks('grunt-bowercopy');

        grunt.loadNpmTasks('grunt-bower');


        grunt.registerTask( 'createFolder' , 'Create the working folder' , function(){
            grunt.config.requires( 'copyFiles.options.workingDirectory' );
            grunt.file.mkdir(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        });

        grunt.registerTask( 'clean',
            'Deletes the working folder and its contents' , function(){
                grunt.config.requires( 'copyFiles.options.workingDirectory' );
                grunt.file.delete(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        });

        grunt.registerTask( 'copyFiles' , function(){
            var files, workingDirectory;

            grunt.config.requires( 'copyFiles.options.manifest' );
            grunt.config.requires( 'copyFiles.options.workingDirectory' );

            files = grunt.config.get( 'copyFiles.options.manifest' );
            workingDirectory = grunt.config.get( 'copyFiles.options.workingDirectory' );

            files.forEach( function(file) {
                var destination = workingDirectory + '/' + file;
                grunt.log.writeln( 'Copying ' + file + ' to ' + destination);
                grunt.file.copy(file, destination);
            });
        });

     //   grunt.registerTask("bower-install", [ "bower-install-simple" ]);

        grunt.registerTask('default',
            ['bowerInstall', 'bower']);

        grunt.registerTask(
            'dev', 'Dev task',
            [ 'jshint',
              'clean' ,
              'createFolder' ,
              'copyFiles',
              'sass:dist',
              'cssmin:css'
            ]);

        grunt.registerTask(
            'deploy', 'Deploys files' ,
                [ 'jshint',
                  'clean' ,
                  'createFolder' ,
                  'copyFiles',
                  'sass:dist',
                  'cssmin:css'
                ]);

    };
}());