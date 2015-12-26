describe('land-payment-service', function() {

  beforeEach(module('land-payment-service'));

  beforeEach(function() {

    selectedMonth = 2;
    selectedYear = 2015;
    var date = new Date(selectedYear, selectedMonth, 1);
    payFor = date.getTime();

    payment = {
      buyDetailId: 1,
      amount: 10000.40,
      description: 'description'
    };

    installment = {
      buyDetailId: 1,
      payFor: payFor,
      amount: 10000.40,
      description: 'description'
    };

    mockPayments = [
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

    criteria = {
      landId: 1,
      buyDetailId: 1,
    };

  });

  describe('validate getTotalPayment', function() {

    beforeEach(inject(function($injector) {
      PaymentService = $injector.get('PaymentService');
      Payment = $injector.get('Payment');
      $q = $injector.get('$q');
    }));

    it('should return 0 payment', function() {
      expect(PaymentService.getTotalPayment([])).toEqual(0);
    });

    it('should return actual total payment', function() {
      expect(PaymentService.getTotalPayment(mockPayments)).toBeCloseTo(30000.80);
    });

    it('validate create() - should create a new Payment', function() {
      var deferred = $q.defer();
      spyOn(Payment, 'save').and.returnValue(deferred.promise);
      PaymentService.create(criteria, payment);
      expect(Payment.save).toHaveBeenCalledWith(criteria, payment);
      expect(payment.payFor).toBeUndefined();
    });

    it('validate update() - should update a Payment', function() {
      var deferred = $q.defer();
      spyOn(Payment, 'update').and.returnValue(deferred.promise);
      PaymentService.update(criteria, payment);
      expect(Payment.update).toHaveBeenCalledWith(criteria, payment);
      expect(payment.payFor).toBeUndefined();
    });

    it('validate create() - should create a new Intallment', function() {
      var deferred = $q.defer();
      spyOn(Payment, 'save').and.returnValue(deferred.promise);
      PaymentService.create(criteria, installment, selectedMonth, selectedYear);
      expect(Payment.save).toHaveBeenCalledWith(criteria, installment);
      expect(installment.payFor).toEqual(payFor);
    });

    it('validate update() - should update an Intallment', function() {
      var deferred = $q.defer();
      spyOn(Payment, 'update').and.returnValue(deferred.promise);
      PaymentService.update(criteria, installment, selectedMonth, selectedYear);
      expect(Payment.update).toHaveBeenCalledWith(criteria, installment);
      expect(installment.payFor).toEqual(payFor);
    });

  });

});
