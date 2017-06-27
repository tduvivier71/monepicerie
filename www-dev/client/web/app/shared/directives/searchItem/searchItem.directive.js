(function () {

  'use strict';
  
  angular
    .module('app')
    .directive('searchItem', searchItem);

  searchItem.$inject = ['focus','$sce'];

  function searchItem (focus, $sce) {
    return {
      restrict: 'E',
      scope: {
        searchItem: '='
      },
      templateUrl: 'app/shared/directives/searchItem/searchItem.template.html',
      link: function(scope){

        scope.tips = $sce.trustAsHtml('Réinitialiser </br> la recherche');

        scope.cancelEsc = function cancelEsc(e) {
          if (e.keyCode === 27) {
            scope.clearSearchItem();
          }
        };

        scope.clearSearch = function clearSearch () {
            scope.searchItem = '';
        };


        scope.clearSearchItem = function clearSearchItem() {
          scope.searchItem = '';
          // scope._resetError();
          focus('searchItem_focus');
        };
        
      }
    };
  }

})();