'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:adManage
 * @description
 * # admanage
 */
angular.module('lanhKdesignApp')
  .directive('adManage', ["$http", "$timeout", "lanhWindow", "$compile", "messengerService", "loginService",
      function ($http, $timeout, lanhWindow, $compile, messengerService, loginService) {
          return {
              template: '<button class="btn btn-primary" ng-click="selectAdLibrary()">{{ _title }}</button>',
              restrict: 'E',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs:
                        title           //按钮名称
                        callback        //点击确定回调事件名称 (仅仅是名称，不加括号）
                        value           //选中的值，用于定位上次选中的节点
                  */

                  $scope._title = attrs.title || "广告管理";

                  $scope.tpl_status = {
                      kPlusPath: loginService.getLoginInfo().kplusPath
                  }

                  $scope.currentNode = null;

                  $scope.selectAdLibrary = function () {
                      $http.get("/views/common/admanage.tpl.html")
                          .success(function (result) {
                              lanhWindow.create({
                                  title: "广告图库",
                                  template: result,
                                  open: function () {
                                      $timeout(function () {
                                          $scope.initTree()
                                      });
                                  }
                              }, $scope);
                          });
                  }

                  $scope.initTree = function () {
                      //$http.get(lanh.apiPath + "proxy?catgeoryList=true&catgeoryType=ad")
                      $http.get(lanh.apiPath + "proxy?isSection=true")
                        .success(function (result) {
                            if (!result || !result.jsonText) {
                                return;
                            }
                            var _result = JSON.parse(result.jsonText),
                                _adList = $.grep(_result.channel.item, function (_item) { return _item.module == "ad" });
                            var treeData = [];

                            var _eachTreeNode = function (node, childs) {
                                if (!!childs) {
                                    var _childs = childs;
                                    if (!angular.isArray(childs)) {
                                        _childs = [childs];
                                    }
                                    $.each(_childs, function (i, _child) {
                                        var _node = {
                                            "text": _child.allTitle.text,
                                            "icon": "iconfont icon-folder",
                                            "children": [],
                                            "data": _child,
                                            "state": { "selected": attrs.value == "<channel>" + _child.alias + "</channel><model>ad</model>" }
                                        }
                                        node.children.push(_node);
                                        _eachTreeNode(_node, _child.item)
                                    });
                                }
                            }

                            $.each(_adList, function (i, adCategory) {
                                var node = {
                                    "text": adCategory.allTitle.text,
                                    "state": {
                                        "opened": true,
                                        "selected": attrs.value == "<channel>" + adCategory.alias + "</channel><model>ad</model>"
                                    },
                                    "icon": "iconfont icon-folder",
                                    "children": [],
                                    "data": adCategory
                                }
                                _eachTreeNode(node, adCategory.item);
                                treeData.push(node);
                            });
                            var $tree = $("#adTree");
                            $tree.html("<div></div>");
                            $tree.find("div").jstree({
                                'core': {
                                    'data': treeData
                                }
                            });
                            $tree.find("div").off("changed.jstree")
                                .on("changed.jstree", function (e, data) {
                                    var currentId = data.selected[0],
                                        alias = null;

                                    if (!$scope.currentNode || $scope.currentNode.selectedId !== currentId) {
                                        $scope.currentNode = { selectedId: currentId }
                                    } else return;

                                    if (data.node) {
                                        alias = data.node.data.alias;
                                    }
                                    else if (!!attrs.value) {
                                        alias = attrs.value.substring(attrs.value.indexOf("<channel>") + 9);
                                        alias = alias.substring(0, alias.indexOf("</channel>"));
                                    }
                                    console.log(alias)
                                    if (!alias) return;

                                    $scope.currentNode.alias = alias;

                                    $http.get(lanh.apiPath + "proxy?contentList=true&contentType=ad&top=0&index=0&length=1000&size=10000&order=id_desc&categories=" + alias)
                                      .success(function (result) {
                                          if (!result || !result.jsonText) {
                                              return;
                                          }
                                          var _result = JSON.parse(result.jsonText),
                                              kplusHost = 'http://' + _result.channel.host;
                                          if (!!_result.channel.item && _result.channel.item != "0") {
                                              var _items = _result.channel.item;
                                              if (!angular.isArray(_result.channel.item)) {
                                                  _items = [_result.channel.item];
                                              }
                                              for (var i = 0, ii = _items.length; i < ii; i++) {
                                                  var dataItem = _items[i],
                                                      dataImage = dataItem.image;
                                                  //数据链接地址
                                                  if (dataItem.url) dataItem.url = kplusHost + dataItem.url;
                                                  //数据图片链接地址
                                                  if (dataImage) dataImage.url = kplusHost + dataImage.url;
                                              }

                                              $scope.currentNode.data = _items;
                                          }
                                      });
                                });
                        });
                  }

                  $scope.btnRefresh = function () {
                      $scope.currentNode = null;
                      $scope.initTree();
                  }

                  $scope.btnSave = function ($event) {
                      $scope.currentNode.dataConfig = { $dataconfig: "<channel>" + $scope.currentNode.alias + "</channel><model>ad</model>", $module: "ad" }
                      $scope.$emit(attrs.callback, $scope.currentNode);
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }
              }
          };
      }
  ]);
