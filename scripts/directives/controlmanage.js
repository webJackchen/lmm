'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:controlManage
 * @description
 * # controlManage
 */
angular.module('lanhKdesignApp')
    .directive('controlManage', ["$compile", "baseService", "$http", "$timeout", "history",
        function($compile, baseService, $http, $timeout, history) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                link: function postLink($scope, $element, attrs) {
                    var _data = angular.copy($scope.$parent[attrs.model]);
                    for (var property in _data) {
                        $scope[property] = _data[property];
                    }
                    $scope._panelId = $scope.controlId || "control_" + Date.now();

                    var _buildTemplate = function(isRewrite) {
                        var _template = $($scope.template.html).append("<style>" + $scope.template.css.replace(/_panelId_/g, $scope._panelId) + "</style>" + "<script type=\"text/javascript\">" + $scope.template.js.replace(/_panelId_/g, $scope._panelId) + "</script>");

                        //absolute
                        $element = $compile("<div id=\"{{_panelId}}\" style=\"width: 100%; height: 100%;\">" + _template.prop("outerHTML") + "</div>")($scope);

                        $timeout(function() {
                            $scope.$parent.appendToElement($element, attrs.model, isRewrite);
                        });
                    }

                    _buildTemplate(false);

                    var hover = null;
                    var reload = function (e, data) {
                        for (var property in data) {
                            $scope[property] = data[property];
                            $scope.$parent.model[$scope._panelId][property] = data[property];
                        }
                        _buildTemplate(true);
                        if (!!hover) clearTimeout(hover);
                        hover = setTimeout(function () {
                            $scope.$apply(function () {
                                history.log();
                            });
                        }, 100);
                    }
                    $scope.$on("framework.setting." + $scope._panelId, reload);
                    $scope.$on("framework.setting.reload.template." + $scope._panelId, function () {
                        _buildTemplate(true);
                    });
                    $(document).on("framework.resized." + $scope._panelId, reload);
                }
            };
        }
    ]);
