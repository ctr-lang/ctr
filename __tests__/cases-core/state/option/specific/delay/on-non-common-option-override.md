__Description__: If there is a `delay: <value>` key/value pair within the `common` `state` object then said `delay` value should be applied to the `transition-delay` in both `<selector>:<state>` and `<selector>:not(:<state>)` although if there is a `delay: <value>` key/value pair specified within either the `on` or `non` object they will supersede the `common` `delay` value

__Notes__
:
+ In the `common` object `delay` can be specified in the root or the `option` object