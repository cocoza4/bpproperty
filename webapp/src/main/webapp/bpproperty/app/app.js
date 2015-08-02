(function() {

  'use strict';

  // Declare app level module which depends on views, and components
  angular

    .module('myApp', [
    'ngRoute',
    'ngResource',
    'ngCookies',

    'services.breadcrumbs',

    'authentication-service',
    'authentication',

    'lazy-loading-tabset',
    'my-spinner',
    'my-loader',

    'my-pagination',
    'my-notification',
    'decimal-number',
    'percentage',

    'customer',

    'land',
    'land-service',
    'land-buy',
    'land-buy-service',
    'land-installment',
    'land-installment-service',

    'customer',
    'customer-service'

  ])

  .controller('appCtrl', ['$scope', 'breadcrumbs', function($scope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
  }])

  .controller('headerCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.isActive = function(route) {
      return $location.path().indexOf(route) === 0;
    }

  }])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/login', {
      templateUrl: 'authentication/login.html',
      controller: 'LoginCtrl'
    })

    .when('/logout', {
      template: ' ', // empty template. just need to logout
      controller: 'LogoutCtrl'
    })

    .otherwise({
      redirectTo: '/login'
    });

  }])

  .run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};

    // if ($rootScope.globals.currentUser) {
    //   $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.globals.currentUser.authdata;
    // }

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      // redirect to login page if not logged in
      var loggedIn = $rootScope.globals.currentUser;
      if ($location.path() !== '/login' && !loggedIn) {
        $location.path('/login');
      }
    });
  }]);

})();
