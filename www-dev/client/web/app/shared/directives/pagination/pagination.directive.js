(function () {

  'use strict';

  angular
    .module('app')
    .directive('pagination', pagination);

  function pagination () {
    return {
      restrict: 'E',
      scope: {
        viewBy: '=',
        setItemsPerPage: '&',
        totalItems: '=',
        itemsPerPage: '=',
        currentPage: '='
      },
      templateUrl: 'app/shared/directives/pagination/pagination.template.html',
      link: function(scope){
        scope.itemsPerPage = 25;
        scope.currentPage = 1;
        scope.viewBy = 25;

        scope.setItemsPerPage =  function setItemsPerPage(num) {
        //  console.log('num : ' + 25);
          scope.itemsPerPage = num;
          scope.currentPage = 1;
        };
      }
    };
  }

})();