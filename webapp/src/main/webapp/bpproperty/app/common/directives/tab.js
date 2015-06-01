(function () {

    'use strict';

    angular

        .module('my-tab1', [])

        .directive('myShowtab', function () {
            return {
                link: function (scope, element, attrs) {

                    element.click(function (e) {
//                        var url = $(element).attr("href");
//                        alert(url);
                        e.preventDefault();
                        $(element).tab('show');
                    });
                }

            };
        });

})();
