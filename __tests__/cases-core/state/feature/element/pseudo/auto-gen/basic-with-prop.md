__Description__: If a `state` is declared and the user does not specify a auxiliary state within the `state` object although they define a `pseudo-element` object as well as `state` properties then not only generate a `on` `state` `transition` for said `pseudo-element` but also generate a `state` `transition` for all enclosed properties

__Notes__

+ The `content` property will be applied to both `on` and `non`
+ Assumes whatever properties defined are meant to be `on` `state` properties
+ I recommend you always define an auxiliary `state`, `on`, `non`, `common` and avoid using this method