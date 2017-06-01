__Description__: Should be able to use a `media` object within a `state` `on` and `non` object in combination with `state` properties and since no new properties are introduced within the `media` object there should be no need to generate new `transition` properties since they will be inherited from the root `state` `transition`

__Notes__

+ Any `option` object properties declared within the root `state` object will be inherited by the `media` if you would like to override this you can either declare a overwriting `option` object in your `media` object or declare `inherit: false`  or `inperitOption: false` in your `media.option` object
    * Check the `state/feature/media/option` tests for more info
