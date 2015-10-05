(function() {

  'use strict';

  angular

    .module('authentication', ['authentication-service'])

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
      });
    };

  }])

  .controller('LogoutCtrl', ['$window', '$location', 'AuthenticationService', function($window, $location, AuthenticationService) {

    this.callback = function() {
      AuthenticationService.clearCredentials();
      $window.location.href = $location.absUrl().split('#')[0];
    };

    AuthenticationService.logout(this.callback);

  }]);

})();
