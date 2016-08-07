/* global angular*/
(function() {
    'use strict';

    /**
     * The transformed hateoas links.
     */
    function HateoasLinks() {}

    /**
     * class that is added in the hateoas links.
     * @param {string} href - The URL found with the hateoas link.
     * @param {object} original - the original object that was found.
     * @param {HateoasService} hateoasService
     */
    function HateoasHelper(href, original, hateoasService) {
        this.href = href;
        this.original = original;
        this._hateoasService = hateoasService;
    }

    HateoasHelper.prototype = {
        /**
         * Generate an angular resource class from the href constained in this HateoasHelper.
         * @return {ng.resource}
         */
        createResource: function() {
            return this._hateoasService.createResource(this.href);
        }
    }

    /**
     * angular service for helping with hateoas links.
     * Alter paramName to change the defualt paramName that is used.
     */
    function HateoasService($injector) {
        this._$injector = $injector;
        this.paramName = 'links';
    }

    HateoasService.prototype = {
        /**
         * Given a URL, generate an angular resource class.
         * Any portion of the path preceeded by a slash and that starts with ':'' will be used to
         * generate a parameter default with a matching name. For example '/foo/:bar'
         * would be the same as  $resource('/foo/:bar', {bar:'@bar'});
         * @param {string} url - the url used to generate the resource.
         * @return {ng.resource} Resource object created from the url.
         */
        createResource: function(url) {
            var regex = /\/:([^\/]+)/g;
            var match;
            var defaults = {};
            var $resource = this._$injector.get('$resource');

            while (match = regex.exec(url)) {
                defaults[match[1]] = '@' + match[1];
            }
            return $resource(url, defaults);
        },
        /**
         * pull out the link array and alter it into somthing more useful.
         * @param {Object} object - the object that contains paramName. Defaults to 'links'.
         * @param {string} paramName - the object key to use when generating the link map.
         * @return {Object} A map of rel -> object with href and other helpful functions.
         */
        createLinkMap: function(object, paramName) {
            var service = this;
            paramName = paramName || this.paramName;
            if (object && object[paramName] && Array.isArray(object[paramName])) {
                return object[paramName].reduce(function(links, o) {
                    links[o.rel] = new HateoasHelper(o.href, links[o.rel], service);
                    return links;
                }, new HateoasLinks());
            }
            return null;
        },
        /**
         * A recursive function that will alter values with the associated key paramName (defaults to 'links')
         * from an array to a map of rel -> object with href and other helpful functions..
         * This is a call that mutates the object passed into the function.
         * @param {Object} object -  the object to mutate.
         * @param {string} paramName - the object key to use when altering the object.
         * @return {Object} the object that was mutated. (Same as the object passed in.)
         */
        alterLinks: function(object, paramName) {
            var service = this;

            function callback(obj, prm) {
                if (obj[prm]) {
                    var linkMap = service.createLinkMap(obj, prm);
                    if (linkMap) {
                        obj[prm] = linkMap;
                    }
                }
            }
            this._navigate(object, callback.bind(service), paramName);
            return object;
        },
        /**
         * A recursive function that will remove paramname (defaults to 'links')
         * @param {Object} object - the object to mutate.
         * @param {string} paraname - the object key to remove from the object.
         */
        removeLinks: function(object, paramName) {
            function callback(obj, prm) {
                if (obj[prm] && obj[prm] instanceof HateoasLinks) {
                    delete obj[prm];
                }
            }
            this._navigate(object, callback, paramName);
            return object;
        },
        /**
         * helper function to prevent loops while naviagting the object graph.
         * @return true if the object is in the visited array.
         */
        _hasVisited: function(obj, visited) {
            return !!visited.filter(function(cur) {
                return cur === obj;
            }).length;
        },
        /**
         * helper function for naviagting an object looking for paramName (defaults to 'links').
         * Invokes callback on each matching value found.
         * @param {Object} object - the object to navigate;
         * @param {function<object, paramName>} callback - invoked on matches
         * @param {string} paramName - property key to look for. defaults to 'links'
         * @param {Array} visited - objects we have already visited.
         * @return {Object} the object passed in
         */
        _navigate: function(object, callback, paramName, visited) {
            var service = this;

            paramName = paramName || this.paramName;
            visited = visited || [];

            //If we have already visited the object don't visit it again
            if (object && !service._hasVisited(object, visited)) {
                visited.push(object);

                if (Array.isArray(object)) {
                    service._navigateArray(object, callback, paramName, visited);
                } else if (angular.isObject(object)) {
                    service._navigateObject(object, callback, paramName, visited);
                    callback(object, paramName);
                }
            }
            return object;
        },
        /**
         * helper function for naviagting an array.
         * @param {Array} arry - the Array to navigate;
         * @param {function} callback - passed back to calling navigate.
         * @param {string} paramName - passed back to the calling navigate.
         * @param {Array} visited - passed back to the calling navigate.
         * @return {Array} the array passed in
         */
        _navigateArray: function(arry, callback, paramName, visited) {
            var service = this;

            arry.forEach(function(cur) {
                service._navigate(cur, callback, paramName, visited);
            });
            return arry;
        },
        /**
         * helper function for naviagting an object.
         * @param {Object} object - the object to navigate;
         * @param {function} callback - passed back to calling navigate.
         * @param {string} paramName - passed back to the calling navigate.
         * @param {Array} visited - passed back to the calling navigate.
         * @return the object passed in.
         */
        _navigateObject: function(object, callback, paramName, visited) {
            var service = this;

            Object.keys(object).forEach(function(key) {
                var value = object[key];
                service._navigate(value, callback, paramName, visited);
            });
            return object;
        }
    }

    angular.module('ngHateoasHelper.hateoasService', []).service('ngHelperHateoasService', ['$injector', HateoasService]);
})();
