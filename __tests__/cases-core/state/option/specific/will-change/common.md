__Description__: If `will-change: true` key/value pair is in the `common` `option` object then it should create `will-change` for all the properties across both `on` and `non` `state` object in both `<selector>:<state>` and `<selector>:not(:<state>)`

__Notes__
:
+ In the `common` object `will-change` can be specified in the root or the `option` object
+ You can also specify `will-change` properties via a list: `will-change: 'prop1' 'prop2' 'prop3'`
