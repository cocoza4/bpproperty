describe('Authentication', function() {

  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', {
        location: {
          href: null
        }
      });
    });

    module('authentication')
  });

  describe('LogoutCtrl', function() {

    var AuthenticationService, $window;

    beforeEach(inject(function($injector, _$controller_) {

      $controller = _$controller_;
      $window = $injector.get('$window');
      $location = $injector.get('$location');
      AuthenticationService = $injector.get('AuthenticationService');

    }));

    it('should logout', function() {

      spyOn(AuthenticationService, 'logout');

      var logoutCtrl = $controller('LogoutCtrl', {
        $window: $window,
        $location: $location,
        AuthenticationService: AuthenticationService,
      });

      expect(AuthenticationService.logout).toHaveBeenCalledWith(logoutCtrl.callback);
    });

    it('logout callback should clear credentials and redirect', function() {

      spyOn(AuthenticationService, 'clearCredentials');

      var logoutCtrl = $controller('LogoutCtrl', {
        $window: $window,
        $location: $location,
        AuthenticationService: AuthenticationService,
      });

      expect($window.location.href).toBeNull();

      logoutCtrl.callback();

      expect($window.location.href).not.toBeNull();
      expect(AuthenticationService.clearCredentials).toHaveBeenCalled();
    });

  });


// TODO: complete LoginCtrl unit test
  describe('LoginCtrl', function() {

    var $controller;
    var loginCtrl, $window, $location, $rootScope, $scope;

    var AuthenticationService = {
      clearCredentials: function() {}
    };

    beforeEach(inject(function($injector, _$controller_) {

      $controller = _$controller_;
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $window = $injector.get('$window');
      $location = $injector.get('$location');



    }));

    it('AuthenticationService.clearCredentials() should be called once', function() {

      spyOn(AuthenticationService, 'clearCredentials');

      loginCtrl = $controller('LoginCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        AuthenticationService: AuthenticationService,
      });

      $scope.$digest();
      // console.log(AuthenticationService.clearCredentials);
      expect(AuthenticationService.clearCredentials).toHaveBeenCalled();
    });

    describe('Login', function() {

    });



  });

});
