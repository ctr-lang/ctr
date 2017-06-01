__Description__: This I/O mixin will only select the first of **x** items. It will not work if there is not as much as item as you set in **$limit**

__Notes__

+ Parameters
    * `first-of(limit)`
    * `fm-first-of(limit)`
    * `firstOf(limit)`
+ `fm` prefix to avoid collisions
+ `<elm>:nth-last-child(${limit}):first-child`