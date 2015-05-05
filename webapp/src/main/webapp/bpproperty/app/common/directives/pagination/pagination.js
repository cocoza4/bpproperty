(function () {

    'use strict';

    angular
        .module('my-pagination', [])

        .directive('myPagination', ['$parse', 'paginationConfig', function ($parse, paginationConfig) {
            return {
                restrict: 'E',
                scope: {
                    totalRecords: '=',
                    firstText: '@',
                    lastText: '@'
                },
                require: ['myPagination', '?ngModel'],
                controller: 'paginationCtrl',
                templateUrl: 'common/directives/pagination/pagination.tpl.html',
                link: function (scope, elements, attrs, ctrls) {
                    var paginationCtrl = ctrls[0],
                        ngModelCtrl = ctrls[1];

                    if (!ngModelCtrl) {
                        return; // do nothing if no ng-model
                    }

                    var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize;

                    scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;

                    paginationCtrl.init(ngModelCtrl, paginationConfig);

                    // Create page object used in template
                    function makePage(number, text, isActive) {
                        return {
                            number: number,
                            text: text,
                            active: isActive
                        };
                    }

                    function getPages(currentPage, totalPages) {
                        var pages = [];

                        // Default page limits
                        var startPage = 1, endPage = totalPages;
                        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

                        // recompute if maxSize
                        if (isMaxSized) {

                            // Current page is displayed in the middle of the visible ones
                            startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                            endPage = startPage + maxSize - 1;

                            // Adjust if limit is exceeded
                            if (endPage > totalPages) {
                                endPage = totalPages;
                                startPage = endPage - maxSize + 1;
                            }
                        }

                        // Add page number links
                        for (var number = startPage; number <= endPage; number++) {
                            var page = makePage(number, number, number === currentPage);
                            pages.push(page);
                        }

                        return pages;
                    }

                    var originalRender = paginationCtrl.render;
                    paginationCtrl.render = function () {
                        originalRender();
                        if (scope.page > 0 && scope.page <= scope.totalPages) {
                            scope.pages = getPages(scope.page, scope.totalPages);
                        }
                    };
                }
            };
        }])

        .controller('paginationCtrl', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {

            var self = this,
                ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl

            this.init = function (_ngModelCtrl, config) {
                ngModelCtrl = _ngModelCtrl;
                this.config = config;

                ngModelCtrl.$render = function () {
                    self.render();
                };

                if ($attrs.recordsPerPage) {
                    $scope.$parent.$watch('recordsPerPage', function (value) {
                        self.recordsPerPage = parseInt(value);
                        $scope.totalPages = self.calculateTotalPages();
                    });
                } else {
                    this.recordsPerPage = config.recordsPerPage;
                }

                $scope.$watch('totalRecords', function () {
                    $scope.totalPages = self.calculateTotalPages();
                });

                $scope.$watch('totalPages', function (value) {
                    if ($scope.page > value) {
                        $scope.selectPage(value);
                    } else {
                        ngModelCtrl.$render();
                    }
                });
            };

            this.calculateTotalPages = function () {
                var totalPages = this.recordsPerPage < 1 ? 1 : Math.ceil($scope.totalRecords / this.recordsPerPage);
                return Math.max(totalPages || 0, 1);
            };

            this.render = function () {
                $scope.page = parseInt(ngModelCtrl.$viewValue) || 1;
            };

            $scope.selectPage = function (page, evt) {
                if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
                    if (evt && evt.target) {
                        evt.target.blur();
                    }
                    ngModelCtrl.$setViewValue(page);
                    ngModelCtrl.$render();
                }
            };

            $scope.getText = function (key) {
                return $scope[key + 'Text'] || self.config[key + 'Text'];
            };
            $scope.noPrevious = function () {
                return $scope.page === 1;
            };
            $scope.noNext = function () {
                return $scope.page === $scope.totalPages;
            };

        }])

        .constant('paginationConfig', {
            maxSize: 5,
            recordsPerPage: 10,
            firstText: '<<',
            lastText: '>>',
            boundaryLinks: true
        });

})();