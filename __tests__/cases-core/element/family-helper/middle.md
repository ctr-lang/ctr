__Description__: Select the item in the middle of **n** child. Only works with odd number chain.

__Notes__

+ Parameters
    * `middle(num)`
    * `fm-middle(num)`
+ `fm` prefix to avoid collisions
+ `<elm>:nth-child(${Math.round(num / 2)})`