__Description__: Should be able to use an `element` object within a `state` `on` and `non` object in combination with `state` properties which should be processed independently

__Notes__

+ Any `option` object properties declared within the root `state` object will be inherited by the `element` if you would like to override this you can either declare a overwriting `option` object in your `element` object or declare `inherit: false`  or `inperitOption: false` in your `element.option` object
    * Check the `state/feature/element/option` tests for more info
+ Notation
    * On: `<selector>:<element>:<state>`
    * Non: `<selector>:<element>:not(:<state>)`