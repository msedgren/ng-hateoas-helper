ng-hateoas-helper
================

A helper library for dealing with HATEOAS (using HAL) links and angular 1.x resources. This library allows: 

* The conversion of a HATEOAS link array into an object that maps the relation to a new object. This new object contains the href for the relation and a function for creating a resource.
* The automatic addition of params to newly created resources. For example, 'foo/:bar/:baz' should have':bar' and ':bar' added as params. Then when a new resource is created, from an existing object, these values should be used. As an example, this is helpful for navigating links to new resources that can be created.
* An interceptor that automatically converts the links in responses to the new object type mentioned above.