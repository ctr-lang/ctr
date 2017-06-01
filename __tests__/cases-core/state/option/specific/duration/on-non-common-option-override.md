__Description__: If there is a `duration: <value>` key/value pair within the `common` `state` object then said `duration` value should be applied to the `transition-duration` in both `<selector>:<state>` and `<selector>:not(:<state>)` although if there is a `duration: <value>` key/value pair specified within either the `on` or `non` object they will supersede the `common` `duration` value

__Notes__
:
+ In the `common` object `duration` can be specified in the root or the `option` object