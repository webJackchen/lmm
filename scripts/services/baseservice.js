'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.baseService
 * @description
 * # baseService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('baseService', ['$q', '$resource', 'GlobalConfig', 'SessionService',
        function ($q, $resource, globalConfig, SessionService) {
            var self = this;
            //他的依赖，表示没有$resource，BaseSvr就无法工作，可以用于做一些自定义的操作
            self.rely = $resource;

            /*
            使用方式:
            1: '[url]','[method]','[authorizationCode]'
            2: '[url]','[{method:'method',authorizationCode:''...其它参数...}]'
            3:  [{url:'',method:'',authorizationCode:'',callback:...,fialCallback:...}]
            4:  [{url:'',method:'',authorizationCode:'',callback:...,fialCallback:...}],{...参数...}
            5:  每次传递方法的最后一个函数将默认为回调函数（调用成功或失败都将执行该函数），如果最后两个参数都为function则最后一个将会返回失败的信息
            */
            var requestApi = function (request) {
                var authorCode = "",
                    deferred = $q.defer();

                var req = (angular.isObject(arguments[0]) && arguments[0]),
                    url = (angular.isString(request) && request) || req.url,
                    paras = (angular.isObject(arguments[1]) && arguments[1]) || (angular.isObject(arguments[2]) && arguments[2]),
                    fcall = (angular.isFunction(arguments[arguments.length - 1]) && arguments[arguments.length - 1]) || req.fialCallback,
                    call = angular.isFunction(arguments[arguments.length - 2]) && arguments[arguments.length - 2] || req.callback || fcall,

                    method = req.method || (angular.isString(arguments[1]) && arguments[1])
                    || (paras && paras.method || arguments[2]) || '',
                    authorizationCode = authorCode || req.authorizationCode || (angular.isString(arguments[2]) && arguments[2])
                    || (paras && paras.authorizationCode || arguments[3]) || '',

                    headerPara = (authorizationCode && { 'AuthorizationCode': authorizationCode }) || {};

                delete paras.method;
                delete paras.authorizationCode;

                if (!method && arguments.length == 2) {
                    if (!call || !angular.isFunction(call))
                        call = arguments[1];
                    fcall = undefined;
                }
                else if (!authorizationCode && arguments.length == 3) {
                    if (!call || !angular.isFunction(call))
                        call = arguments[1];
                    if (!fcall || !angular.isFunction(fcall))
                        fcall = arguments[2];
                }

                var serviceUri = ((url.indexOf("http://") == 0 && url) || globalConfig.service.restServerUrl + url);
                var res = self.rely(serviceUri, {}, {
                    request: {
                        method: method || 'GET',
                        isArray: false,
                        headers: headerPara
                    }
                });

                res.request(paras, function (result) {
                    if (!!result) SessionService.updateExpire();//如果能执行成功则更新会话状态
                    deferred.resolve(result);
                    return call && call(result);
                }, function (failure) {
                    deferred.reject(failure);
                    return fcall && fcall(failure);
                });

                return deferred.promise;
            }

            self.get = function (url, paras, callback) {
                return requestApi(url, 'GET', paras, callback);
            }
            self.post = function (url, paras, callback) {
                return requestApi(url, 'POST', paras, callback);
            }
            self.put = function (url, paras, callback) {
                return requestApi(url, 'PUT', paras, callback);
            }
            self.delete = function (url, paras, callback) {
                return requestApi(url, 'DELETE', paras, callback);
            }
        }
  ]);
