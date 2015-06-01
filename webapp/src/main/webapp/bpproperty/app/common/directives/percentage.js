(function () {

    'use strict';

    angular.module('percentage', [])

    .directive('percentage', function() {
      return {
        // restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return;
          }

          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }
            var clean = val.replace(/[^0-9\.]/g, '');

            if (parseFloat(clean) > 100.00) {
              clean = clean.substring(0, clean.length - 1);
            }

            var decimalCheck = clean.split('.');

            if (decimalCheck[0] == '') {
              decimalCheck[0] = "0";
            }

            if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0,2);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }

            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }
            return clean;
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });

})();
