__Description__: The user can within the `option` object specify the `attribute` key/value pair to represent the attribute selector and then a `value` key/value pair to represent the value with the specified attribute is supposed to target.

__Notes__

+ This is kinda silly thinking about it now, but I will leave it be
+ The `value` value can be quoteless and quotes will be generate
+ If the attribute brackets are omitted they will be generated for you
+ For the tests, I'm defining the `attribute` object within an attribute `component` since attribute selectors target attributes.