__Description__: Should be able to use an `component` object within a `state` `on` and `non` object in combination with `state` properties which should be processed independently

__Notes__

+ Any `option` object properties declared within the root `state` object will be inherited by the `component` if you would like to override this you can either declare a overwriting `option` object in your `component` object or declare `inherit: false`  or `inperitOption: false` in your `component.option` object
    * Check the `state/feature/component/option` tests for more info
+ Notation
    * On: `<selector>:<state> > <component>`
    * Non: `<selector>:not(:<state>) > <component>`