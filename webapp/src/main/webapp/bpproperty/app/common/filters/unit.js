(function() {

  'use strict';

  angular.module('unit-filter', [])

  .filter('unit', function() {
    return function(unit) {
      return unit === 0 ? null : unit;
    };
  });

})();
