__Description__: If a `attributes` object is comprised of children objects assume that each child object is a separate instance of a `attribute`. Furthermore, if there is no `key` key/value pair specified within the `attribute` child object assume the user wishes to use the object key as the `attribute` selector key.


__Notes__

+ regex: `/^attrs$|^attributes$|^customAts|^customAttrs|^customAttributes/i`
+ All children objects of the `attribute` object must be associated with attributes. For example, you cannot place a `state` object within the `attribute` object
+ For the most part, you should be able to use most types of attribute key notation
+ If the attribute brackets are omitted they will be generated
+ For the tests, I'm defining  the `attribute` object within an attribute `component` since attribute selectors target attributes
