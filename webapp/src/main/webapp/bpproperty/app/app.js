(function() {

  'use strict';

  // Declare app level module which depends on views, and components
  angular

    .module('myApp', [
    'ngRoute',
    'ngCookies',

    'myApp.version',
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
    'myApp.view2',

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

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider

      .when('/bpproperty', {
        templateUrl: 'authentication/login.tpl.html',
        controller: 'LoginCtrl'
      })

      .when('/login', {
        templateUrl: 'authentication/login.tpl.html',
        controller: 'LoginCtrl'
      })

    .otherwise({
      redirectTo: '/login'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }])

  .run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.get('globals') || {};

    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      // redirect to login page if not logged in
      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
        $location.path('/login');
      }
    });
  }])

  ;

})();
