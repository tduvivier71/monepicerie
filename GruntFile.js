/**
 * Created by Thierry on 2016/10/21.
 */
(function () {

    'use strict';

    var pkgjson = require('./package.json');

    var config = {
        pkg: pkgjson,
        app: 'app',
        client: 'client/',
        server: 'server/',
        dev: 'www-dev/',
        prod: 'www-prod/',
        bower: 'bower_components/',
        vendors: 'vendors/',
        sass: 'sass/',
        assets: 'assets/'
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
                        destPrefix: config.dev + config.client + config.vendors + 'js/'
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
                        destPrefix: config.dev + config.client + config.vendors + 'sass/'
                    },
                    files: {
                        'bootstrap-sass': 'bootstrap-sass/',
                        'roboto-fontface': 'roboto-fontface/'
                    },
                },

                css: {
                    options: {
                        destPrefix: config.dev + config.client + config.vendors + 'css/'
                    },
                    files: {
                        'Bootstrap':'kendo-ui/styles/Bootstrap',
                        'bootstrap-sass': 'bootstrap-sass/',
                        'roboto-fontface': 'roboto-fontface/',
                        'material-design-icons/action/1x_web': 'material-design-icons/action/1x_web/',
                        'material-design-icons/alert/1x_web': 'material-design-icons/alert/1x_web/',
                        'material-design-icons/content/1x_web': 'material-design-icons/content/1x_web/',
                        'material-design-icons/editor/1x_web': 'material-design-icons/editor/1x_web/',
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
                        destPrefix: config.dev + config.client + config.vendors + 'fonts/'
                    },
                    files: {
                        'roboto-fontface': 'roboto-fontface/fonts/roboto/Roboto-R*.*'
                    },
                },
            },

            copy: {
                "prod-server": {
                    src: ['**'],
                    expand: true,
                    cwd: config.dev + config.server,
                    dest: config.prod + config.server
                },
            },

            clean: {
                "dev-vendors" : [config.dev + config.client + config.vendors],
                "prod": ['.sass-cache', config.prod],
                "prod-client": [config.prod + config.client],
                "prod-server": [config.prod + config.server],

            },

            jshint: {
                "dev-app": {
                    src: [config.dev + config.client + config.app + '**/*.js']
                }
                //,
                //"dev-server": {
                //    src: ['server/**/*.js']
                //}
            },

            sass: {
                dev: {
                    options: {
                        style: 'expanded',
                        lineNumbers: true
                    },
                    files: {
                      // config.dev + config.client + "assets/style/app.css" : config.dev + config.client + "assets/style/app.scss"
                      "www-dev/client/assets/style/app.css": "www-dev/client/assets/style/app.scss"
                    }
                },
                prod: {
                    options: {
                        style: 'compressed',
                        sourcemap: 'none'
                    },
                    files: {   //dest < Source
                        "www-prod/client/app.min.css": "www-dev/client/assets/style/app.css"
                    }
                }
            },

            uglify: {
                options: {
                    beautify: {
                        beautify: false,
                        width: 80
                    }
                },
                "prod-app": {
                    files: {
                        'www-prod/client/app.min.js': config.dev + config.client + config.app + '**/*.js'
                    }
                },
                "prod-vendors": {
                    files: {
                        'www-prod/client/vendors.min.js': [config.dev + config.client + config.vendors + '**/*.js',
                            !config.dev + config.client + config.vendors + '**/*.min.js']
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
                        cwd: 'www-dev',
                        src: ['app/**/*.html', '*.html'],
                        dest: 'www-prod/client'
                    }]
                }
            },

            processhtml: {
                dev: {
                    options: {
                        process: true,
                        data: {
                            title: 'My app dev',
                            message: 'This is dev distribution'
                        }
                    },
                    files: {
                        'www-dev/client/index.html': ['www-dev/client/index.html']
                    }
                },

                prod: {
                    options: {
                        process: true,
                        data: {
                            title: 'My app prod',
                            message: 'This is production distribution'
                        }
                    },
                    files: {
                        'www-prod/client/index.html': ['www-dev/client/index.html']
                    }
                }
            },

        });

        /**
         * watch
         */

        grunt.config( 'watch' , {
            "dev-js": {
                files: [ config.dev + config.client + config.app +  '**/*.js' ],
                tasks: [ 'jshint:dev-app', 'copy:dev-app' ]
            },
            "dev-css": {
                files: [ config.dev + config.client + config.assets +  '**/*.scss' ],
                tasks: ['sass'],
            },
            options: {
                livereload: true
            }
        });

        grunt.loadNpmTasks('grunt-bowercopy');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-minify-html');
        grunt.loadNpmTasks('grunt-processhtml');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask(
            'init-dev', 'Dev. vendors initialization',
            [ 'clean:dev-vendors',
              'bowercopy'
            ]);

        grunt.registerTask(
            'dev-deploy', 'Dev. deploy',
            [ 'processhtml:dev'
            ]);

        grunt.registerTask(
            'prod-deploy', 'Prod. deploy',
            [ 'copy:prod-server',
              'uglify:app',
              'minifyHtml:prod',
              'processhtml:prod',
              'sass:prod']);

        grunt.registerTask(
            'prod-deploy-vendors', 'Prod. deploy vendors',
            [ 'uglify:vendors']);

    };
}());
