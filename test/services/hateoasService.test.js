/* global angular*/
(function() {
    'use strict';

    function generateBasicObject(paramName) {
        var obj = {
            bar: 1,
            baz: 2
        };

        paramName = paramName || 'links';

        obj[paramName] = [{
            rel: 'self',
            href: '/foo/:bar/:baz'
        }];

        return obj;
    }

    function expectAndHandleBasicPost($httpBackend) {
        $httpBackend.expectPOST('/foo/1/2');
        $httpBackend.whenPOST('/foo/1/2').respond(function(method, url, data) {
            return [200, data, {}];
        });
    }

    describe('Unit Test: hateoasService', function() {

        it('creates a resource with param defaults from the given URL', inject(function(ngHelperHateoasService, $httpBackend) {

            //It should be able to extract the params from the object and use them to construct the
            //request.
            expectAndHandleBasicPost($httpBackend);

            var Obj = ngHelperHateoasService.createResource('/foo/:bar/:baz');
            var obj = new Obj({
                bar: 1,
                baz: 2
            });

            obj.$save();

            $httpBackend.flush();
        }));

        it('creates a link map with the default paramName', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = generateBasicObject();

            //It should be able to extract the params from the object and use them to construct the
            //request.
            expectAndHandleBasicPost($httpBackend);

            var links = ngHelperHateoasService.createLinkMap(obj);
            expect(links.self.href).toEqual('/foo/:bar/:baz');

            var Obj = links.self.createResource();
            obj = new Obj(obj);

            obj.$save();

            $httpBackend.flush();
        }));

        it('creates a link map with the given paramName', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = generateBasicObject('different');

            //It should be able to extract the params from the object and use them to construct the
            //request.
            expectAndHandleBasicPost($httpBackend);

            var links = ngHelperHateoasService.createLinkMap(obj, 'different');
            expect(links.self.href).toEqual('/foo/:bar/:baz')

            var Obj = links.self.createResource();
            obj = new Obj(obj);

            obj.$save();

            $httpBackend.flush();
        }));



        it('extracts the params from the hateoas URL', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = generateBasicObject();

            //It should be able to extract the params from the object and use them to construct the
            //request.
            expectAndHandleBasicPost($httpBackend);

            ngHelperHateoasService.alterLinks(obj);

            var Obj = obj.links.self.createResource();
            obj = new Obj(obj);

            obj.$save();

            $httpBackend.flush();
        }));

        it('alters the links in an object', inject(function(ngHelperHateoasService) {
            var obj = {
                prop1: 1,
                prop2: [{
                    links: [{
                        rel: 'a',
                        href: 'a1'
                    }]
                }],
                prop3: {
                    prop4: {
                        links: [{
                            rel: 'b',
                            href: 'b1'
                        }]
                    }
                },
                links: [{
                    rel: 'c',
                    href: 'c1'
                }, {
                    rel: 'd',
                    href: 'd1'
                }]

            }

            ngHelperHateoasService.alterLinks(obj);

            expect(obj.prop1).toBeTruthy();
            expect(obj.prop2[0].links.a).toBeTruthy();
            expect(obj.prop3.prop4.links.b).toBeTruthy();
            expect(obj.links.c).toBeTruthy();
            expect(obj.links.d).toBeTruthy();
        }));

        it('alters the links in an object with cycle in the object graph', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = generateBasicObject('hmm');
            obj.cycle = obj;

            ngHelperHateoasService.alterLinks(obj, 'hmm');

            expect(obj.hmm).toBeTruthy();
        }));

        it('alters the links in an object with a non-default name', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = generateBasicObject('hmm');

            //It should be able to extract the params from the object and use them to construct the
            //request.
            expectAndHandleBasicPost($httpBackend);

            ngHelperHateoasService.alterLinks(obj, 'hmm');

            var Obj = obj.hmm.self.createResource();
            obj = new Obj(obj);

            obj.$save();

            $httpBackend.flush();
        }));

        it('removes the altered links from an object', inject(function(ngHelperHateoasService) {
            var obj = generateBasicObject();

            ngHelperHateoasService.alterLinks(obj);
            expect(obj.links).toBeTruthy();
            ngHelperHateoasService.removeLinks(obj);

            expect(obj.links).toBeFalsy();
        }));

        it('removes the altered non-default links from an object', inject(function(ngHelperHateoasService) {
            var obj = generateBasicObject('what');

            ngHelperHateoasService.alterLinks(obj, 'what');
            expect(obj.what).toBeTruthy();
            ngHelperHateoasService.removeLinks(obj, 'what');

            expect(obj.what).toBeFalsy();
        }));
    });
})();
