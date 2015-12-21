describe('land-payment-service', function() {

  var mockPayments = [
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

  beforeEach(module('land-payment-service'));

  describe('validate getTotalPayment', function() {

    beforeEach(inject(function($injector) {
      PaymentService = $injector.get('PaymentService');
    }));

    it('should return 0 payment', function() {
      expect(PaymentService.getTotalPayment([])).toEqual(0);
    });

    it('should return actual total payment', function() {
      expect(PaymentService.getTotalPayment(mockPayments)).toBeCloseTo(30000.80);
    });

  });

});
