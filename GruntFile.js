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
        web: 'web/',
        server: 'server/',
        dev: 'www-dev/',
        prod: 'www-prod/',
        bower: 'bower_components/',
        vendors: 'vendors/',
        sass: 'sass/',
        assets: 'assets/',
        public: 'public/',
        tmp: '.tmp/',
        heroku: 'www-prod-heroku/'
    };


    module.exports = function(grunt) {

        /**
         * Initialisation de grunt
         */
        grunt.config.init({

            pkg2: grunt.file.readJSON('package.json'),
            config: config,
            pkg: config.pkg,

            bowercopy: {
                js: {
                    options: {
                        destPrefix: config.dev + config.client + config.web + config.vendors + 'js/'
                    },
                    files: {
                        'angular.min.js': 'angular/angular.min.js',
                        'angular-animate.min.js': 'angular-animate/angular-animate.min.js',
                        'angular-bootstrap.min.js': 'angular-bootstrap/ui-bootstrap.min.js',
                        'ui-bootstrap-tpls.min.js': 'angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'angular-bootstrap-toggle.min.js': 'angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.js',
                        'angular-messages.min.js': 'angular-messages/angular-messages.min.js',
                        'angular-moment.min.js': 'angular-moment/angular-moment.min.js',
                        'angular-resource.min.js': 'angular-resource/angular-resource.min.js',
                        'angular-route.min.js': 'angular-route/angular-route.min.js',
                        'angular-sanitize.min.js': 'angular-sanitize/angular-sanitize.min.js',
                        'angular-translate.min.js': 'angular-translate/angular-translate.min.js',
                        'angular-translate-loader-partial.min.js': 'angular-translate-loader-partial/angular-translate-loader-partial.min.js',
                        'sortable.min.js': 'angular-ui-sortable/sortable.min.js',
                        'bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                        'jquery.min.js': 'jquery/dist/jquery.min.js',
                        'jquery-ui.min.js': 'jquery-ui/jquery-ui.min.js',
                        'kendo.ui.core.min.js': 'kendo-ui/js/kendo.ui.core.min.js',
                        'kendo.culture.fr-CA.min.js': 'kendo-ui/js/cultures/kendo.culture.fr-CA.min.js',
                        'kendo.message.fr-CA.min.js': 'kendo-ui/js/messages/kendo.messages.fr-CA.min.js',
                        'moment.min.js': 'moment/min/moment.min.js',
                        'ng-map.min.js': 'ngmap/build/scripts/ng-map.min.js',
                        'ngToast.min.js': 'ngToast/dist/ngToast.min.js',
                        'satellizer.min.js': 'satellizer/dist/satellizer.min.js',
                        'ui-grid.min.js': 'angular-ui-grid/ui-grid.min.js'
                    },
                },

                // sass: {
                //     options: {
                //         destPrefix: config.dev + config.client + config.web + config.vendors + 'sass/'
                //     },
                //     files: {
                //         'bootstrap-sass': 'bootstrap-sass/',
                //         'roboto-fontface': 'roboto-fontface/'
                //     },
                // },

                css: {
                    options: {
                        destPrefix: config.dev + config.client + config.web + config.vendors + 'css/'
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
                        // 'material-design-icons/maps/1x_web': 'material-design-icons/maps/1x_web/',
                        'material-design-icons/navigation/1x_web': 'material-design-icons/navigation/1x_web/',
                        'material-design-icons/notification/1x_web': 'material-design-icons/notification/1x_web/',
                        // 'material-design-icons/places/1x_web': 'material-design-icons/places/1x_web/',
                        'material-design-icons/social/1x_web': 'material-design-icons/social/1x_web/',
                        'material-design-icons/sprites': 'material-design-icons/sprites/',
                        'material-design-icons/toggle/1x_web': 'material-design-icons/toggle/1x_web/',
                        'angular-bootstrap-toggle.css': 'angular-bootstrap-toggle/dist/angular-bootstrap-toggle.css',
                        'kendo.common-bootstrap.min.css':'kendo-ui/styles/kendo.common-bootstrap.min.css',
                        'kendo.bootstrap.min.css':'kendo-ui/styles/kendo.bootstrap.min.css',
                        'ngToast.css': 'ngToast/dist/ngToast.css',
                        'ngToast-animations.css' : 'ngToast/dist/ngToast-animations.css',
                        'ui-grid.css': 'angular-ui-grid/ui-grid.css',
                        'ui-grid.eot': 'angular-ui-grid/ui-grid.eot',
                        'ui-grid.svg': 'angular-ui-grid/ui-grid.svg',
                        'ui-grid.ttf': 'angular-ui-grid/ui-grid.ttf',
                        'ui-grid.woff': 'angular-ui-grid/ui-grid.woff'
                    }
                },

                fonts: {
                    options: {
                        destPrefix: config.dev + config.client + config.web + config.vendors + 'fonts/'
                    },
                    files: {
                        'roboto-fontface': 'roboto-fontface/fonts/roboto/Roboto-R*.*'
                    },
                },
            },

            rename: {
                heroku: {
                    files: [
                        {src: config.heroku + 'config/env/heroku.js',
                         dest: config.heroku + 'config/env/production.js'
                        }
                    ]
                }
            },

            copy: {
                "prod-package-json": {
                    src: ['package.json'],
                    expand: false,
                    dest: config.heroku
                },
                "prod-heroku": {
                    src: ['**'],
                    expand: true,
                    cwd: config.prod,
                    dest: config.heroku
                },
                "prod-heroku-js": {
                    src: ['heroku.js'],
                    expand: false,
                    cwd: config.prod + 'config/env/',
                    dest: config.heroku + 'config/env/production.js',
                },
                "prod-server": {
                    src: ['**'],
                    expand: true,
                    cwd: config.dev + config.server,
                    dest: config.prod
                },
                "prod-html-to-tmp": {
                    src: ['index.html', 'app/**/*.html'],
                    expand: true,
                    cwd: config.dev + config.client + config.web,
                    dest: config.tmp + config.web
                },
                "prod-tmp-to-public": {
                    src: ['index.html', 'app/**/*.html'],
                    expand: true,
                    cwd: config.tmp + config.web,
                    dest: config.prod + config.public
                },
                "prod-vendors-css": {
                    src: ['css/**/*.*', '!css/bootstrap-sass/**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.vendors,
                    dest: config.prod + config.public + config.vendors
                },
                "prod-vendors-fonts": {
                    src: ['**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.vendors + 'fonts',
                    dest: config.prod + config.public + config.vendors + 'fonts'
                },

                "prod-assets-i18n": {
                    src: ['**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.assets + 'i18n',
                    dest: config.prod + config.public + config.assets + 'i18n'
                },
                "prod-assets-images": {
                    src: ['**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.assets + 'images',
                    dest: config.prod + config.public + config.assets + 'images'
                },
                "prod-vendors": {
                    src: ['vendors/**/*.*', '!vendors/css/bootstrap-sass/**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web,
                    dest: config.prod + config.client + config.web
                },

                "prod-app": {
                    src: ['**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.app,
                    dest: config.prod + config.client + config.web + config.app
                },
                "prod-web": {
                    src: ['**/*.*'],
                    expand: true,
                    cwd: config.dev + config.client + config.web,
                    dest: config.prod + config.client + config.web
                },
                "prod-vendors-js": {
                    src: ['**/*.js'],
                    expand: true,
                    cwd: config.dev + config.client + config.web + config.vendors + 'js',
                    dest: config.prod + config.client + config.web + config.vendors + 'js'
                },
                "ui-grid-paper": {
                    expand: true,
                    src: 'ui-grid.css',
                    cwd: 'bower_custom/',
                    dest: config.dev + config.client + config.web + config.vendors + 'css'
                },


            },

            clean: {
                "dev-annoted" : ['www-dev/client/web/app/**/*.annotated.js'],
                "dev-vendors" : [config.dev + config.client + config.web + config.vendors],
                "prod": ['.sass-cache', '.tmp', config.prod],
                "prod-heroku": [config.heroku],
                "prod-client": [config.prod + config.client + config.web],
                "prod-server": [config.prod + config.server],

            },

            jshint: {
                "dev-app": {
                    src: [config.dev + config.client + config.web + config.app + '**/*.js']
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
                      "www-dev/client/web/assets/style/app.css": "www-dev/client/web/assets/style/app.scss"
                    }
                },
                prod: {
                    options: {
                        style: 'compressed',
                        sourcemap: 'none'
                    },
                    files: {   //dest < Source
                        "www-prod/public/assets/style/app.min.css": "www-dev/client/web/assets/style/app.css"
                    }
                }
            },

            concat: {
                "prod-vendors": {
                    src: [
                        'www-dev/client/web/vendors/js/jquery.min.js',
                        'www-dev/client/web/vendors/js/angular.min.js',
                        'www-dev/client/web/vendors/js/ui-bootstrap-tpls.min.js',
                        'www-dev/client/web/vendors/js/angular-route.min.js',
                        'www-dev/client/web/vendors/js/angular-resource.min.js',
                        'www-dev/client/web/vendors/js/angular-animate.min.js',
                        'www-dev/client/web/vendors/js/angular-messages.min.js',
                        'www-dev/client/web/vendors/js/angular-sanitize.min.js',
                        'www-dev/client/web/vendors/js/jquery-ui.min.js',
                        'www-dev/client/web/vendors/js/sortable.min.js',
                        'www-dev/client/web/vendors/js/bootstrap.min.js',
                        'www-dev/client/web/vendors/js/angular-bootstrap-toggle.min.js',
                        'www-dev/client/web/vendors/js/bootstrap.min.js',
                        'www-dev/client/web/vendors/js/moment.min.js',
                        'www-dev/client/web/vendors/js/angular-moment.min.js',
                        'www-dev/client/web/vendors/js/satellizer.min.js',
                        'www-dev/client/web/vendors/js/ng-map.min.js',
                        'www-dev/client/web/vendors/js/ngToast.min.js',
                        'www-dev/client/web/vendors/js/angular-translate.min.js',
                        'www-dev/client/web/vendors/js/angular-translate-loader-partial.min.js',
                        'www-dev/client/web/vendors/js/kendo.ui.core.min.js',
                        'www-dev/client/web/vendors/js/kendo.culture.fr-CA.min.js',
                        'www-dev/client/web/vendors/js/kendo.message.fr-CA.min.js'
                    ],
                    dest: 'www-prod/public/vendors/js/vendors.min.js'
                },
            },

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n',
                    mangle: false,
                    beautify: {
                        beautify: false,
                        width: 80
                    }
                },

                 "prod-app": {
                     files: {
                         'www-prod/public/app/app.min.js': [
                             'www-dev/client/web/app/app.js',
                             '!www-dev/client/web/app/*.js',
                             'www-dev/client/web/app/**/*.js'
                           ]
                     }
                 },

                "prod-server": {
                    files: [{
                        expand: true,
                        src: '**/*.js',
                        cwd: config.dev + config.server,
                        dest: config.prod,
                        ext: '.min.js'
                    }]
                }

                 // "prod-app-vendors": {
                 //     files: {
                 //         'www-prod/client/web/vendors/js/vendors.min.js': [
                 //             'www-dev/client/web/vendors/js/jquery.min.js',
                 //             'www-dev/client/web/vendors/js/angular.min.js',
                 //             'www-dev/client/web/vendors/js/ui-bootstrap-tpls.min.js',
                 //             'www-dev/client/web/vendors/js/angular-route.min.js',
                 //             'www-dev/client/web/vendors/js/angular-resource.min.js',
                 //             'www-dev/client/web/vendors/js/angular-animate.min.js',
                 //             'www-dev/client/web/vendors/js/angular-messages.min.js',
                 //             'www-dev/client/web/vendors/js/angular-sanitize.min.js',
                 //             'www-dev/client/web/vendors/js/jquery-ui.min.js',
                 //             'www-dev/client/web/vendors/js/sortable.min.js',
                 //             'www-dev/client/web/vendors/js/bootstrap.min.js',
                 //             'www-dev/client/web/vendors/js/angular-bootstrap-toggle.min.js',
                 //             'www-dev/client/web/vendors/js/bootstrap.min.js',
                 //             'www-dev/client/web/vendors/js/moment.min.js',
                 //             'www-dev/client/web/vendors/js/angular-moment.min.js',
                 //             'www-dev/client/web/vendors/js/satellizer.min.js',
                 //             'www-dev/client/web/vendors/js/ng-map.min.js',
                 //             'www-dev/client/web/vendors/js/ngToast.min.js',
                 //             'www-dev/client/web/vendors/js/angular-translate.min.js',
                 //             'www-dev/client/web/vendors/js/angular-translate-loader-partial.min.js',
                 //             'www-dev/client/web/vendors/js/kendo.ui.core.min.js',
                 //             'www-dev/client/web/vendors/js/kendo.culture.fr-CA.min.js',
                 //             'www-dev/client/web/vendors/js/kendo.message.fr-CA.min.js'
                 //        ]
                 //     }
                 // }

            },

                // ,
                // "prod-vendors": {
                //     files: {
                //         'www-prod/client/web/vendors.min.js': [config.dev + config.client + config.web + config.vendors + '**/*.js',
                //             !config.dev + config.client + config.web + config.vendors + '**/*.min.js']
                //     }
                // },
                // "prod-vendors-kendo": {
                //     files: {
                //         'www-prod/client/web/kendo.min.js': [config.dev + config.client + config.web + config.vendors + '**/k*.min.js']
                //     }
                // },
                // build: {
                //     files: [{
                //         expand: true,
                //         src: '**/*.js',
                //         cwd:  config.dev + config.client + config.web + config.vendors + '/js',
                //         dest: config.prod + config.client + config.web,
                //         ext: '.min.js'
                //     }]
                // }


            minifyHtml: {
                'prod-html-tmp': {
                    options: {
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: [{
                        expand: true,
                        cwd: '.tmp/web',
                        src: ['app/**/*.html', '*.html'],
                        dest: '.tmp/web'
                    }]
                }
            },

            replace: {
                "prod-html-tmp": {
                    options: {
                        patterns: [
                            {
                                match: 'DEV',
                                replacement: 'Mon épicerie'
                            }
                        ]
                    },
                    files: [
                        {src: '.tmp/web/index.html',
                         dest: '.tmp/web/index.html'
                        }
                    ]
                }
            },

            processhtml: {
                "prod-html-tmp": {
                    options: {
                        process: true,
                        data: {
                            title: 'My app'
                        }
                    },
                    files: {
                        '.tmp/web/index.html': ['.tmp/web/index.html']
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
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-minify-html');
        grunt.loadNpmTasks('grunt-processhtml');
        grunt.loadNpmTasks('grunt-replace');
        grunt.loadNpmTasks('grunt-contrib-rename');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask(
            'init-dev', 'Dev. vendors initialization',
            [ 'clean:dev-vendors',
              'bowercopy'
            ]);

        grunt.registerTask(
            'prod-deploy', 'Prod. deploy',
            [ 'clean:prod',
              'copy:prod-server',
            //  'uglify:prod-server',
              'copy:prod-html-to-tmp',
              'replace:prod-html-tmp',
              'processhtml:prod-html-tmp',

              'copy:prod-vendors-css',
              'copy:prod-vendors-fonts',
              'copy:prod-assets-i18n',
              'copy:prod-assets-images',

              'copy:prod-tmp-to-public',
              'uglify:prod-app',
              'concat:prod-vendors',
              'sass:prod'
            ]);

        grunt.registerTask(
            'prod-heroku', 'Prod. heroku',
            [ 'clean:prod-heroku'

            ]);

    };
}());

