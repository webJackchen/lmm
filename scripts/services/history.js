'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.history
 * @description
 * # history
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
.service('history',
    function () {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var self = this,
            banLog = 0;   //设定禁止Log的次数, (每次记录log将会先判断该字段是否允许记录log. 主要用于系统后台操作时,禁止使用log.)

        self.attachScope = function ($scope) {
            self.$scope = $scope;
            self.$scope.$root._history = {
                array: [null],
                index: 0
            }
        }

        var _clear = function (models) {
            self.$scope.$root._history = {
                array: [angular.copy(models)],
                index: 0
            }
        }

        self.clear = function () {
            _clear(null);
        }

        self.reload = function (models) {
            _clear(models);
        }

        self.log = function () {
            if (banLog != 0) {
                banLog--;
                return;
            }
            self.$scope.$root._history.index++;

            self.$scope.$root._history.array[self.$scope.$root._history.index] = angular.copy(self.$scope.model);

            var delNum = self.$scope.$root._history.array.length - (self.$scope.$root._history.index + 1);
            for (var i = 0; i < delNum; i++) {
                self.$scope.$root._history.array.pop();
            }
            //console.log(self.$scope.$root._history.array);
        }

        var _diffModels = function (modelRevert) {
            var modelCurrent = angular.copy(self.$scope.model);
            var _diff = {
                "current": [],
                "revert": [],
                "create": [],
                "update": [],
                "delete": []
            }
            for (var key in modelCurrent) {
                _diff.current.push({
                    controlId: key,
                    value: JSON.stringify(modelCurrent[key])
                });
            }
            for (var key in modelRevert) {
                _diff.revert.push({
                    controlId: key,
                    value: JSON.stringify(modelRevert[key])
                });
            }

            //create: 恢复时需要添加的元素
            $.each(_diff.revert, function (i, item) {
                if ($.grep(_diff.current, function (n) { return n.controlId == item.controlId }).length == 0) {
                    _diff.create.push(JSON.parse(item.value));
                }
            });

            //delete: 恢复时需要删除的元素
            $.each(_diff.current, function (i, item) {
                if ($.grep(_diff.revert, function (n) { return n.controlId == item.controlId }).length == 0) {
                    _diff.delete.push(JSON.parse(item.value));
                }
            });

            //update: 恢复时需要更新的元素
            $.each(_diff.revert, function (i, item) {
                var item2 = $.grep(_diff.current, function (n) { return n.controlId == item.controlId });
                if (item2 != 0) {
                    item2 = item2[0];
                    if (item.value != item2.value) {
                        _diff.update.push(JSON.parse(item.value));
                    }
                }
            });

            if (_diff.create.length > 0) {
                self.$scope.$broadcast("framework.createControl", _diff.create, true);
            }
            if (_diff.delete.length > 0) {
                $.each(_diff.delete, function (i, item) {
                    $("#oper_" + item.controlId).remove();
                    delete self.$scope.model[item.controlId];
                })
            }
            if (_diff.update.length > 0) {
                $.each(_diff.update, function (i,item) {
                    $("#oper_" + item.controlId).remove();
                    delete self.$scope.model[item.controlId];
                })
                self.$scope.$broadcast("framework.createControl", _diff.update, true);
            }
        }

        self.prev = function () {
            if (self.$scope.$root._history.index > 0 && self.$scope.$root._history.index - 1 >= 0) {
                var step = self.$scope.$root._history.array[self.$scope.$root._history.index - 1];
                _diffModels(step);
                self.$scope.$root._history.index--;
            }
        }

        self.next = function () {
            if (self.$scope.$root._history.index + 1 < self.$scope.$root._history.array.length) {
                var step = self.$scope.$root._history.array[self.$scope.$root._history.index + 1];
                _diffModels(step);
                self.$scope.$root._history.index++;
            }
        }
    }
);
