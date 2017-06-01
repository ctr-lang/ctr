__Description__: If a `state` is declared and the user does not specify a auxiliary state within the `state` object or any properties yet they define an `pseudo-element` object then it should generate both a `on` and `non` `state` `transition` for said `pseudo-element`

__Notes__

+ The `content` property will be applied to both `on` and `non`
+ Assumes whatever properties defined are meant to be `on` `state` properties
+ I recommend you always define an auxiliary `state`, `on`, `non`, `common` and avoid using this method
