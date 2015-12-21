(function() {

  'use strict';

  angular
    .module('bpproperty-cache', [])

  .service('BPPropertyCache', ['$cacheFactory', function($cacheFactory) {

    this.getCurrentLandBuyDetail = function() {
      var cache = landCache.get('land-buy-detail');
      return cache;
    };

    this.getCurrentLand = function() {
      var cache = landCache.get('land');
      return cache;
    };

    this.updateLand = function(land) {
      landCache.put('land', land);
    };

    this.updateLandBuyDetail = function(landBuyDetail) {
      landCache.put('buyDetail', landBuyDetail);
    };

    var landCache = $cacheFactory.get('land-cache');
    if (!landCache) {
      landCache = $cacheFactory('land-cache');
    }

  }]);

})();
