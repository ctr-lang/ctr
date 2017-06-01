__Description__: If a `state` is declared and the user does not specify a auxiliary state within the `state` object or any properties yet they define an `animation` object then it should generate a `on` `state` `transition` for said `animation`

__Notes__

+ Assumes whatever properties defined are meant to be `on` `state` properties and since it's an `animation` there will be no `non` `state` `transition` generated
+ I recommend you always define an auxiliary `state`, `on`, `non`, `common` and avoid using this method
