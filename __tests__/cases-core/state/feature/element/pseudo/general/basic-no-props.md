__Description__: Should be able to use a `pseudo-element` object within a `state` `on` and `non` object

__Notes__

+ `pseudo-element`
    * `::after`
    * `::before`
    * `::first-letter`
    * `::first-line`
    * `::selection`
    * `::backdrop`
+ Notation
    * On: `<selector>:<state>::<pseudo-element>`
    * Non: `<selector>:not(:<state>)::<pseudo-element>`