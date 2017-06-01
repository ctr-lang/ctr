__Description__: If a `state` is declared and the user does not specify a auxiliary state within the `state` object or any properties yet they define an `non` object then it should generate both a `on` and `non` `state` `transition` for said `non`

__Notes__

+ You need to use the `not` notation if you wish to do this
+ Assumes whatever properties defined are meant to be `on` `state` properties
+ I recommend you always define an auxiliary `state`, `on`, `non`, `common` and avoid using this method
