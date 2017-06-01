__Description__: Should be able to use an `non` object within a `state` `on` and `non` object in combination with `state` properties which should be processed independently

__Notes__

+ Any `option` object properties declared within the root `state` object will be inherited by the `non` if you would like to override this you can either declare a overwriting `option` object in your `non` object or declare `inherit: false`  or `inperitOption: false` in your `non.option` object
    * Check the `state/feature/non/option` tests for more info
+ Notation
    * On: `<selector>:not(<non>):<state>`
    * Non: `<selector>:not(<non>):not(:<state>)`