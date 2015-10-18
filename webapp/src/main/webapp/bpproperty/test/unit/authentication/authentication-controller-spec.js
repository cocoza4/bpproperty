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

  beforeEach(inject(function($injector, _$controller_) {
    $window = $injector.get('$window');
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    AuthenticationService = $injector.get('AuthenticationService');

  }));

  describe('SessionExpiredModalCtrl', function() {

    beforeEach(inject(function($injector, _$interval_) {

      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
      $interval = jasmine.createSpy('$interval', _$interval_).and.callThrough();

      SessionExpiredModalCtrl = $controller('SessionExpiredModalCtrl', {
        $scope: $scope,
        $interval: $interval,
        $location: $location,
        $modalInstance: $modalInstance,
        AuthenticationService: AuthenticationService
      });
      $scope.$digest();
    }));

    it('init', function() {
      expect($scope.counter).toEqual(60);
    });

    it('validate $interval', function() {
      $interval.flush(1000);
      expect($scope.counter).toEqual(59);
    });

    it('validate $interval - more than 60s elapsed', function() {
      $interval.flush(65000);
      expect($scope.counter).toEqual(0);
    });

    it('validate $scope.stayLogggedIn()', function() {
      spyOn(AuthenticationService, 'heartbeat');
      spyOn($interval, 'cancel');
      $scope.stayLogggedIn();
      expect($interval.cancel).toHaveBeenCalled();
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(AuthenticationService.heartbeat).toHaveBeenCalled();
    });

    it('validate $interval - final', function() {
      spyOn($location, 'path');
      SessionExpiredModalCtrl = $controller('SessionExpiredModalCtrl', {
        $scope: $scope,
        $interval: $interval,
        $location: $location,
        $modalInstance: $modalInstance,
        AuthenticationService: AuthenticationService
      });

      $interval.flush(60000);
      $scope.$digest();
      expect($scope.counter).toEqual(0);
      expect($location.path).toHaveBeenCalledWith('/logout');
    });

  });

  describe('LogoutCtrl', function() {

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

  describe('LoginCtrl', function() {

    it('AuthenticationService.clearCredentials() should be called once', function() {

      spyOn(AuthenticationService, 'clearCredentials');

      loginCtrl = $controller('LoginCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        AuthenticationService: AuthenticationService,
      });

      expect(AuthenticationService.clearCredentials).toHaveBeenCalled();
    });

    describe('Login', function() {

      beforeEach(function() {
        spyOn(AuthenticationService, 'clearCredentials');

        loginCtrl = $controller('LoginCtrl', {
          $scope: $scope,
          $window: $window,
          $location: $location,
          AuthenticationService: AuthenticationService,
        });
      });

      it('validate login', function() {
        spyOn(AuthenticationService, 'login');

        $scope.username = 'username';
        $scope.password = 'password';

        $scope.login();

        expect(AuthenticationService.login).toHaveBeenCalledWith($scope.username,
          $scope.password, loginCtrl.callback);
      });

      it('login callback - should return error messsage', function() {
        spyOn(AuthenticationService, 'setCredentials');
        loginCtrl.callback({
          message: 'error message'
        });
        expect($scope.error).toEqual('error message');
        expect(AuthenticationService.setCredentials).not.toHaveBeenCalled();
      });

      it('login callback - should return success', function() {

        $scope.username = 'username';
        $scope.password = 'password';

        spyOn(AuthenticationService, 'setCredentials');
        spyOn(loginCtrl, 'redirectToHome');

        loginCtrl.callback({
          success: true
        });

        expect($scope.error).toBeUndefined();
        expect(loginCtrl.redirectToHome).toHaveBeenCalled();
        expect(AuthenticationService.setCredentials).toHaveBeenCalledWith($scope.username, $scope.password);
      });

    });



  });

});
