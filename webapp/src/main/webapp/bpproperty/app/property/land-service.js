(function () {

    'use strict';

    angular

        .module('land-service', ['ngResource'])

        .service('LandService', ['$q', 'Land', function($q, Land) {

            this.query = function(criteria) {
//                var def = $q.defer();
                return Land.query(criteria);
            };

        }])

        .factory('Land', ['$resource', '$location', function ($resource, $location) {
            return $resource(
                '/bpproperty/api/land/:landId',
                {
                    landId: '@landId'
                },
                {
                    'update': {method: 'PUT'},
                    'query': {method: 'GET', params: {page: '@page', length: '@length'}}
                });
        }]);


})();