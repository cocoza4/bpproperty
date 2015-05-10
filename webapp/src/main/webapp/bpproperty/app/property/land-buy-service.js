(function () {

    'use strict';

    angular

        .module('land-buy-service', ['ngResource'])

        .factory('LandBuy', ['$resource', '$location', function ($resource, $location) {
            return $resource(
                '/bpproperty/api/land/:landId/buyDetail/:buyDetailId',
                {
                    landId: '@landId',
                    buyDetailId: '@buyDetailId'
                },
                {
                    'update': {method: 'PUT'},
                    'query': {method: 'GET', params: {landId: '@landId', page: '@page', length: '@length'}}
//                    'query': {method: 'GET', params: {landId: '@landId', page: '@page', length: '@length'}}
                });
        }]);


})();