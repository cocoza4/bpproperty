(function () {

  'use strict';

  angular

  .module('land', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

    .when('/land', {

        templateUrl: 'property/land-list.tpl.html',
        controller: 'landListCtrl'
        //TODO: add "resolve"

    })

    .when('/land/create', {
        templateUrl: 'property/land-detail.tpl.html',
        controller: 'createLandCtrl'
    })

    .when('/land/:landId', {
        templateUrl: 'property/land-detail.tpl.html',
        controller: 'landDetailCtrl'
    })

    .when('/land/:landId/buyDetail/create', {
        templateUrl: 'property/land-buyer-detail.tpl.html',
        controller: 'createLandBuyDetailCtrl'
    })

    .when('/land/:landId/buyDetail/:buyDetailId', {
        templateUrl: 'property/land-buyer-detail.tpl.html',
        controller: 'landBuyDetailCtrl'
    })

    .when('/land/:landId/buyDetail', {
        templateUrl: 'property/land-buyers.tpl.html',
        controller: 'landBuyDetailListCtrl'
    })

    .otherwise({
        redirectTo: '/land'
    });

  }])

  .controller('landBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuy', function($scope, $routeParams, LandBuy) {

      $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

      $scope.submit = function() {
        $scope.buyDetail.$update({landId: $routeParams.landId,
                                 buyDetailId: $routeParams.buyDetailId
                                });
        alert('updated');
      };

      $scope.buyDetail = LandBuy.get({landId: $routeParams.landId,
                                        buyDetailId: $routeParams.buyDetailId
                                    });

  }])


  .controller('createLandBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuy', function($scope, $routeParams, LandBuy) {

    $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

    $scope.submit = function() {
        $scope.buyDetail.$save({
                                    landId: $routeParams.landId,
                                buyDetailId: $routeParams.buyDetailId});
        alert('saved')
    };
    $scope.buyDetail = new LandBuy({propertyId: $routeParams.landId});
  }])

  .controller('landBuyDetailListCtrl', ['$scope', '$location', '$routeParams', 'LandBuy', function($scope, $location, $routeParams, LandBuy) {

    $scope.landPurchases = LandBuy.query({landId: $routeParams.landId});

    $scope.pageSizes = [10, 25, 50, 100];
    $scope.pageSize = 10;
    $scope.currentPage = 1;

    $scope.redirect = function(buyDetailId) {
        $location.path('/land/' + $routeParams.landId + '/buyDetail/' + buyDetailId);
    };

    $scope.redirectToCreateLandBuyDetailPage = function() {
        $location.path('/land/' + $scope.landId + '/buyDetail/create');
    };

  }])

  .controller('createLandCtrl', ['$scope', 'Land', function($scope, Land) {

    $scope.submit = function() {
      if ($scope.land.name) {
        alert($scope.land.name);
        Land.save($scope.land);
        alert('saved');
      } else {
        alert('undefined');
      }
    };

    $scope.land = {};

  }])

  .controller('landListCtrl', ['$scope', '$location', 'Land', function($scope, $location, Land) {

    $scope.redirect = function(url) {
      $location.path(url);
    }

    $scope.updateLandTable = function() {
//      alert($scope.pageSize);
    }

    $scope.lands = Land.query();
    $scope.pageSizes = [10, 25, 50, 100];
    $scope.pageSize = 10;
    $scope.currentPage = 1;

  }])

  .controller('landDetailCtrl', ['$scope', '$routeParams', 'Land', function($scope, $routeParams, Land) {

    $scope.submit = function() {
      alert($scope.land.name);
      $scope.land.$update();
      alert('updated');
    };

    $scope.land = Land.get({landId: $routeParams.landId});

  }]);

})();