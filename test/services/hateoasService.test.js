/* global angular*/
(function() {
    'use strict';

    describe('Unit Test: hateoasService', function() {

        it('extracts the params from the hateoas URL', inject(function(ngHelperHateoasService, $httpBackend) {
            var obj = {
                bar: 1,
                baz: 2,
                links: [{
                    rel: 'self',
                    href: '/foo/:bar/:baz'
                }]
            };

            //It should be able to extract the params from the object and use them to construct the
            //request.
            $httpBackend.expectPOST('/foo/1/2');
            $httpBackend.whenPOST('/foo/1/2').respond(function(method, url, data) {
                return [200, data, {}];
            });

            ngHelperHateoasService.alterLinks(obj);

            var Obj = obj.links.self.resource();
            obj = new Obj(obj);

            obj.$save();

            $httpBackend.flush();
        }))

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
    });
})();
