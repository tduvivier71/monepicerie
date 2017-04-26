(function () {

    'use strict';

    angular
        .module('app')
        .service('toasterService', toasterService);

    toasterService.$inject = ['ngToast'];

    function toasterService(ngToast) {

        var service = {
            success: success,
            info: info,
            warning: warning,
            error: error,
            save: save,
            remove: del,
            update: modify
        };
        return service;

        ////////////

        function success(message) {
            ngToast.create({
                content: message
            });
        }

        function info(message) {
            ngToast.create({
                className: 'info',
                content: message
            });
        }

        function warning(message) {
            ngToast.create({
                className: 'warning',
                content: message
            });
        }

        function error(message) {
            var msg;
            if (typeof message === 'string' || message instanceof String)  {
                msg = message;
            } else {
                msg =  message.data.message || message.data;
            }

            ngToast.create({
                className: 'danger',
                content: msg
            });
        }

        function save(message) {
            ngToast.create({
                content: "'" + message + "' a été enregistré avec succès."
            });
        }

        function del(message) {
            ngToast.create({
                className: 'danger',
                content: "'" + message + "' a été effacé avec succès."
            });
        }

        function modify(message) {
            ngToast.create({
                className: 'warning',
                content: "'" + message + "' a été modifié avec succès."
            });
        }

    }

})();