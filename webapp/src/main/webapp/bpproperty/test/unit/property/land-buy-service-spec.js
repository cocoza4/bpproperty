describe('land-buy', function() {

  beforeEach(module('land-buy-service'));

  beforeEach(function() {
    mockInstallmentBuyDetailBO = {
      "id": 1,
      "landId": 1,
      "buyType": "INSTALLMENT",
      "buyerFirstName": "firstname1",
      "buyerLastName": "lastname1",
      "downPayment": 50000,
      "buyPrice": 250000,
      "annualInterest": 8,
      "totalPayment": 100000,
      "yearsOfInstallment": 5,
      "description": null,
      "area": {
        "rai": 10,
        "yarn": 5,
        "tarangwa": 10
      },
      "createdTime": 1446183913864
    };
    mockCashBuyDetailBO = {
      "id": 2,
      "landId": 1,
      "buyType": "CASH",
      "buyerFirstName": "firstname2",
      "buyerLastName": "lastname2",
      "downPayment": null,
      "buyPrice": 10.8,
      "totalPayment": 10.8,
      "annualInterest": null,
      "yearsOfInstallment": null,
      "description": null,
      "area": {
        "rai": 5,
        "yarn": 5,
        "tarangwa": 10
      },
      "createdTime": 1446183913864
    };
  });

  describe('validate getUnpaidDebt()', function() {

    it('INSTALLMENT - happy path', function() {
      var actual = LandBuyService.getUnpaidDebt(mockInstallmentBuyDetailBO);
      expect(actual).toEqual(100000);
    });

    it('CASH - happy path', function() {
      var actual = LandBuyService.getUnpaidDebt(mockCashBuyDetailBO);
      expect(actual).toEqual(0);
    });

    it('INSTALLMENT - no downPayment', function() {
      mockInstallmentBuyDetailBO.downPayment = null;
      var actual = LandBuyService.getUnpaidDebt(mockInstallmentBuyDetailBO);
      expect(actual).toEqual(150000);
    });

  });

  describe('validate getInstallmentPerMonth()', function() {

    it('INSTALLMENT - happy path', function() {
      var actual = LandBuyService.getInstallmentPerMonth(mockInstallmentBuyDetailBO);
      expect(actual).toBeCloseTo(4666.66, 1);
    });

    it('INSTALLMENT - null downPayment', function() {
      mockInstallmentBuyDetailBO.downPayment = null;
      var actual = LandBuyService.getInstallmentPerMonth(mockInstallmentBuyDetailBO);
      expect(actual).toBeNull();
    });

    it('INSTALLMENT - null annualInterest', function() {
      mockInstallmentBuyDetailBO.annualInterest = null;
      var actual = LandBuyService.getInstallmentPerMonth(mockInstallmentBuyDetailBO);
      expect(actual).toBeNull();
    });

    it('INSTALLMENT - null yearsOfInstallment', function() {
      mockInstallmentBuyDetailBO.yearsOfInstallment = null;
      var actual = LandBuyService.getInstallmentPerMonth(mockInstallmentBuyDetailBO);
      expect(actual).toBeNull();
    });

    it('CASH', function() {
      var actual = LandBuyService.getInstallmentPerMonth(mockCashBuyDetailBO);
      expect(actual).toBeNull();
    });

  });

});
