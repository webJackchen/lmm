'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:kdoTree
 * @description
 * # kdoTree
 */
angular.module('lanhKdesignApp')
    .value('treeCfg', {
        useall: false,
        singleAll: false,
        childName: 'children'
    })
    .directive('kdoTree', ['$timeout', '$compile', 'treeCfg',
        function ($timeout, $compile, treeCfg) {
            return {
                restrict: "EA",
                replace: true,
                scope: {
                    source: '='
                },
                template: '<ul class="content-list"><tree-item ng-repeat="dataItem in source" data="dataItem" ></tree-item></ul>',
                link: function (scope, element, attrs) {
                    var childName = attrs.childName,
                        useall = scope.$eval(attrs.useall),
                        singleAll = scope.$eval(attrs.singleAll);
                    if (childName) treeCfg.childName = childName;
                    if (useall) treeCfg.useall = useall;
                    if (singleAll) treeCfg.singleAll = singleAll;
                    //var attrArray = Object.keys(attrs),
                    //    cfgAttrs = Object.keys(treeCfg);
                    //for (var i = 0; i < attrArray.length; i++) {
                    //    var attrName = attrArray[i];
                    //    if (cfgAttrs.indexOf(attrName) >= 0) {
                    //        treeCfg[attrName] = scope.$eval(attrs[attrName]) === undefined ? attrs[attrName] : scope.$eval(attrs[attrName]);
                    //    }
                    //}
                }
            };
        }])
    .directive('treeItem', ['$compile', 'utilsService', 'treeCfg',
        function ($compile, utilsService, treeCfg) {
            return {
                restrict: "EA",
                replace: true,
                scope: {
                    data: '='
                },
                template: '<li class="checkbox"  ng-click="itemSelect($event)">'
                    + '<label><input type="checkbox" ng-model="data.checked"/> {{data.allTitle.text||data.name}}</label>'
                    + '</li>',
                link: function (scope, element, attrs) {
                    var childName = treeCfg.childName,
                        childData = scope.data[childName],
                        singleAll = treeCfg.singleAll;

                    if (angular.isArray(childData)) {
                        element.append('<kdo-tree source="data.' + childName + '"></kdo-tree>');
                        $compile(element.contents())(scope);
                    }

                    scope.itemSelect = function ($event) {
                        if ($event.stopPropagation) $event.stopPropagation();
                        if (childData) {
                            if (singleAll && (scope.data.name === '全选' || scope.data.allTitle.text === '全选')) {
                                utilsService.loop(scope.data, childName, function (currentItem, nextItem) {
                                    nextItem.checked = currentItem.checked = scope.data.checked;
                                });
                            }
                            else {
                                if (treeCfg.useall) {
                                    utilsService.loop(scope.data, childName, function (currentItem, nextItem) {
                                        nextItem.checked = currentItem.checked = scope.data.checked;
                                    });
                                }
                            }
                        };
                    }
                }
            }
        }]);