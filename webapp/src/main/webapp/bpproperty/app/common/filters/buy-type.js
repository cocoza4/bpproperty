(function() {

  'use strict';

  angular.module('buy-type-filter', [])

  .filter('buyType', function() {
    return function(input) {
      if (input === 'CASH') {
        return '\u0E2A\u0E14';
      } else if (input === 'INSTALLMENT') {
        return '\u0E1C\u0E48\u0E2D\u0E19';
      }
    };
  });

})();
