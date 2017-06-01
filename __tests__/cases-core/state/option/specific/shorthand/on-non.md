__Description__:  If there is a `shorthand` object in the `option` object within a `on` or `non` `state` object then said `shorthand` values should be applied across all properties in both `<selector>:<state>` and `<selector>:not(:<state>)`

__Notes__

+ There is no need for you to specify all three `shorthand` values and if you omit any it will just inherit the default set value
+ `shorthand` does not have to be defined in the `option` object and can be defined in the root
