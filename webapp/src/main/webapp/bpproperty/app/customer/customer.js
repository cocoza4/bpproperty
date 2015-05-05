(function () {

    'use strict';

    angular

        .module('customer', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/customer', {
                    templateUrl: 'customer/customer-list.tpl.html',
                    controller: 'customerListCtrl'
                })

                .when('/customer/:id', {
                    templateUrl: 'customer/customer-detail.tpl.html',
                    controller: 'customerCtrl'
                })

                .when('/customer/create', {
                    templateUrl: 'customer/customer-detail.tpl.html',
                    controller: 'createCustomerCtrl'
                });

        }])

        .controller('customerCtrl', ['$scope', '$routeParams', 'Customer', function ($scope, $routeParams, Customer) {
            $scope.submit = function () {
                $scope.customer.$update();
                alert('updated');
            };

            $scope.customer = Customer.get({id: $routeParams.id});
        }])

        .controller('createCustomerCtrl', ['$scope', 'Customer', function ($scope, Customer) {
            $scope.submit = function () {
                Customer.save($scope.customer);
                alert('saved');
            };

            $scope.customer = {};
        }])

        .controller('customerListCtrl', ['$scope', '$location', 'Customer', function ($scope, $location, Customer) {

            $scope.redirect = function (url) {
                $location.path(url);
            };

            $scope.onRecordsPerPageChanged = function() {
                $scope.currentPage = 1; // TODO: should remove this - added to prevent calling "updateCustomerTable()" twice
                  $scope.updateCustomerTable();
            };

            $scope.updateCustomerTable = function () {

                var criteria = {
                    page: $scope.currentPage - 1, // zero-based page index
                    length: $scope.recordsPerPage
                };

                Customer.query(criteria).$promise.then(
                    function (data) {
                        $scope.customers = data.content;

                        console.log('[Query Customer] - length:' + data.content.length); // TODO: remove this - this is for debugging

                        $scope.totalRecords = data.totalRecords;
                        $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
                        $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;

                    },
                    function (error) {
                        alert('Unable to query from table Customer');
                    }
                );
            };

            $scope.recordsPerPageList = [10, 25, 50, 100];
            $scope.currentPage = 1;
            $scope.recordsPerPage = 10;
            $scope.updateCustomerTable();

        }]);
})();