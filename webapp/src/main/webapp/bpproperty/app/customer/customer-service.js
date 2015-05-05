(function () {

    'use strict';

    angular

        .module('customer-service', ['ngResource'])

        .factory('Customer', ['$resource', function ($resource) {

            return $resource(
                '/bpproperty/api/customer/:id',
                {
                    id: '@id'
                },
                {
                    'update': {method: 'PUT'},
                    'query': {method: 'GET', params: {page: '@page', length: '@length'}}
                });
        }]);


})();