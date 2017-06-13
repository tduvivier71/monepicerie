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

            bowercopy: {
                js: {
                    options: {
                        destPrefix: 'client/vendors/js'
                    },
                    files: {
                        'angular.js': 'angular/angular.js',
                        'angular-animate.js': 'angular-animate/angular-animate.js',
                        'angular-bootstrap.js': 'angular-bootstrap/ui-bootstrap.js',
                        'ui-bootstrap-tpls.js': 'angular-bootstrap/ui-bootstrap-tpls.js',
                        'angular-bootstrap-toggle.js': 'angular-bootstrap-toggle/dist/angular-bootstrap-toggle.js',
                        'angular-messages.js': 'angular-messages/angular-messages.js',
                        'angular-moment.js': 'angular-moment/angular-moment.js',
                        'angular-resource.js': 'angular-resource/angular-resource.js',
                        'angular-route.js': 'angular-route/angular-route.js',
                        'angular-sanitize.js': 'angular-sanitize/angular-sanitize.js',
                        'angular-translate.js': 'angular-translate/angular-translate.js',
                        'angular-translate-loader-partial.js': 'angular-translate-loader-partial/angular-translate-loader-partial.js',
                        'sortable.js': 'angular-ui-sortable/sortable.js',
                        'bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
                        'jquery.js': 'jquery/dist/jquery.js',
                        'jquery-ui.js': 'jquery-ui/jquery-ui.js',
                        'kendo.ui.core.min.js': 'kendo-ui/js/kendo.ui.core.min.js',
                        'moment.js': 'moment/moment.js',
                        'ng-map.js': 'ngmap/build/scripts/ng-map.js',
                        'ngToast.js': 'ngToast/dist/ngToast.js',
                        'satellizer.js': 'satellizer/dist/satellizer.js'
                    },
                },

                sass: {
                    options: {
                        destPrefix: 'client/vendors/sass'
                    },
                    files: {
                        'bootstrap-sass': 'bootstrap-sass/',
                        'roboto-fontface': 'roboto-fontface/'
                    },
                },

                css: {
                    options: {
                        destPrefix: 'client/vendors/css'
                    },
                    files: {

                        'bootstrap-sass': 'bootstrap-sass/',
                        'roboto-fontface': 'roboto-fontface/',
                        'material-design-icons/action/1x_web': 'material-design-icons/action/1x_web/',
                        'material-design-icons/alert/1x_web': 'material-design-icons/alert/1x_web/',
                        //  'material-design-icons/av/1x_web': 'material-design-icons/av/1x_web/',
                        //  'material-design-icons/communication/1x_web': 'material-design-icons/communication/1x_web/',
                        'material-design-icons/content/1x_web': 'material-design-icons/content/1x_web/',
                        // 'material-design-icons/device/1x_web': 'material-design-icons/device/1x_web/',
                        'material-design-icons/editor/1x_web': 'material-design-icons/editor/1x_web/',
                        // 'material-design-icons/file/1x_web': 'material-design-icons/file/1x_web/',
                        'material-design-icons/hardware/1x_web': 'material-design-icons/hardware/1x_web/',
                        'material-design-icons/iconfont': 'material-design-icons/iconfont/',
                        'material-design-icons/image/1x_web': 'material-design-icons/image/1x_web/',
                        'material-design-icons/maps/1x_web': 'material-design-icons/maps/1x_web/',
                        'material-design-icons/navigation/1x_web': 'material-design-icons/navigation/1x_web/',
                        'material-design-icons/notification/1x_web': 'material-design-icons/notification/1x_web/',
                        'material-design-icons/places/1x_web': 'material-design-icons/places/1x_web/',
                        'material-design-icons/social/1x_web': 'material-design-icons/social/1x_web/',
                        'material-design-icons/sprites': 'material-design-icons/sprites/',
                        'material-design-icons/toggle/1x_web': 'material-design-icons/toggle/1x_web/',

                        'angular-bootstrap-toggle.css': 'angular-bootstrap-toggle/dist/angular-bootstrap-toggle.css',
                        'kendo.common-bootstrap.min.css':'kendo-ui/styles/kendo.common-bootstrap.min.css',
                        'kendo.bootstrap.min.css':'kendo-ui/styles/kendo.bootstrap.min.css',
                        'ngToast.css': 'ngToast/dist/ngToast.css',
                        'ngToast-animations.css' : 'ngToast/dist/ngToast-animations.css'
                    },
                },

                fonts: {
                    options: {
                        destPrefix: 'client/vendors/fonts'
                    },
                    files: {
                        'roboto-fontface': 'roboto-fontface/fonts/roboto/Roboto-R*.*'
                    },
                },
            },

            copy: {
                "www-dev": {

                        src: ['index.html','app/**', 'assets/**'],
                        expand: true,
                        cwd: 'client',
                        dest: 'www-dev/client'

                },
                "www-dev-vendors": {
                    src: ['vendors/**'],
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



            clean: {

                    vendors: ['client/vendors']

            }

        });

        /**
         * watch
         */

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
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-bowercopy');
        grunt.loadNpmTasks( 'grunt-contrib-watch' );

        grunt.registerTask( 'createFolder' , 'Create the working folder' , function(){
            grunt.config.requires( 'copyFiles.options.workingDirectory' );
            grunt.file.mkdir(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        });

        // grunt.registerTask( 'clean',
        //     'Deletes the working folder and its contents' , function(){
        //         grunt.config.requires( 'copyFiles.options.workingDirectory' );
        //         grunt.file.delete(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        // });

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
