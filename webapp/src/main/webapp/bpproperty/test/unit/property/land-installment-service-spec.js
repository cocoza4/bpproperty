describe('land-installment-service', function() {

  var mockInstallments = [
    {
      buyDetailId: 1,
      payFor: 1212312,
      amount: 10000.40,
      description: 'description'
    },
    {
      buyDetailId: 2,
      payFor: 1212312,
      amount: 20000.40,
      description: 'description'
    },
  ];

  beforeEach(module('land-installment-service'));

  describe('validate getTotalPayment', function() {

    beforeEach(inject(function($injector) {
      InstallmentService = $injector.get('InstallmentService');
    }));

    it('should return 0 payment', function() {
      expect(InstallmentService.getTotalPayment([])).toEqual(0);
    });

    it('should return actual total payment', function() {
      expect(InstallmentService.getTotalPayment(mockInstallments)).toBeCloseTo(30000.80);
    });

  });

});
