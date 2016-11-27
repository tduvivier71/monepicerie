(function () {

  'use strict';
  
  angular
    .module('app')
    .directive('searchItem', searchItem);

  searchItem.$inject = ['focus'];

  function searchItem (focus) {
    return {
      restrict: 'E',
      scope: {
        searchItem: '='
      },
      templateUrl: 'app/shared/directives/searchItem/searchItem.template.html',
      link: function(scope){

        scope.cancelEsc = function cancelEsc(e) {
          if (e.keyCode === 27) {
            scope.clearSearchItem();
          }
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