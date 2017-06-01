__Description__: Should be able to use an `attribute` object within a `state` `on` and `non` object in combination with `state` properties which should be processed independently

__Notes__

+ Any `option` object properties declared within the root `state` object will be inherited by the `attribute` if you would like to override this you can either declare a overwriting `option` object in your `attribute` object or declare `inherit: false`  or `inperitOption: false` in your `attribute.option` object
    * Check the `state/feature/attribute/option` tests for more info
+ Notation
    * On: `<selector><attribute>:<state>`
    * Non: `<selector><attribute>:not(:<state>)`