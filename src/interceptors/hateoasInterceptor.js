/* global angular*/
(function() {
    'use strict';

    /**
     * @param {ng.service} hateoasService - service that does the work.
     * @param {String} paramName - optional string. otherwise default it used.
     */
    function HateoasInterceptor(hateoasService, paramName) {
        /**
         * remove the paramName object from the request object
         */
        this.request = function(config) {
            if (config.data) {
                config.data = hateoasService.removeLinks(angular.copy(config.data), paramName);
            }
            return config;
        };
        /**
         * Alter the response hateoas data to be more useful
         */
        this.response = function(response) {
            hateoasService.alterLinks(response.data, paramName);
            return response;
        };
    }

    /**
     * interceptor to alter all requests and responses that contain the matching paramName (defaults to links)
     */
    angular.module('ngHateoasHelper.hateoasInterceptor', []).provider('ngHelperHateoasInterceptor', function() {
        var paramName = null;

        /*Allows the paramName to be updated before configuring the interceptor.
        After configutaion it is too late to change things.*/
        this.updateParamName = function(name) {
            paramName = name;
        }

        this.$get = ['ngHelperHateoasService', function(hateoasService) {
            return new HateoasInterceptor(hateoasService, paramName)
        }];
    });
})();
