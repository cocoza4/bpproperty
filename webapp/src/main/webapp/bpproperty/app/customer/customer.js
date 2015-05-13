(function () {

    'use strict';

    var CustomerListResolve = {
        Customers: function(Customer) {
            var criteria = {
                page: 0, // zero-based page index
                length: 10
            };
            return Customer.query(criteria).$promise;
        }
    };

    angular

        .module('customer', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/customer', {
                    templateUrl: 'customer/customer-list.tpl.html',
                    controller: 'CustomerListCtrl',
                    resolve: CustomerListResolve
                })

                .when('/customer/create', {
                    templateUrl: 'customer/customer-detail.tpl.html',
                    controller: 'createCustomerCtrl'
                })

                .when('/customer/:id', {
                    templateUrl: 'customer/customer-detail.tpl.html',
                    controller: 'customerCtrl'
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

        .controller('CustomerListCtrl', ['$scope', '$location', 'Customer', 'Customers', function ($scope, $location, Customer, Customers) {

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
                        self.updateScope($scope, data);
                        console.log('[Query Customer] - length:' + data.content.length);
                    },
                    function (error) {
                        alert('Unable to query from table Customer');
                    }
                );
            };

            var self = this;

            this.updateScope = function(scope, data) {
                $scope.customers = data.content;
                $scope.totalRecords = data.totalRecords;
                $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
                $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
            }

            $scope.recordsPerPageList = [10, 25, 50, 100];
            $scope.currentPage = 1;
            $scope.recordsPerPage = 10;

            this.updateScope($scope, Customers);

        }]);
})();