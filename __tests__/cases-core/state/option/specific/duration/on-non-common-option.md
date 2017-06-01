__Description__: If there is a `duration: <value>` key/value pair specified in the `common` `state` object then said `duration` value should be applied to the `transition-duration` in both `<selector>:<state>` and `<selector>:not(:<state>)` and applied across all specified properties

__Notes__
:
+ In the `common` object `duration` can be specified in the root or the `option` object
+ If there is also a `duration` specified within either the `on` or `non` object they will supersede the `common` `duration`