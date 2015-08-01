(function() {

  'use strict';

  angular.module('myAuthentication', [
    'ngRoute', 'ngCookies', 'ngResource',

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

  .config(function($routeProvider, $httpProvider) {

    // $routeProvider.when('/lands', {
    //   templateUrl: 'home.html',
    //   controller: 'home'
    // }).when('/login', {
    //   templateUrl: 'login.html',
    //   controller: 'navigation'
    // }).otherwise('/');

    // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  })

  // .run(['$http', '$cookies', function($http, $cookies) {
  //   $http.defaults.transformResponse.unshift(function(data, headers) {
  //     var csrfToken = $cookies['XSRF-TOKEN'];
  //
  //     if (!!csrfToken) {
  //       $http.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  //     }
  //
  //     return data;
  //   });
  // }]);

  // .controller('LoginCtrl1', ['$scope', '$location', function($scope, $location) {
  //   alert('fuck');
  //
  // }])
  ;

})();
