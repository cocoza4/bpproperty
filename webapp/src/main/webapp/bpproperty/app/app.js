(function() {

  'use strict';

  // Declare app level module which depends on views, and components
  angular

    .module('bpPropertyApp', [

    'ngRoute',
    'ngResource',
    'ngCookies',

    'ui.bootstrap',

    'services.breadcrumbs',

    'authentication-service',
    'authentication',

    'buy-type-filter',
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
      template: ' ', // Empty template. just need to logout
      controller: 'LogoutCtrl'
    })

    .otherwise({
      redirectTo: '/login'
    });

  }])

  .run(['$rootScope', '$location', '$cookies', '$interval', '$uibModal',
    function($rootScope, $location, $cookies, $interval, $uibModal) {

      // keep user logged in after page refresh
      $rootScope.globals = $cookies.getObject('globals') || {};

      var lastDigestRun = new Date();
      setInterval(function() { // detect inactivity
        var now = new Date();
        if (now - lastDigestRun >= 30 * 60 * 1000) { // 30 mins
          $uibModal.open({
            animation: true,
            templateUrl: 'sessionExpiredModal.html',
            controller: 'SessionExpiredModalCtrl',
          });
        }

      }, 1 * 60 * 1000); // check every minute

      $rootScope.$watch(function() {
        lastDigestRun = new Date();
      });

      $rootScope.$on('$locationChangeStart', function(event, next, current) {
        // redirect to login page if not logged in
        var loggedIn = $rootScope.globals.currentUser;
        if ($location.path() !== '/login' && !loggedIn) {
          $location.path('/login');
        }
      });
    }
  ]);

})();
