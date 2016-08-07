/* global angular*/
(function() {
    'use strict';

    describe('Unit Test: hateoas interceptor', function() {

        it('creates the interceptor and tests with it.', inject(function(ngHelperHateoasInterceptor) {
            var response = {
                data: {
                    links: [{
                        rel: 'self',
                        href: '/foo/:bar/:baz'
                    }]
                }
            }

            ngHelperHateoasInterceptor.response(response);
            expect(response.data.links.self).toBeTruthy();
        }));
    });
})();
