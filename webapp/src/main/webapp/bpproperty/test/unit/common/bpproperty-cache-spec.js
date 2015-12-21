describe('bpproperty-cache', function() {

  beforeEach(module('bpproperty-cache'));
  // beforeEach(module('land-buy-service'));

  describe('BPPropertyCache', function() {

    beforeEach(inject(function($injector) {
      BPPropertyCache = $injector.get('BPPropertyCache');
    }));

    it('init', function() {
      alert(BPPropertyCache.getCurrentLand());
      // LandBuyService.getUnpaidDebt(null);
    });


  });

});
