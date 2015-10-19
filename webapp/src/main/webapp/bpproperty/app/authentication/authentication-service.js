(function() {

  'use strict';

  angular

    .module('authentication-service', ['ngCookies'])

  .service('AuthenticationService', ['$rootScope', '$cookies', '$http', 'Authentication',
    function($rootScope, $cookies, $http, Authentication) {

      this.heartbeat = function(callback) {
        $http.get('heartbeat')
          .success(function(data) {
            callback({
              success: true
            });
          })
          .error(function(error) {
            callback({
              success: false
            });
          });
      };

      this.logout = function(callback) {
        $http.post('logout', {}).success(function() {
          callback();
        }).error(function(data) {
          console.log(data);
          alert('Unable to log off');
        });
      };

      this.login = function(username, password, callback) {
        Authentication.authenticate(username, password, callback);
      };

      this.setCredentials = function(username, password) {
        var authdata = btoa(username + ':' + password);

        $rootScope.globals = {
          currentUser: {
            username: username,
            authdata: authdata
          }
        };

        // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        $cookies.putObject('globals', $rootScope.globals);
      };

      this.clearCredentials = function() {
        $rootScope.globals = {};
        $cookies.remove('globals');
        // $http.defaults.headers.common.Authorization = 'Basic ';
      };

    }
  ])

  .service('Authentication', ['$http', function($http) {

    this.authenticate = function(username, password, callback) {
      var headers = {
        authorization: "Basic " + btoa(username + ":" + password)
      };
      $http.get('postlogin', {
        'headers': headers
      }).success(function(data) {
        callback({
          success: true
        });
      }).error(function(error) {
        callback({
          message: 'Username or password is incorrect'
        });
      });
    };

  }]);

})();
