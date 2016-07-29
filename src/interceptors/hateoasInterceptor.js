/* global angular*/
(function() {
    'use strict';

    angular.module('ngHateoasHelper.hateoasInterceptor', [])
        .factory('ngHelperHateoasInterceptor', ['ngHelperHateoasService', function(hateoasService) {
            return {
                request: function(config) {
                    if (config.data && config.data.links) {
                        config.data = _.omit(config.data, ['links']);
                    }
                    return config;
                },
                response: function(response) {
                    hateoasService.alterLinks(response.data);
                    return response;
                }
            };
        }]);
})();
