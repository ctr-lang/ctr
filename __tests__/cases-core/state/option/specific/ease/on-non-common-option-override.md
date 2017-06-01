__Description__: If there is a `ease: <value>` key/value pair within the `common` `state` object then said `ease` value should be applied to the `transition-timing-function` in both `<selector>:<state>` and `<selector>:not(:<state>)` although if there is a `ease: <value>` key/value pair specified within either the `on` or `non` object they will supersede the `common` `ease` value

__Notes__
:
+ In the `common` object `ease` can be specified in the root or the `option` object