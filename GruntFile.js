/**
 * Created by Thierry on 2016/10/21.
 */
(function () {

    'use strict';

    module.exports = function(grunt) {

        /**
         * Initialisation de grunt
         */
        grunt.config.init({

            copyFiles: {
                options: {
                    workingDirectory: 'working',
                manifest: [
                    'client/index.html' , 'client/assets/' , 'client/app/'
                ]}
            },

            jshint: {
                dist: {
                    src: ['client/assets/*.js' , 'client/app/**/*.js']
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

        /**
         * sass
         */
        grunt.loadNpmTasks('grunt-contrib-sass');

        /**
         * cssmin
         */
        grunt.loadNpmTasks('grunt-contrib-cssmin');


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
            files = grunt.config.get( 'copyFiles.options.manifest' ); workingDirectory =
                grunt.config.get( 'copyFiles.options.workingDirectory' );
            files.forEach( function(file) {
                var destination = workingDirectory + '/' + file;
                grunt.log.writeln( 'Copying ' + file + ' to ' + destination);
                grunt.file.copy(file, destination);
            });
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');


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