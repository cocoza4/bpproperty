(function() {

  'use strict';

  angular

    .module('authentication', [])

  .controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    AuthenticationService.clearCredentials();
    $scope.login = function() {
      AuthenticationService.login($scope.username, $scope.password, function(response) {
        if (response.success) {
          AuthenticationService.setCredentials($scope.username, $scope.password);
          $location.path('/lands');
        } else {
          $scope.error = response.message;
        }
      })
    };

  }]);

})();
