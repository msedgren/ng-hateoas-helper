/* global angular*/
(function() {
    'use strict';

    function HateoasService($injector) {
        this._$injector = $injector;
    }

    HateoasService.prototype = {
        /**
         * return true if the object is in the visited array.
         */
        hasVisited: function(obj, visited) {
            var length = visited.length;
            for (var i = 0; i < length; i++) {
                if (visited[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        createResource: function(url) {
            var $resource = this._$injector.get('$resource');
            var regex = /\/:([^\/]+)/g;
            var match;
            var defaults = {}
            while (match = regex.exec(url)) {
                defaults[match[1]] = '@' + match[1];
            }
            return $resource(url, defaults);
        },
        /**
         * A recursive function that will alter links from an array to a
         * map of rel -> href.
         */
        alterLinks: function(object, visited) {
            var service = this;

            if (!visited) visited = [];
            if (!object || service.hasVisited(object, visited)) return;

            visited.push(object);

            if (Array.isArray(object)) {
                object.forEach(function(cur) {
                    service.alterLinks.apply(service, [cur, visited]);
                });
            } else if (angular.isObject(object)) {
                if (object.links && Array.isArray(object.links)) {
                    object.links = object.links.reduce(function(links, o) {
                        links[o.rel] = {
                            href: o.href,
                            resource: service.createResource.bind(service, o.href)
                        };
                        return links;
                    }, {});
                }

                Object.keys(object).forEach(function(key) {
                    var value = object[key];
                    service.alterLinks.apply(service, [value, visited]);
                });
            }
            return object;
        }
    }

    angular.module('ngHateoasHelper.hateoasService', []).service('ngHelperHateoasService', ['$injector', HateoasService]);
})();
