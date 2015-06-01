(function () {

    'use strict';

    // Declare app level module which depends on views, and components
    angular

        .module('myApp', [
            'ngRoute',

            'myApp.version',
            'services.breadcrumbs',

            'my-tab', // TODO: remove - currently unused
            'my-tab1',
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

        .controller('appCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
            //$scope.hello = 'hello world!';
            $scope.breadcrumbs = breadcrumbs;
        }])

        .controller('headerCtrl', ['$scope', '$location', function ($scope, $location) {

            $scope.isActive = function (route) {
//        alert($location.path() + ' : ' + route);
                return $location.path().indexOf(route) === 0;
            }

        }])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/land'});
        }]);

})();
