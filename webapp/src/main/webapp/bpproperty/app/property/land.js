(function () {

    'use strict';

    var LandListResolve = {
        Lands: function(LandService) {
            var criteria = {
                page: 0, // zero-based page index
                length: 10
            };
            return LandService.query(criteria).$promise;
        }
    };

    angular

        .module('land', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/land', {

                    templateUrl: 'property/land-list.tpl.html',
                    controller: 'LandListCtrl',
                    resolve: LandListResolve
                })

                .when('/land/create', {
                    templateUrl: 'property/land-detail.tpl.html',
                    controller: 'createLandCtrl'
                })

                .when('/land/:landId', {
                    templateUrl: 'property/land-detail.tpl.html',
                    controller: 'landDetailCtrl'
                })

                .otherwise({
                    redirectTo: '/land'
                });

        }])

        .controller('createLandCtrl', ['$scope', 'Land', function ($scope, Land) {

            $scope.submit = function () {
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

        .controller('LandListCtrl', ['$scope', '$location', 'LandService', 'Lands', function ($scope, $location, LandService, Lands) {

            $scope.redirect = function (url) {
                $location.path(url);
            };

            $scope.onRecordsPerPageChanged = function() {
                $scope.currentPage = 1;
                $scope.updateLandTable();
            };

            $scope.updateLandTable = function () {

                var criteria = {
                    page: $scope.currentPage - 1, // zero-based page index
                    length: $scope.recordsPerPage
                };

                LandService.query(criteria).$promise.then(
                    function (data) {
                        $scope.lands = data.content;

                        console.log('[Query Land] - length:' + data.content.length); // TODO: remove this - this is for debugging

                        $scope.totalRecords = data.totalRecords;
                        $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
                        $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;

                    },
                    function (error) {
                        alert('Unable to query from table Land');
                    }
                );
            };

            $scope.recordsPerPageList = [10, 25, 50, 100];
            $scope.currentPage = 1;
            $scope.recordsPerPage = 10;

            $scope.lands = Lands.content;
            $scope.totalRecords = Lands.totalRecords;
            $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
            $scope.endIndex = $scope.startIndex + Lands.totalDisplayRecords - 1;
        }])

        .controller('landDetailCtrl', ['$scope', '$routeParams', 'Land', function ($scope, $routeParams, Land) {

            $scope.submit = function () {
                alert($scope.land.name);
                $scope.land.$update();
                alert('updated');
            };

            $scope.land = Land.get({landId: $routeParams.landId});

        }]);

})();