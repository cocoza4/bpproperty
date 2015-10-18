(function() {

  'use strict';

  angular

    .module('authentication', ['authentication-service'])

  .controller('SessionExpiredModalCtrl', ['$scope', '$interval', '$location', '$modalInstance', 'AuthenticationService',
    function($scope, $interval, $location, $modalInstance, AuthenticationService) {

      $scope.stayLogggedIn = function() {
        $interval.cancel(timer);
        $modalInstance.dismiss('cancel');
        AuthenticationService.heartbeat(function(response) {
          if (!response.success) {
            alert('Unable to stay logged in');
            $location.path('/logout');
          }
        });
      };

      var timer = $interval(function() {
        if ($scope.counter === 0) {
          $location.path('/logout');
        } else {
          $scope.counter--;
        }
      }, 1 * 1000); // check every second

      $scope.counter = 60;
    }
  ])

  .controller('LoginCtrl', ['$scope', '$window', '$location', 'AuthenticationService', function($scope, $window, $location, AuthenticationService) {

    var self = this;
    AuthenticationService.clearCredentials();

    this.redirectToHome = function() {
      var baseUrl = $location.absUrl().split('#')[0];
      baseUrl = baseUrl.replace('login', '') + '#/lands';
      $window.location.href = baseUrl;
    };

    this.callback = function(response) {
      if (response.success) {
        AuthenticationService.setCredentials($scope.username, $scope.password);
        self.redirectToHome();
      } else {
        $scope.error = response.message;
      }
    };

    $scope.login = function() {
      AuthenticationService.login($scope.username, $scope.password, self.callback);
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
