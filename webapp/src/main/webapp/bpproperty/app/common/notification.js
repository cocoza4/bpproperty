(function() {

  'use strict';

  angular.module('my-notification', [])

  .service('NotificationService', function() {

    this.notify = function(notification) {

      var type = notification.type;

      switch (type) {
        case 'success':
          $.bootstrapGrowl('<strong>Success!</strong> ' + notification.msg, {
            type: 'success',
            delay: 3000,
            allow_dismiss: true,
            stackup_spacing: 10,
            width: 300
          });
          break;
        case 'error':
          $.bootstrapGrowl('<strong>Error!</strong> ' + notification.msg, {
            type: 'danger',
            delay: 3000,
            allow_dismiss: true,
            stackup_spacing: 10,
            width: 300
          });
      }
    };

  });

})();
