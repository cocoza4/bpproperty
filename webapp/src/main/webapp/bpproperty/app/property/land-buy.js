(function () {

    'use strict';

    var LandBuyDetailResolve = {
        BuyDetails: function($q, $route, Land, LandBuy, Customer) {

            var landBuyCriteria = {
                landId: $route.current.params['landId'],
                buyDetailId: $route.current.params['buyDetailId']
            };

            alert('landId: ' + $route.current.params['landId'] + ', buyDetailId: ' + $route.current.params['buyDetailId']);

            var buyDetail = LandBuy.get(landBuyCriteria);
            var land = Land.get({landId: $route.current.params['landId']});
            var customer = Customer.get({id: buyDetail.customerId});

            return $q.all({buyDetail: buyDetail.$promise, land: land.$promise, customer: customer.$promise});
        }
    };

    angular

        .module('land-buy', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {

             $routeProvider

                 .when('/land/:landId/buyDetail/create', {
                     templateUrl: 'property/land-buy-detail.tpl.html',
                     controller: 'createLandBuyDetailCtrl'
                 })

                 .when('/land/:landId/buyDetail/:buyDetailId', {
                     templateUrl: 'property/land-buy-detail.tpl.html',
                     controller: 'LandBuyDetailCtrl',
                     resolve: LandBuyDetailResolve
                 })

                 .when('/land/:landId/buyDetail', {
                     templateUrl: 'property/land-buy-list.tpl.html',
                     controller: 'landBuyDetailListCtrl'
                 });

         }])

        .controller('LandBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuy', 'Land', 'Customer', 'BuyDetails',
                                            function ($scope, $routeParams, LandBuy, Land, Customer, BuyDetails) {

            $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

            $scope.submit = function () {
                $scope.buyDetail.$update({
                    landId: $routeParams.landId,
                    buyDetailId: $routeParams.buyDetailId
                });
                alert('updated');
            };

            $scope.buyDetail = BuyDetails.buyDetail;
            $scope.land = BuyDetails.land;
            $scope.customer = BuyDetails.customer;

//            LandBuy.get({
//                landId: $routeParams.landId,
//                buyDetailId: $routeParams.buyDetailId
//            }).$promise.then(
//                function(data) {
//                    $scope.buyDetail = data;
//                    $scope.land = Land.get({landId: $routeParams.landId});
//                    $scope.customer = Customer.get({id: data.customerId});
//                },
//                function(error) {}
//            );

        }])

        .controller('createLandBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuy', 'Land', 'Customer',
                                                    function ($scope, $routeParams, LandBuy, Land, Customer) {

            $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

            $scope.submit = function () {
                $scope.buyDetail.$save({
                    landId: $routeParams.landId
                });
                alert('saved')
            };

            $scope.buyDetail = new LandBuy({landId: $routeParams.landId});
            $scope.land = Land.get({landId: $routeParams.landId});

        }])

        .controller('landBuyDetailListCtrl', ['$scope', '$location', '$routeParams', 'LandBuy', function ($scope, $location, $routeParams, LandBuy) {

            $scope.onRecordsPerPageChanged = function() {
                $scope.currentPage = 1;
                $scope.updateLandBuyTable();
            };

            $scope.updateLandBuyTable = function () {

                var criteria = {
                    landId: $routeParams.landId,
                    page: $scope.currentPage - 1, // zero-based page index
                    length: $scope.recordsPerPage
                };

                LandBuy.query(criteria).$promise.then(
                    function (data) {
                        $scope.landBuys = data.content;

                        console.log('[Query LandBuy] - length:' + data.content.length); // TODO: remove this - this is for debugging

                        $scope.totalRecords = data.totalRecords;
                        $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
                        $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;

                    },
                    function (error) {
                        alert('Unable to query from table LandBuy');
                    }
                );
            };

            $scope.redirect = function (buyDetailId) {
                $location.path('/land/' + $routeParams.landId + '/buyDetail/' + buyDetailId);
            };

            $scope.redirectToCreateLandBuyDetailPage = function () {
                $location.path('/land/' + $routeParams.landId + '/buyDetail/create');
            };

            $scope.recordsPerPageList = [10, 25, 50, 100];
            $scope.currentPage = 1;
            $scope.recordsPerPage = 10;
            $scope.updateLandBuyTable();

        }]);

})();