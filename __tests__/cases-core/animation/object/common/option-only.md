__Description__: If there are multiple common options among individual timelines the user should be able to specify a `common` or `global` object at the root `animations` object level and within that object an `option` object is specified will in turn will be inherited across all individual timeline and supersede the set defaults, although, not the locally specified options within an individual timeline `option` object

__Notes__

+ Priority `local option > common option > default option`