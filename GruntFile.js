/**
 * Created by Thierry on 2016/10/21.
 */
(function () {

    'use strict';

    var pkgjson = require('./package.json');

    var config = {
        pkg: pkgjson,
        client: 'client',
        server: 'server',
        sources: 'sources',
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
                        'kendo.culture.fr-CA.min.js': 'kendo-ui/js/cultures/kendo.culture.fr-CA.min.js',
                        'kendo.message.fr-CA.min.js': 'kendo-ui/js/messages/kendo.messages.fr-CA.min.js',
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
                        'Bootstrap':'kendo-ui/styles/Bootstrap',
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
                "dev-app": {
                    src: ['index.html','app/**'],
                    expand: true,
                    cwd: config.client,
                    dest: config.dev + '/' + config.client
                },
                "dev-assets": {
                    src: ['assets/**'],
                    expand: true,
                    cwd: config.client,
                    dest: config.dev + '/' + config.client
                },
                "dev-vendors": {
                    src: ['vendors/**'],
                    expand: true,
                    cwd: config.client,
                    dest: 'www-dev/client'
                },
                "dev-server": {
                    src: ['**'],
                    expand: true,
                    cwd: config.server,
                    dest: config.dev + '/' + config.server
                },
                "prod-server": {
                    src: ['**'],
                    expand: true,
                    cwd: config.server,
                    dest: config.prod + '/' + config.server
                },
            },

            clean: {
                bower: ['client/vendors'],
                "dev-client": ['www-dev/client'],
                "dev-app": ['www-dev/client/app'],
                "dev-assets": ['www-dev/client/assets'],
                "dev-vendors": ['www-dev/client/vendors'],
                "prod": ['www-prod'],
                "prod-client": ['www-prod/client'],
                "prod-app": ['www-prod/app']
            },

            jshint: {
                "dev-app": {
                    src: ['client/app/**/*.js']
                }
                //,
                //"dev-server": {
                //    src: ['server/**/*.js']
                //}
            },

            cssmin: {
                prod: {
                    files: {
                        'www-prod/client/assets/style/app.min.css': 'www-dev/client/assets/style/app.css'
                    }
                }
            },

            sass: {
                dev: {
                    options: {
                        style: 'expanded',
                        lineNumbers: true
                    },
                    files: {   //dest < Source
                      "www-dev/client/assets/style/app.css": "client/assets/style/app.scss"
                    }
                },
                prod: {
                    options: {
                        style: 'compressed'
                    },
                    files: {   //dest < Source
                        "www-prod/client/assets/style/app.css": "www-dev/client/assets/style/app.css"
                    }
                }
            },

            minifyHtml: {
                prod: {
                    options: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: [{
                        expand: true,
                        cwd: 'client',
                        src: ['app/**/*.html', '*.html'],
                        dest: 'www-prod/client'
                    }]
                }
            },

            uglify: {
                options: {
                    beautify: {
                        beautify: false,
                        width: 80
                    }
                },
                prod: {
                    files: {
                        'www-prod/client/app.min.js': ['client/app/**/*.js']
                    }

                    //files: [{
                    //    expand: true,
                    //    cwd: 'client/app',
                    //    src: '**/*.js',
                    //    dest: 'www-prod/app'
                    //}]
                }
            }

        });

        /**
         * watch
         */

        grunt.config( 'watch' , {
            js: {
                files: [ 'client/app/**/*.js' ],
                tasks: [ 'jshint:dev-app', 'copy:dev-app' ]
            },
            css: {
                files: ['client/app/**/*.scss'],
                tasks: ['sass'],
            },
            options: {
                livereload: true
            }
        });

        grunt.loadNpmTasks('grunt-bowercopy');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-minify-html');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');


     /*   grunt.registerTask( 'createFolder' , 'Create the working folder' , function(){
            grunt.config.requires( 'copyFiles.options.workingDirectory' );
            grunt.file.mkdir(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        });  */

        // grunt.registerTask( 'clean',
        //     'Deletes the working folder and its contents' , function(){
        //         grunt.config.requires( 'copyFiles.options.workingDirectory' );
        //         grunt.file.delete(grunt.config.get( 'copyFiles.options.workingDirectory' ));
        // });

        grunt.registerTask(
            'init-dev', 'Dev. env. initialization',
            [ 'clean:bower',
              'bowercopy',
              'clean:dev-client' ,
              'copy' ,
              'sass:dev'
            ]);

        grunt.registerTask(
            'dev-deploy', 'Dev. deploy',
            [ 'jshint',
              'clean:dev-app',
              'clean:dev-assets',
              'copy:dev-app',
              'copy:dev-assets',
              'copy:dev-server',
              'sass:dev'
            ]);

        grunt.registerTask(
            'prod-deploy', 'Prod. deploy',
            [ 'clean:prod',
              'copy:prod-server',
              'uglify',
              'minifyHtml',
              'cssmin']);

    };
}());
