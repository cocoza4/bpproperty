(function() {

  'use strict';

  angular

    .module('authentication', [])

  .controller('LoginCtrl', ['$scope', '$window', '$location', 'AuthenticationService', function($scope, $window, $location, AuthenticationService) {

    AuthenticationService.clearCredentials();
    $scope.login = function() {

      var redirectToHome = function() {
        var baseUrl = $location.absUrl().split('#')[0];
        baseUrl = baseUrl.replace('login', '') + '#/lands';
        $window.location.href = baseUrl;
      }

      AuthenticationService.login($scope.username, $scope.password, function(response) {
        if (response.success) {
          AuthenticationService.setCredentials($scope.username, $scope.password);
          redirectToHome();
        } else {
          $scope.error = response.message;
        }
      })
    };

  }])

  .controller('LogoutCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    AuthenticationService.clearCredentials();
    $location.path('/login');
  }]);

})();
