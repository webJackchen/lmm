'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.messengerService
 * @description
 * # messengerService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('messengerService', function () {
      var self = this;
      var _baseMessenger = function (message, type) {
          Messenger({ extraClasses: "messenger-fixed messenger-on-top" }).post({
              message: message,
              type: type,
              showCloseButton: true
          });
      }

      self.success = function (message) {
          _baseMessenger(message, "success");
      }

      self.error = function (message) {
          _baseMessenger(message, "error");
      }

      self.info = function (message) {
          _baseMessenger(message, "info");
      }

      /*
        msgObj: { title:"", message:"", btnOK:"", btnNo:"", btnCancel:"" } || "message"
      */
      self.confirm = function (msgObj, callback, $scope) {
          var template = "<div id=\"#id#\" class=\"modal fade\" role=\"dialog\" style=\"z-index:99999;\">" +
                             "<div class=\"modal-dialog\">" +
                                 "<div class=\"modal-content\">" +
                                     "<div class=\"modal-header\">" +
                                         "<button name=\"btnCancel\" type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>" +
                                         "<h4 id=\"title\" class=\"modal-title\">#title#</h4>" +
                                     "</div>" +
                                     "<div id=\"body\" class=\"modal-body\">#body#</div>" +
                                     "<div class=\"modal-footer\">" +
                                         "<button type=\"button\" name=\"btnOK\" class=\"btn btn-normal btn-primary\" data-dismiss=\"modal\" style=\"margin-right:5px; min-width:54px;\">#ok#</button>" +
                                         (!!msgObj.btnNo ? "<button type=\"button\" name=\"btnNo\" class=\"btn btn-normal btn-primary\" data-dismiss=\"modal\" style=\"margin-right:5px; min-width:54px;\">#no#</button>" : "") +
                                         "<button type=\"button\" name=\"btnCancel\" class=\"btn btn-normal btn-default\" data-dismiss=\"modal\" style=\"min-width:54px;\">#cancel#</button>" +
                                     "</div>" +
                                 "</div>" +
                             "</div>" +
                         "</div>";

          var id = "confirmMessager_" + (new Date).getTime(),
              $modal = "";
          if (typeof (msgObj) == "string") {
              $modal = $(template.replace("#id#", id)
                                 .replace("#title#", "提示")
                                 .replace("#body#", msgObj)
                                 .replace("#ok#", "确定")
                                 .replace("#cancel#", "取消"));
          } else {
              $modal = $(template.replace("#id#", id)
                                 .replace("#title#", msgObj.title || "提示")
                                 .replace("#body#", msgObj.message)
                                 .replace("#ok#", msgObj.btnOK || "确定")
                                 .replace("#no#", msgObj.btnNo || "否")
                                 .replace("#cancel#", msgObj.btnCancel || "取消"));
          }

          $modal.find("[name='btnOK']").on("click", function () {
              $scope.$apply(function () {
                  if (typeof (callback) == "function") {
                      callback(true);
                  } else {
                      $scope[callback](true);
                  }
              });
              setTimeout(function () {
                  _clearModal();
              }, 1000);
          });

          $modal.find("[name='btnNo']").on("click", function () {
              $scope.$apply(function () {
                  if (typeof (callback) == "function") {
                      callback("no");
                  } else {
                      $scope[callback]("no");
                  }
              });
              setTimeout(function () {
                  _clearModal();
              }, 1000);
          });

          $modal.find("[name='btnCancel']").on("click", function () {
              $scope.$apply(function () {
                  if (typeof (callback) == "function") {
                      callback(false);
                  } else {
                      $scope[callback](false);
                  }
              });
              setTimeout(function () {
                  _clearModal();
              }, 1000);
          });

          $("body").append($modal);
          $modal.modal("show");

          var _clearModal = function () {
              var $modal = $("body").find("#" + id);
              $modal.find("[name='btnOK']").off("click");
              $modal.find("[name='btnCancel']").off("click");
              $modal.remove();
          }
      }
  });
